import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { getDb } from '../db/database.js';
import { AppError } from '../utils/errors.js';
import type { Reservation } from '../types/index.js';
import { mapReservationFromRow, type ReservationRow } from './reservationService.js';

export type User = {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  createdAt: string;
};

export type UserTokenPayload = {
  sub: number;
  email: string;
  role: 'user';
};

type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string;
  created_at: string;
};

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export function registerUser(input: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}): { token: string; user: User } {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(input.email);
  if (existing) {
    throw new AppError(409, 'Пользователь с таким email уже зарегистрирован');
  }

  const passwordHash = bcrypt.hashSync(input.password, 10);
  const result = db
    .prepare(
      `INSERT INTO users (email, password_hash, full_name, phone)
       VALUES (?, ?, ?, ?)`,
    )
    .run(input.email, passwordHash, input.fullName, input.phone);

  const user = getUserById(Number(result.lastInsertRowid));
  const token = signUserToken(user);
  return { token, user };
}

export function loginUser(email: string, password: string): { token: string; user: User } {
  const db = getDb();
  const row = db
    .prepare('SELECT id, email, password_hash, full_name, phone, created_at FROM users WHERE email = ?')
    .get(email) as UserRow | undefined;

  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    throw new AppError(401, 'Неверный email или пароль');
  }

  const user = mapUser(row);
  return { token: signUserToken(user), user };
}

export function getUserById(id: number): User {
  const db = getDb();
  const row = db
    .prepare('SELECT id, email, password_hash, full_name, phone, created_at FROM users WHERE id = ?')
    .get(id) as UserRow | undefined;

  if (!row) {
    throw new AppError(404, 'Пользователь не найден');
  }

  return mapUser(row);
}

export function updateUserProfile(
  userId: number,
  input: { fullName?: string; phone?: string },
): User {
  const db = getDb();
  const existing = getUserById(userId);

  const fullName = input.fullName ?? existing.fullName;
  const phone = input.phone ?? existing.phone;

  db.prepare(
    `UPDATE users SET full_name = ?, phone = ?, updated_at = datetime('now') WHERE id = ?`,
  ).run(fullName, phone, userId);

  return getUserById(userId);
}

export function getUserReservations(userId: number): Reservation[] {
  const db = getDb();
  const rows = db
    .prepare(
      `
      SELECT
        r.id, r.confirmation_code, r.location_id, l.label as location_label,
        r.guest_name, r.guest_phone, r.reservation_date, r.reservation_time,
        r.guests_count, r.comment, r.status, r.created_at, r.updated_at
      FROM reservations r
      JOIN locations l ON l.id = r.location_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT 50
    `,
    )
    .all(userId) as ReservationRow[];

  return rows.map(mapReservationFromRow);
}

function signUserToken(user: User): string {
  return jwt.sign({ sub: user.id, email: user.email, role: 'user' }, config.jwtSecret, {
    expiresIn: '7d',
  });
}

export function verifyUserToken(token: string): UserTokenPayload {
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (typeof payload === 'string') {
      throw new AppError(401, 'Недействительный токен авторизации');
    }
    const data = payload as unknown as UserTokenPayload;
    if (data.role !== 'user') {
      throw new AppError(401, 'Недействительный токен авторизации');
    }
    return data;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(401, 'Недействительный токен авторизации');
  }
}
