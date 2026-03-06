import app from './app.js'
import config from './config/index.js'
import { initRateLimiter } from './config/rateLimiter.js'
import prisma from './service/dbService.js'
import logger from './util/logger.js'

const server = app.listen(config.PORT)

void (async () => {
  try {
    await prisma.$connect()
    logger.info('DATABASE CONNECTION', {
      meta: { STATUS: 'connected' },
    })

    initRateLimiter()
    logger.info('RATE LIMITER INITIATED')

    logger.info(`APPLICATION_STARTED`, {
      meta: { PORT: config.PORT, SERVER_URL: config.SERVER_URL },
    })
  } catch (error) {
    logger.error(`APPLICATION ERROR`, { meta: error })
    server.close((err) => {
      if (err) {
        logger.error(`APPLICATION ERROR`, { meta: error })
      }
      process.exit(1)
    })
  }
})()
