import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET ?? 'cappuccino-dev-secret-change-me',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@cappuccino.kz',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'Cappuccino2025!',
  get dbPath() {
    return process.env.DATABASE_PATH ?? path.resolve(__dirname, '../../data/cappuccino.db');
  },
  maxGuestsPerSlot: Number(process.env.MAX_GUESTS_PER_SLOT ?? 24),
  slotIntervalMinutes: Number(process.env.SLOT_INTERVAL_MINUTES ?? 30),
};
