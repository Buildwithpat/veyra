import type { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"

import { env } from "../config/env.js"
import { ApiError } from "../utils/api-response.js"

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` })
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof ApiError) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
      errors: error.errors,
    })
  }

  console.error(error)

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "Something went wrong"
        : error instanceof Error
          ? error.message
          : "Unknown error",
  })
}
