import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors.ts'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not found' })
}

export function errorHandler(
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
  const status =
    'status' in err &&
    typeof (err as Record<string, unknown>).status === 'number'
      ? ((err as Record<string, unknown>).status as number)
      : 500

  if (status < 500) {
    res.status(status).json({ error: err.message })
    return
  }

  // Unexpected errors — log and hide details in production
  console.error(err.stack)

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message

  res.status(500).json({ error: message })
}
