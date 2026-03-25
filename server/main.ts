import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { securityMiddleware } from './middleware/security.ts'
import { notFoundHandler, errorHandler } from './middleware/errors.ts'
import api from './api/index.ts'

const app = express()
const PORT = process.env.PORT || 3000

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Security middleware
app.use(securityMiddleware())

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// API routes
app.use('/api', api)

// Serve built client in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// Error handling
app.use('/api/*', notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
