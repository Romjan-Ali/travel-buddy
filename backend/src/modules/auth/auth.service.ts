import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'
import type { RegisterInput, LoginInput } from '../../utils/types'
import { AppError } from '../../middleware/errorHandler'

export const authService = {
  async register(userData: RegisterInput) {
    const { email, password, fullName } = userData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new AppError(400, 'User already exists with this email')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            fullName,
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: true,
        createdAt: true,
      },
    })

    // Validate environment variables
    const jwtSecret = process.env.JWT_SECRET
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN

    if (!jwtSecret) {
      throw new AppError(500, 'JWT_SECRET is not defined')
    }

    if (!jwtExpiresIn) {
      throw new AppError(500, 'JWT_EXPIRES_IN is not defined')
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    )

    return { user, token }
  },

  async login(credentials: LoginInput) {
    const { email, password } = credentials

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })

    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid email or password')
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password')
    }

    // Validate environment variables
    const jwtSecret = process.env.JWT_SECRET
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN

    if (!jwtSecret) {
      throw new AppError(500, 'JWT_SECRET is not defined')
    }

    if (!jwtExpiresIn) {
      throw new AppError(500, 'JWT_EXPIRES_IN is not defined')
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        profile: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    return user
  },

  async logout() {
    // With cookie-based auth, logout is handled client-side by removing the cookie
    return { message: 'Logged out successfully' }
  },
}