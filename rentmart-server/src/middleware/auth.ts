import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import responseMessage from '../constant/responseMessage.js'
import { httpError } from '../util/httpError.js'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token as string | undefined

    if (!token) {
      return httpError(next, new Error(responseMessage.UNAUTHORIZED), req, 401)
    }

    const decoded = jwt.verify(token, config.ACCESS_TOKEN.SECRET)
    req.user = decoded as { id: string; role?: string }
    next()
  } catch (_error) {
    return httpError(next, new Error(responseMessage.UNAUTHORIZED), req, 401)
  }
}

export const requireRole =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role
    if (!userRole || !roles.includes(userRole)) {
      return httpError(next, new Error(responseMessage.UNAUTHORIZED), req, 403)
    }
    next()
  }
