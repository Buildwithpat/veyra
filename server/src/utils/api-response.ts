import type { Response } from "express"

export function sendSuccess<T>(res: Response, data: T, message?: string, status = 200) {
  return res.status(status).json({ success: true, data, message })
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message)
    this.status = status
    this.errors = errors
  }
}
