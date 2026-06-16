import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { getDb } from '../db/database.js';
import { AppError } from '../utils/errors.js';

export function authenticateAdmin(email: string, password: string): string {
  const db = getDb();
  const user = db
    .prepare('SELECT id, email, password_hash FROM admin_users WHERE email = ?')
    .get(email) as { id: number; email: string; password_hash: string } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    throw new AppError(401, 'Неверный email или пароль');
  }

  return jwt.sign({ sub: user.id, email: user.email, role: 'admin' }, config.jwtSecret, {
    expiresIn: '12h',
  });
}

export type AdminTokenPayload = {
  sub: number;
  email: string;
  role: 'admin';
};

export function verifyAdminToken(token: string): AdminTokenPayload {
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (typeof payload === 'string') {
      throw new AppError(401, 'Недействительный токен авторизации');
    }
    const data = payload as unknown as AdminTokenPayload;
    if (data.role !== 'admin') {
      throw new AppError(401, 'Недействительный токен авторизации');
    }
    return data;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(401, 'Недействительный токен авторизации');
  }
}
