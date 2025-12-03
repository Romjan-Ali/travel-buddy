// frontend/lib/jwt.ts
import jwt from 'jsonwebtoken'

export function decodeToken(token: string) {
  try {
    const decoded = jwt.decode(token)
    return decoded
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

export function verifyToken(token: string, secret: string) {
  try {
    const verified = jwt.verify(token, secret)
    return verified
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}