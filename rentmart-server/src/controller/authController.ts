import bcrypt from 'bcrypt'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import config from '../config/index.js'
import responseMessage from '../constant/responseMessage.js'
import { prisma } from '../lib/db.js'
import { httpError } from '../util/httpError.js'
import { httpResponse } from '../util/httpResponse.js'

// Zod Schemas

const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['RENTER', 'OWNER']).optional().default('RENTER'),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

// Helpers

function parseBody<T>(
  schema: z.ZodType<T>,
  body: unknown,
  next: NextFunction,
  req: Request
): T | null {
  const result = schema.safeParse(body)
  if (!result.success) {
    const message = result.error.issues
      .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
      .join(', ')
    httpError(next, new Error(message), req, 422)
    return null
  }
  return result.data
}

function setAuthCookie(res: Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

// Controller

export default {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = parseBody(signupSchema, req.body, next, req)
      if (!body) return

      const { name, email, password, role } = body

      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return httpError(
          next,
          new Error(responseMessage.ALREADY_EXISTS('User', email)),
          req,
          400
        )
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true,
        },
      })

      httpResponse(req, res, 201, responseMessage.SUCCESS, newUser)
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = parseBody(loginSchema, req.body, next, req)
      if (!body) return

      const { email, password } = body

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return httpError(
          next,
          new Error(responseMessage.INVALID_CREDENTIALS),
          req,
          401
        )
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return httpError(
          next,
          new Error(responseMessage.INVALID_CREDENTIALS),
          req,
          401
        )
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        config.ACCESS_TOKEN.SECRET,
        { expiresIn: '7d' }
      )

      setAuthCookie(res, token)

      httpResponse(req, res, 200, responseMessage.SUCCESS, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      })
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },

  logout: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: config.ENV === 'production',
        sameSite: 'strict',
      })
      httpResponse(req, res, 200, responseMessage.SUCCESS, null)
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },

  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id
      if (!userId) {
        return httpError(
          next,
          new Error(responseMessage.UNAUTHORIZED),
          req,
          401
        )
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
      })

      if (!user) {
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND('User')),
          req,
          404
        )
      }

      httpResponse(req, res, 200, responseMessage.SUCCESS, user)
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },

  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = parseBody(changePasswordSchema, req.body, next, req)
      if (!body) return

      const { oldPassword, newPassword } = body
      const userId = req.user?.id

      if (!userId) {
        return httpError(
          next,
          new Error(responseMessage.UNAUTHORIZED),
          req,
          401
        )
      }

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND('User')),
          req,
          404
        )
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch) {
        return httpError(
          next,
          new Error(responseMessage.INVALID_CREDENTIALS),
          req,
          401
        )
      }

      await prisma.user.update({
        where: { id: userId },
        data: { password: await bcrypt.hash(newPassword, 10) },
      })

      httpResponse(req, res, 200, responseMessage.SUCCESS, {
        message: 'Password changed successfully',
      })
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },
}
