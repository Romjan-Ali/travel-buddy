// backend/src/middleware/auth.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { type AuthRequest } from '../utils/types';
import { sendResponse } from '../utils/helpers';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      sendResponse(res, 401, 'Authentication required');
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        isEmailVerified: true,
      },
    });

    if (!user || !user.isActive) {
      sendResponse(res, 401, 'User not found or inactive');
      return;
    }

    if(!user.isEmailVerified) {
      sendResponse(res, 403, 'Email not verified');
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    };

    next();
  } catch (error) {
    sendResponse(res, 401, 'Invalid token');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      sendResponse(res, 401, 'Authentication required');
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendResponse(res, 403, 'Insufficient permissions');
      return;
    }

    next();
  };
};