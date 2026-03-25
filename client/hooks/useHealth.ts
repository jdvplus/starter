import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface HealthStatus {
  status: string
  timestamp: string
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      return api.get<HealthStatus>('/api/health')
    },
  })
}
