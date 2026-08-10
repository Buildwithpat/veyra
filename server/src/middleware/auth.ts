import type { NextFunction, Request, Response } from "express"

import { ApiError } from "../utils/api-response.js"
import { verifyAccessToken, type JwtPayload } from "../utils/jwt.js"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- required to augment Express's Request type
  namespace Express {
    interface Request {
      auth?: JwtPayload
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null

  if (!token) {
    return next(new ApiError(401, "Authentication required"))
  }

  try {
    req.auth = verifyAccessToken(token)
    next()
  } catch {
    next(new ApiError(401, "Invalid or expired token"))
  }
}

/** Populates `req.auth` when a valid bearer token is present, but never
 * rejects the request — for endpoints usable both signed-out and signed-in
 * (e.g. the assistant chat, which only needs identity for the subset of
 * messages that trigger an authenticated action). */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null

  if (token) {
    try {
      req.auth = verifyAccessToken(token)
    } catch {
      // Invalid/expired token on an optional-auth route — proceed signed-out
      // rather than failing the request.
    }
  }

  next()
}

export function requireRole(...roles: Array<"buyer" | "supplier">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(new ApiError(403, "You do not have access to this resource"))
    }
    next()
  }
}
