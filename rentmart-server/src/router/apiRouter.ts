import express, { type Router } from 'express'
import authRouter from './authRouter.js'
import categoryRouter from './categoryRouter.js'
import equipmentRouter from './equipmentRouter.js'
import { health, self } from '../controller/apiController.js'
import { rateLimiter } from '../middleware/rateLimit.js'

const router: Router = express.Router()
router.use(rateLimiter)
router.use('/auth', authRouter)
router.use('/categories', categoryRouter)
router.use('/equipment', equipmentRouter)
router.route('/self').get(self)
router.route('/health').get(health)

export default router
