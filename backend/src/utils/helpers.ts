// backend/src/utils/helpers.ts
import { type Response } from 'express';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  error?: string
): Response => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    error,
  });
};

export const generateToken = (payload: object): string => {
  // This will be implemented with JWT
  return 'token-placeholder';
};

export const hashPassword = async (password: string): Promise<string> => {
  const SALT_ROUNDS = env.BCRYPT_SALT_ROUNDS!
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  return hashedPassword;
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};