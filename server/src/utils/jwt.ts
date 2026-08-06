import jwt from "jsonwebtoken"

import { env } from "../config/env.js"

export interface JwtPayload {
  sub: string
  role: "buyer" | "supplier"
}

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}
