import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config/index.js";
import responseMessage from "../constant/responseMessage.js";
import { prisma } from "../lib/db.js";
import {
  changePasswordSchema,
  loginSchema,
  resendOtpSchema,
  signupSchema,
  verifyOtpSchema,
} from "../schema/auth.schema.js";
import { sendEmail } from "../util/email.js";
import { httpError } from "../util/httpError.js";
import { httpResponse } from "../util/httpResponse.js";

// OTP Helpers

const OTP_EXPIRY_MINUTES = 10;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createAndSendOtp(
  userId: string,
  email: string,
  name: string,
): Promise<void> {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Remove any previous OTPs for this user + purpose, then create fresh one
  await prisma.otpVerification.deleteMany({
    where: { userId, purpose: "email-verification" },
  });
  await prisma.otpVerification.create({
    data: { userId, otpHash, purpose: "email-verification", expiresAt },
  });

  await sendEmail({ type: "otp", to: email, name, otp });
}

// Helpers

function parseBody<T>(
  schema: z.ZodType<T>,
  body: unknown,
  next: NextFunction,
  req: Request,
): T | null {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues
      .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    httpError(next, new Error(message), req, 422);
    return null;
  }
  return result.data;
}

function setAuthCookie(res: Response, token: string): void {
  res.cookie("token", token, {
    httpOnly: true,
    secure: config.ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// Controller

export default {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = parseBody(signupSchema, req.body, next, req);
      if (!body) return;

      const { name, email, password, role } = body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return httpError(
          next,
          new Error(responseMessage.ALREADY_EXISTS("User", email)),
          req,
          400,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true,
          emailVerified: true,
        },
      });

      // Send OTP — fire-and-forget so signup still returns if email fails
      createAndSendOtp(newUser.id, email, name).catch(() => {
        // already logged inside createAndSendOtp
      });

      httpResponse(req, res, 201, responseMessage.SUCCESS, {
        ...newUser,
        message:
          "Account created. A 6-digit OTP has been sent to your email. Please verify to activate your account.",
      });
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = parseBody(loginSchema, req.body, next, req);
      if (!body) return;

      const { email, password } = body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return httpError(
          next,
          new Error(responseMessage.INVALID_CREDENTIALS),
          req,
          401,
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return httpError(
          next,
          new Error(responseMessage.INVALID_CREDENTIALS),
          req,
          401,
        );
      }

      // Block login until email is verified
      if (!user.emailVerified) {
        return httpError(
          next,
          new Error(responseMessage.EMAIL_NOT_VERIFIED),
          req,
          403,
        );
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        config.ACCESS_TOKEN.SECRET,
        { expiresIn: "7d" },
      );

      setAuthCookie(res, token);

      httpResponse(req, res, 200, responseMessage.SUCCESS, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  logout: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: config.ENV === "production",
        sameSite: "strict",
      });
      httpResponse(req, res, 200, responseMessage.SUCCESS, null);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return httpError(
          next,
          new Error(responseMessage.UNAUTHORIZED),
          req,
          401,
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true,
        },
      });

      if (!user) {
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND("User")),
          req,
          404,
        );
      }

      httpResponse(req, res, 200, responseMessage.SUCCESS, user);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = parseBody(changePasswordSchema, req.body, next, req);
      if (!body) return;

      const { oldPassword, newPassword } = body;
      const userId = req.user?.id;

      if (!userId) {
        return httpError(
          next,
          new Error(responseMessage.UNAUTHORIZED),
          req,
          401,
        );
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND("User")),
          req,
          404,
        );
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return httpError(
          next,
          new Error(responseMessage.INVALID_CREDENTIALS),
          req,
          401,
        );
      }

      await prisma.user.update({
        where: { id: userId },
        data: { password: await bcrypt.hash(newPassword, 10) },
      });

      httpResponse(req, res, 200, responseMessage.SUCCESS, {
        message: "Password changed successfully",
      });
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  verifyOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = parseBody(verifyOtpSchema, req.body, next, req);
      if (!body) return;

      const { email, otp } = body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND("User")),
          req,
          404,
        );
      }

      if (user.emailVerified) {
        return httpError(
          next,
          new Error(responseMessage.EMAIL_ALREADY_VERIFIED),
          req,
          400,
        );
      }

      const record = await prisma.otpVerification.findFirst({
        where: {
          userId: user.id,
          purpose: "email-verification",
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!record) {
        return httpError(
          next,
          new Error(responseMessage.OTP_INVALID_OR_EXPIRED),
          req,
          400,
        );
      }

      const isMatch = await bcrypt.compare(otp, record.otpHash);
      if (!isMatch) {
        return httpError(
          next,
          new Error(responseMessage.OTP_INVALID_OR_EXPIRED),
          req,
          400,
        );
      }

      // Mark email as verified and clean up OTP records
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true },
        }),
        prisma.otpVerification.deleteMany({
          where: { userId: user.id, purpose: "email-verification" },
        }),
      ]);

      // Send welcome email – fire and forget
      sendEmail({ type: "welcome", to: email, name: user.name }).catch(
        () => {},
      );

      httpResponse(req, res, 200, responseMessage.SUCCESS, {
        message: "Email verified successfully. You can now log in.",
      });
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  resendOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = parseBody(resendOtpSchema, req.body, next, req);
      if (!body) return;

      const { email } = body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND("User")),
          req,
          404,
        );
      }

      if (user.emailVerified) {
        return httpError(
          next,
          new Error(responseMessage.EMAIL_ALREADY_VERIFIED),
          req,
          400,
        );
      }

      await createAndSendOtp(user.id, email, user.name);

      httpResponse(req, res, 200, responseMessage.SUCCESS, {
        message: "A new OTP has been sent to your email.",
      });
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },
};
