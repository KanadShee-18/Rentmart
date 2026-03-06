import type { NextFunction, Request, Response } from 'express'
import { httpError } from '../util/httpError.js'

// TODO: Add Product model to Prisma schema and implement these handlers.
// All endpoints are stubbed until the Product model is added.

const notImplemented = (_req: Request, _res: Response, next: NextFunction) =>
  httpError(next, new Error('Not implemented yet'), _req, 501)

export default {
  createProduct: notImplemented,
  uploadImages: notImplemented,
  uploadDocuments: notImplemented,
  getSellerInventory: notImplemented,
  getAllProducts: notImplemented,
  adminVerifyProduct: notImplemented,
  adminGetPendingProducts: notImplemented,
}
