import type { NextFunction, Request, Response } from 'express'
import type { THttpError } from '../types/index.js'

export const globalErrorHandler = (
  err: THttpError,
  _req: Request,
  res: Response,
  __: NextFunction
) => {
  res.status(err.statusCode).json(err)
}
