import { describe, it, expect, vi, beforeEach } from 'vitest'

import { api, ApiError } from './api'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    json: async () => body,
  }
}

describe('api', () => {
  it('makes a GET request and returns parsed JSON', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: 'test' }))

    const result = await api.get('/api/health')

    expect(result).toEqual({ data: 'test' })
    expect(mockFetch).toHaveBeenCalledWith('/api/health', {
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('makes a POST request with a JSON body', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ id: 1 }))

    const result = await api.post('/api/users', { name: 'test' })

    expect(result).toEqual({ id: 1 })
    expect(mockFetch).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'test' }),
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('throws ApiError on non-2xx responses', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ error: 'Not found' }, 404))

    try {
      await api.get('/api/missing')
      expect.fail('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      const apiError = err as ApiError
      expect(apiError.status).toBe(404)
      expect(apiError.message).toBe('Not found')
    }
  })

  it('handles non-JSON error responses gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => {
        throw new Error('not json')
      },
    })

    try {
      await api.get('/api/broken')
      expect.fail('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      const apiError = err as ApiError
      expect(apiError.status).toBe(500)
      expect(apiError.message).toBe('Internal Server Error')
    }
  })
})
