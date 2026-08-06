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

export function requireRole(...roles: Array<"buyer" | "supplier">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(new ApiError(403, "You do not have access to this resource"))
    }
    next()
  }
}
