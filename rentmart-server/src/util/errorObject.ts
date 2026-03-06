import type { Request } from 'express'
import responseMessage from '../constant/responseMessage.js'
import { EApplicationEnvironment } from '../constant/application.js'
import logger from './logger.js'
import config from '../config/index.js'
import type { THttpError } from '../types/index.js'

export const errorObjet = (
  err: unknown,
  req: Request,
  errorStatusCode: number = 500
) => {
  const errorObj: THttpError = {
    success: false,
    statusCode: errorStatusCode,
    request: { ip: req.ip || null, method: req.method, url: req.originalUrl },
    message:
      err instanceof Error
        ? err.message || responseMessage.SOMETHING_WENT_WRONG
        : responseMessage.SOMETHING_WENT_WRONG,
    data: null,
    trace: err instanceof Error ? { error: err.stack } : null,
  }
  logger.error(`CONTROLLER_ERROR`, { meta: errorObj })
  if (config.ENV === EApplicationEnvironment.PRODUCTION) {
    delete errorObj.request.ip
    delete errorObj.trace // Ensure trace is removed in production
  }
  return errorObj
}
