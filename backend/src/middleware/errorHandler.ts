import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors/index.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (
    err.message?.includes('database server') ||
    err.message?.includes('credentials for') ||
    err.message?.includes('P1000') ||
    err.message?.includes('P1001')
  ) {
    return res.status(503).json({
      success: false,
      message: 'Database server is unreachable or credentials in backend/.env are invalid. Please check your PostgreSQL service.',
    });
  }

  console.error('[Unhandled Error]', err);

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message || 'Internal server error',
  });
};

