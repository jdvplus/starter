import { Router } from 'express'
import { ENDPOINTS } from '../constants/endpoints.ts'
import { getHealthStatus } from '../services/health.ts'

const api = Router()

api.get(ENDPOINTS.HEALTH, (_req, res) => {
  res.json(getHealthStatus())
})

// Add your API routes here
// api.use(ENDPOINTS.USERS, usersRouter)
// api.use(ENDPOINTS.POSTS, postsRouter)

export default api
