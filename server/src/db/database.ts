import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';
import { seedDatabase, seedPromotions } from './seed.js';

let db: Database.Database | null = null;

const schema = `
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  full_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_label TEXT NOT NULL,
  price_amount INTEGER NOT NULL,
  is_available INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (category_id) REFERENCES menu_categories(id)
);

CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  confirmation_code TEXT NOT NULL UNIQUE,
  location_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  reservation_date TEXT NOT NULL,
  reservation_time TEXT NOT NULL,
  guests_count INTEGER NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reservations_date_time
  ON reservations(reservation_date, reservation_time, location_id);

CREATE INDEX IF NOT EXISTS idx_reservations_status
  ON reservations(status);

CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount_label TEXT NOT NULL,
  valid_until TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);
`;

export function getDb(): Database.Database {
  if (db) return db;

  fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
  db = new Database(config.dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(schema);

  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM menu_categories').get() as {
    count: number;
  };

  if (categoryCount.count === 0) {
    seedDatabase(db);
  } else {
    seedPromotionsIfEmpty(db);
  }

  return db;
}

function seedPromotionsIfEmpty(database: Database.Database): void {
  const count = database.prepare('SELECT COUNT(*) as count FROM promotions').get() as { count: number };
  if (count.count === 0) {
    seedPromotions(database);
  }
}

export function closeDb(): void {
  db?.close();
  db = null;
}
