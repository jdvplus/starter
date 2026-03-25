import type { Request, Response, NextFunction } from 'express'

import { AppError } from '../lib/errors.ts'
import { logger } from '../lib/logger.ts'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not found' })
}

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Known application errors (thrown intentionally via AppError)
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: err.message,
      ...(err.code && { code: err.code }),
    })
    return
  }

  // Express/library errors that carry a status (e.g. JSON parse failures)
  const errWithStatus = err as Error & { status?: number }
  const status =
    typeof errWithStatus.status === 'number' ? errWithStatus.status : 500

  if (status < 500) {
    res.status(status).json({ error: err.message })
    return
  }

  // Unexpected errors — log and hide details in production
  logger.error(err.stack || err.message)

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message

  res.status(500).json({ error: message })
}
