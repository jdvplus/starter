import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { Router, type Router as RouterType } from 'express'

export function securityMiddleware(): RouterType {
  const router = Router()

  // Set security response headers with Helmet
  router.use(helmet())

  // CORS — allow Vite dev server in development, same-origin in production
  const origin =
    process.env.NODE_ENV === 'production'
      ? false
      : process.env.CLIENT_ORIGIN || 'http://localhost:5173'

  router.use(cors({ origin, credentials: true }))

  // Implement rate limiting on API routes
  router.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: { error: 'Too many requests. Please try again later.' },
    })
  )

  return router
}
