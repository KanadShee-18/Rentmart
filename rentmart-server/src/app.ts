import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import helmet from 'helmet'
import path from 'node:path'
import responseMessage from './constant/responseMessage.js'
import { globalErrorHandler } from './middleware/globalErrorHandler.js'
import router from './router/apiRouter.js'
import { httpError } from './util/httpError.js'

const app: Application = express()

app.use(helmet())
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    origin: ['http://localhost:3000'], // Replace with your frontend domain
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(import.meta.dirname, '../', 'public')))

app.use('/api/v1', router)

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error(responseMessage.NOT_FOUND('Route'))
  } catch (error) {
    httpError(next, error, req, 404)
  }
})

// Global Error Handler
app.use(globalErrorHandler)

export default app
