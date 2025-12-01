import type { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/helpers';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof AppError) {
    sendResponse(res, error.statusCode, error.message, undefined, error.message);
    return;
  }

  console.error('Unexpected error:', error);
  sendResponse(res, 500, 'Internal server error', undefined, 'Something went wrong');
};

export const notFound = (req: Request, res: Response): void => {
  sendResponse(res, 404, `Route ${req.originalUrl} not found`);
};
