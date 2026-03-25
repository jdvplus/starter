import winston from 'winston'

const { combine, timestamp, printf, colorize } = winston.format

const isProduction = process.env.NODE_ENV === 'production'
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug')

const uppercaseLevel = winston.format((info) => {
  info.level = info.level.toUpperCase()
  return info
})

const logFormat = printf(({ level, message, timestamp }) => {
  return `<${timestamp}> [${level}] ${message}`
})

export const logger = winston.createLogger({
  level: logLevel,
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(
        uppercaseLevel(),
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),

    // Add file or cloud transports here for production
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})
