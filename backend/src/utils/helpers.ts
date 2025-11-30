import { type Response } from 'express';

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
  // This will be implemented with bcrypt
  return `hashed-${password}`;
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return password === hashedPassword.replace('hashed-', '');
};