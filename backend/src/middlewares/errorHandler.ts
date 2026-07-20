import { Request, Response, NextFunction } from 'express';

interface CustomError {
  status?: number;
  message?: string;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Unhandled Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    message,
  });

  if (res.headersSent) {
    next(err);
  }
};
