import nodemailer from "nodemailer";
import logger from "./logger.js";

const FROM_NAME = "RentMart";
const FROM_ADDRESS = process.env.SMTP_FROM || "no-reply@rentmart.com";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type EmailPayload =
  | { type: "otp"; to: string; name: string; otp: string }
  | { type: "custom"; to: string; subject: string; html: string; text?: string }
  | { type: "welcome"; to: string; name: string }
  | { type: "password-changed"; to: string; name: string };

function buildOtpEmail(name: string, otp: string) {
  return {
    subject: "Verify your RentMart account",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#2563eb">RentMart Email Verification</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;
                    background:#f1f5f9;padding:16px 24px;border-radius:8px;margin:24px 0">
          ${otp}
        </div>
        <p style="color:#64748b;font-size:13px">If you did not create a RentMart account, ignore this email.</p>
      </div>`,
    text: `Hi ${name},\n\nYour RentMart verification OTP is: ${otp}\n\nIt expires in 10 minutes.\n\nIf you did not create a RentMart account, ignore this email.`,
  };
}

function buildWelcomeEmail(name: string) {
  return {
    subject: "Welcome to RentMart!",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#2563eb">Welcome to RentMart, ${name}!</h2>
        <p>Your account has been verified. You can now log in and start renting or listing equipment.</p>
      </div>`,
    text: `Welcome to RentMart, ${name}!\n\nYour account has been verified. You can now log in.`,
  };
}

function buildPasswordChangedEmail(name: string) {
  return {
    subject: "Your RentMart password was changed",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#2563eb">Password Changed</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your RentMart account password was successfully changed.</p>
        <p style="color:#64748b;font-size:13px">If you did not make this change, please contact support immediately.</p>
      </div>`,
    text: `Hi ${name},\n\nYour RentMart account password was successfully changed.\n\nIf you did not make this change, contact support immediately.`,
  };
}

// ─── Main send function ───────────────────────────────────────────────────────

export async function sendEmail(payload: EmailPayload): Promise<void> {
  let to: string;
  let subject: string;
  let html: string;
  let text: string | undefined;

  switch (payload.type) {
    case "otp": {
      const tpl = buildOtpEmail(payload.name, payload.otp);
      to = payload.to;
      subject = tpl.subject;
      html = tpl.html;
      text = tpl.text;
      break;
    }
    case "welcome": {
      const tpl = buildWelcomeEmail(payload.name);
      to = payload.to;
      subject = tpl.subject;
      html = tpl.html;
      text = tpl.text;
      break;
    }
    case "password-changed": {
      const tpl = buildPasswordChangedEmail(payload.name);
      to = payload.to;
      subject = tpl.subject;
      html = tpl.html;
      text = tpl.text;
      break;
    }
    case "custom": {
      to = payload.to;
      subject = payload.subject;
      html = payload.html;
      text = payload.text;
      break;
    }
  }

  try {
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_ADDRESS}>`,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent (${payload.type}) → ${to} [${info.messageId}]`);
  } catch (error) {
    logger.error(`Failed to send email (${payload.type}) → ${to}`, error);
    throw error;
  }
}
