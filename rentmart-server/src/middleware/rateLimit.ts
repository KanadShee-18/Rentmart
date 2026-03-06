import type { NextFunction, Request, Response } from 'express'
import config from '../config/index.js'
import { EApplicationEnvironment } from '../constant/application.js'
import { rateLimiterInstance } from '../config/rateLimiter.js'
import { httpError } from '../util/httpError.js'
import responseMessage from '../constant/responseMessage.js'

export const rateLimiter = (req: Request, _: Response, next: NextFunction) => {
  if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
    return next()
  }
  if (rateLimiterInstance) {
    rateLimiterInstance
      .consume(req.ip as string, 1)
      .then(() => {
        next()
      })
      .catch(() => {
        httpError(next, new Error(responseMessage.TOO_MANY_REQUEST), req, 429)
      })
  }
}
