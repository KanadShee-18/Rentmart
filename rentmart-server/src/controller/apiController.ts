import type { NextFunction, Request, Response } from 'express'
import { httpResponse } from '../util/httpResponse.js'
import responseMessage from '../constant/responseMessage.js'
import { httpError } from '../util/httpError.js'
import quicker from '../util/quicker.js'

export const self = (req: Request, res: Response, next: NextFunction) => {
  try {
    httpResponse(req, res, 200, responseMessage.SUCCESS)
  } catch (error) {
    httpError(next, error, req, 500)
  }
}

export const health = (req: Request, res: Response, next: NextFunction) => {
  try {
    const healthData = {
      application: quicker.getApplicationHealth(),
      system: quicker.getSystemHealth(),
      timestamp: Date.now(),
    }
    httpResponse(req, res, 200, responseMessage.SUCCESS, healthData)
  } catch (error) {
    httpError(next, error, req, 500)
  }
}
