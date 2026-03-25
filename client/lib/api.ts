export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let body: Record<string, string> = {}
    try {
      body = await response.json()
    } catch {
      // Response body isn't valid JSON — fall back to empty object
    }

    throw new ApiError(
      response.status,
      body.error || response.statusText,
      body.code
    )
  }

  return response.json()
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const { headers: customHeaders, ...rest } = options || {}

  const response = await fetch(url, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...customHeaders },
  })

  return handleResponse<T>(response)
}

export const api = {
  async get<T>(url: string) {
    return request<T>(url)
  },

  async post<T>(url: string, body?: unknown) {
    return request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  async put<T>(url: string, body?: unknown) {
    return request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  async patch<T>(url: string, body?: unknown) {
    return request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },

  async delete<T>(url: string) {
    return request<T>(url, { method: 'DELETE' })
  },
}
