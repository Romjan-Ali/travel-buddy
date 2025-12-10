// frontend/lib/jwt.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch (error) {
    return false
  }
}

export function decodeToken(token: string): jwt.JwtPayload | null {
  try {
    return jwt.decode(token) as jwt.JwtPayload
  } catch (error) {
    return null
  }
}