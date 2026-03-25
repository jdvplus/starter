export class AppError extends Error {
  readonly status: number
  readonly code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
  }

  static badRequest(message = 'Bad request', code?: string) {
    return new AppError(400, message, code)
  }

  static unauthorized(message = 'Unauthorized', code?: string) {
    return new AppError(401, message, code)
  }

  static forbidden(message = 'Forbidden', code?: string) {
    return new AppError(403, message, code)
  }

  static notFound(message = 'Not found', code?: string) {
    return new AppError(404, message, code)
  }

  static conflict(message = 'Conflict', code?: string) {
    return new AppError(409, message, code)
  }

  static internal(message = 'Internal server error', code?: string) {
    return new AppError(500, message, code)
  }
}
