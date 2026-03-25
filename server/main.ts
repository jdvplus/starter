import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import api from './api/index.ts'
import { securityMiddleware } from './middleware/security.ts'
import { httpSuccessLogger, httpErrorLogger } from './middleware/httpLogger.ts'
import { notFoundHandler, globalErrorHandler } from './middleware/errors.ts'
import { logger } from './lib/logger.ts'

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(securityMiddleware())

// HTTP request logging
app.use(httpSuccessLogger)
app.use(httpErrorLogger)

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// API routes
app.use('/api', api)

// Serve built client in production
const __dirname = path.dirname(fileURLToPath(import.meta.url))
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist')
  app.use(express.static(distPath))
  app.get('{*splat}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// Error handling
app.use('/api/{*splat}', notFoundHandler)
app.use(globalErrorHandler)

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`)
})

// Graceful shutdown
function shutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully`)
  server.close(() => {
    logger.info('Server closed')
    // Close database connections, queues, etc. here
    process.exit(0)
  })

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Graceful shutdown timed out, forcing exit')
    process.exit(1)
  }, 10_000)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
