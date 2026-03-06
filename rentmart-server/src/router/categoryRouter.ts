import express, { type Router } from 'express'
import categoryController from '../controller/categoryController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router: Router = express.Router()

// Public
router.get('/', categoryController.list)

// Admin only
router.post('/', authenticate, requireRole('ADMIN'), categoryController.create)
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  categoryController.remove
)

export default router
