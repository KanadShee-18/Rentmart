import type { NextFunction, Request } from 'express'
import { errorObjet } from './errorObject.js'

export const httpError = (
  next: NextFunction,
  err: unknown,
  req: Request,
  errorStatusCode: number = 500
): void => {
  const errorObj = errorObjet(err, req, errorStatusCode)
  return next(errorObj)
}
