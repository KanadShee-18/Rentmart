import { createLogger, format, transports } from 'winston'
import 'winston-mongodb'
import util from 'util'
import { EApplicationEnvironment } from '../constant/application.js'
import path from 'path'
import * as sourceMapSupport from 'source-map-support'
import { blue, green, magenta, red, yellow } from 'colorette'
import config from '../config/index.js'

sourceMapSupport.install()

const colorizeLevel = (level: string) => {
  switch (level) {
    case 'ERROR':
      return red(level)
    case 'INFO':
      return blue(level)
    case 'WARN':
      return yellow(level)
    default:
      return level
  }
}

const consoleLogFormat = format.printf((info) => {
  const { level, message, timestamp, meta = {} } = info
  const customLevel = colorizeLevel(String(level).toUpperCase())
  const customTimeStamp = green(String(timestamp))
  const customMessage = String(message)
  const customMeta = util.inspect(meta, {
    showHidden: false,
    depth: null,
    colors: true,
  })
  return `${customLevel} [${customTimeStamp}] ${customMessage}\n${magenta('META')} ${customMeta}\n`
})

const fileLogFormat = format.printf((info) => {
  const { level, message, timestamp, meta = {} } = info
  const metaObj = meta as Record<string, unknown>
  const logMeta: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(metaObj)) {
    if (value instanceof Error) {
      logMeta[key] = {
        name: value.name,
        message: value.message,
        trace: value.stack || '',
      }
    } else {
      logMeta[key] = value
    }
  }
  return JSON.stringify(
    { level: level.toUpperCase(), message, timestamp, meta: logMeta },
    null,
    4
  )
})

const consoleTransport = () => {
  if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
    return [
      new transports.Console({
        level: 'info',
        format: format.combine(format.timestamp(), consoleLogFormat),
      }),
    ]
  }
  return []
}

const fileTransport = () => {
  return [
    new transports.File({
      filename: path.join(
        import.meta.dirname,
        '../',
        '../',
        'logs',
        `${config.ENV}.log`
      ),
      level: 'info',
      format: format.combine(format.timestamp(), fileLogFormat),
    }),
  ]
}

const dbTransport = () => {
  return [
    new transports.MongoDB({
      level: 'info',
      db: config.DATABASE_URL as string,
      metaKey: 'meta',
      expireAfterSeconds: 3600 * 24 * 30,
      collection: 'application-logs',
    }),
  ]
}

export default createLogger({
  defaultMeta: { meta: {} },
  transports: [...consoleTransport(), ...fileTransport(), ...dbTransport()],
})
