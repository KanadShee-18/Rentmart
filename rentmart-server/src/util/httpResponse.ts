import type { Request, Response } from 'express'
import { EApplicationEnvironment } from '../constant/application.js'
import logger from './logger.js'
import type { THttpResponse } from '../types/index.js'
import config from '../config/index.js'

export const httpResponse = (
  req: Request,
  res: Response,
  responseStatusCode: number,
  responseMessage: string,
  data: unknown = null
): void => {
  const response: THttpResponse = {
    success: true,
    statusCode: responseStatusCode,
    message: responseMessage,
    request: { ip: req.ip || null, method: req.method, url: req.originalUrl },
    data,
  }
  logger.info(`CONTROLLER_RESPONSE`, { meta: response })
  if (config.ENV === EApplicationEnvironment.PRODUCTION) {
    delete response.request.ip
  }
  res.status(responseStatusCode).json(response)
}
