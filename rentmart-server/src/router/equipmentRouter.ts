import express, { type Router } from 'express'
import equipmentController, {
  uploadMiddleware,
} from '../controller/equipmentController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router: Router = express.Router()

// Public
router.get('/', equipmentController.listVerified)

// Owner
router.post(
  '/',
  authenticate,
  requireRole('OWNER'),
  uploadMiddleware,
  equipmentController.create
)
router.get(
  '/my',
  authenticate,
  requireRole('OWNER'),
  equipmentController.myListings
)

// Admin
router.get(
  '/admin/pending',
  authenticate,
  requireRole('ADMIN'),
  equipmentController.adminPending
)
router.patch(
  '/admin/:id/verify',
  authenticate,
  requireRole('ADMIN'),
  equipmentController.adminVerify
)
router.patch(
  '/admin/:id/reject',
  authenticate,
  requireRole('ADMIN'),
  equipmentController.adminReject
)
router.delete(
  '/admin/:id',
  authenticate,
  requireRole('ADMIN'),
  equipmentController.adminDelete
)

export default router
