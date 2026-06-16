import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';
import { verifyAdminToken } from '../services/authService.js';
import { verifyUserToken } from '../services/userService.js';
import { AppError, isAppError } from '../utils/errors.js';

export function validateBody<T extends ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateQuery<T extends ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new AppError(401, 'Требуется авторизация администратора'));
    return;
  }

  const token = header.slice('Bearer '.length);
  req.admin = verifyAdminToken(token);
  next();
}

export function requireUser(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new AppError(401, 'Требуется авторизация'));
    return;
  }

  const token = header.slice('Bearer '.length);
  req.user = verifyUserToken(token);
  next();
}

export function optionalUser(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.user = verifyUserToken(header.slice('Bearer '.length));
    } catch {
      // ignore invalid user token for public endpoints
    }
  }
  next();
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Ошибка валидации',
      details: error.flatten(),
    });
    return;
  }

  if (isAppError(error)) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    });
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
}

declare global {
  namespace Express {
    interface Request {
      admin?: {
        sub: number;
        email: string;
        role: 'admin';
      };
      user?: {
        sub: number;
        email: string;
        role: 'user';
      };
    }
  }
}
