import morgan from 'morgan'

import { logger } from '../lib/logger.ts'

// Log successful requests at info level
export const httpSuccessLogger = morgan('short', {
  skip: (_req, res) => res.statusCode >= 400,
  stream: {
    write: (message) => {
      const formattedMessage = message.trim()
      return logger.info(formattedMessage)
    },
  },
})

// Log failed requests at warn/error level
export const httpErrorLogger = morgan('short', {
  skip: (_req, res) => res.statusCode < 400,
  stream: {
    write: (message) => {
      const formattedMessage = message.trim()
      return logger.warn(formattedMessage)
    },
  },
})
