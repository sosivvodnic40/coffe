import { config } from '../config.js';
import { getDb } from '../db/database.js';
import { AppError } from '../utils/errors.js';
import type { AvailabilitySlot, DashboardStats, MenuCategory, Reservation } from '../types/index.js';
import type { CreateReservationInput } from '../validators/schemas.js';

type ReservationRow = {
  id: number;
  confirmation_code: string;
  location_id: string;
  location_label: string;
  guest_name: string;
  guest_phone: string;
  reservation_date: string;
  reservation_time: string;
  guests_count: number;
  comment: string | null;
  status: Reservation['status'];
  created_at: string;
  updated_at: string;
};

function mapReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    confirmationCode: row.confirmation_code,
    locationId: row.location_id,
    locationLabel: row.location_label,
    guestName: row.guest_name,
    guestPhone: row.guest_phone,
    reservationDate: row.reservation_date,
    reservationTime: row.reservation_time,
    guestsCount: row.guests_count,
    comment: row.comment,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parseGuestsCount(guests: CreateReservationInput['guests']): number {
  return guests === '8+' ? 8 : Number(guests);
}

function generateConfirmationCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CP-';
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function getDayOfWeek(date: string): number {
  return new Date(`${date}T12:00:00`).getDay();
}

function isWithinBusinessHours(date: string, time: string): boolean {
  const day = getDayOfWeek(date);
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;

  if (day >= 1 && day <= 5) {
    return totalMinutes >= 9 * 60 && totalMinutes <= 23 * 60;
  }

  if (day === 0 || day === 6) {
    return totalMinutes >= 10 * 60 && totalMinutes <= 24 * 60;
  }

  return false;
}

function assertFutureReservation(date: string, time: string): void {
  const reservationDate = new Date(`${date}T${time}:00`);
  const now = new Date();
  if (reservationDate.getTime() <= now.getTime()) {
    throw new AppError(400, 'Нельзя забронировать стол на прошедшее время');
  }
}

function getBookedGuests(locationId: string, date: string, time: string): number {
  const db = getDb();
  const row = db
    .prepare(
      `
      SELECT COALESCE(SUM(guests_count), 0) as total
      FROM reservations
      WHERE location_id = ?
        AND reservation_date = ?
        AND reservation_time = ?
        AND status IN ('pending', 'confirmed')
    `,
    )
    .get(locationId, date, time) as { total: number };

  return row.total;
}

function buildTimeSlots(date: string): string[] {
  const day = getDayOfWeek(date);
  const startMinutes = day >= 1 && day <= 5 ? 9 * 60 : 10 * 60;
  const endMinutes = day >= 1 && day <= 5 ? 23 * 60 : 24 * 60;
  const slots: string[] = [];

  for (let minutes = startMinutes; minutes <= endMinutes; minutes += config.slotIntervalMinutes) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mins = String(minutes % 60).padStart(2, '0');
    slots.push(`${hours}:${mins}`);
  }

  return slots;
}

export function getMenu(): MenuCategory[] {
  const db = getDb();
  const categories = db
    .prepare(
      `
      SELECT id, label
      FROM menu_categories
      ORDER BY sort_order ASC
    `,
    )
    .all() as { id: string; label: string }[];

  const itemsStmt = db.prepare(`
    SELECT id, name, description, price_label, price_amount
    FROM menu_items
    WHERE category_id = ? AND is_available = 1
    ORDER BY id ASC
  `);

  return categories.map((category) => ({
    id: category.id,
    label: category.label,
    items: itemsStmt.all(category.id).map((item) => ({
      id: (item as { id: number }).id,
      name: (item as { name: string }).name,
      description: (item as { description: string }).description,
      price: (item as { price_label: string }).price_label,
      priceAmount: (item as { price_amount: number }).price_amount,
    })),
  }));
}

export function getLocations() {
  const db = getDb();
  return db
    .prepare(
      `
      SELECT id, label, full_address as fullAddress, phone
      FROM locations
      WHERE is_active = 1
      ORDER BY id ASC
    `,
    )
    .all();
}

export function getAvailability(
  locationId: string,
  date: string,
  guests: number,
): AvailabilitySlot[] {
  if (!isWithinBusinessHours(date, '12:00')) {
    const day = getDayOfWeek(date);
    if (day === 0 || day === 6) {
      // weekend - ok for some slots
    }
  }

  return buildTimeSlots(date).map((time) => {
    const booked = getBookedGuests(locationId, date, time);
    const remainingCapacity = Math.max(config.maxGuestsPerSlot - booked, 0);
    const available =
      remainingCapacity >= guests &&
      isWithinBusinessHours(date, time) &&
      new Date(`${date}T${time}:00`).getTime() > Date.now();

    return { time, available, remainingCapacity };
  });
}

export function createReservation(input: CreateReservationInput): Reservation {
  const db = getDb();
  const guestsCount = parseGuestsCount(input.guests);

  assertFutureReservation(input.date, input.time);

  if (!isWithinBusinessHours(input.date, input.time)) {
    throw new AppError(400, 'Выбранное время вне часов работы кофейни');
  }

  const location = db
    .prepare('SELECT id, label FROM locations WHERE id = ? AND is_active = 1')
    .get(input.locationId) as { id: string; label: string } | undefined;

  if (!location) {
    throw new AppError(404, 'Локация не найдена');
  }

  const booked = getBookedGuests(input.locationId, input.date, input.time);
  if (booked + guestsCount > config.maxGuestsPerSlot) {
    throw new AppError(409, 'На это время недостаточно свободных мест');
  }

  let confirmationCode = generateConfirmationCode();
  while (db.prepare('SELECT id FROM reservations WHERE confirmation_code = ?').get(confirmationCode)) {
    confirmationCode = generateConfirmationCode();
  }

  const result = db
    .prepare(
      `
      INSERT INTO reservations (
        confirmation_code, location_id, guest_name, guest_phone,
        reservation_date, reservation_time, guests_count, comment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      confirmationCode,
      input.locationId,
      input.name,
      input.phone,
      input.date,
      input.time,
      guestsCount,
      input.comment || null,
    );

  const row = db
    .prepare(
      `
      SELECT
        r.id, r.confirmation_code, r.location_id, l.label as location_label,
        r.guest_name, r.guest_phone, r.reservation_date, r.reservation_time,
        r.guests_count, r.comment, r.status, r.created_at, r.updated_at
      FROM reservations r
      JOIN locations l ON l.id = r.location_id
      WHERE r.id = ?
    `,
    )
    .get(result.lastInsertRowid) as ReservationRow;

  return mapReservation(row);
}

export function getReservationByCode(code: string): Reservation {
  const db = getDb();
  const row = db
    .prepare(
      `
      SELECT
        r.id, r.confirmation_code, r.location_id, l.label as location_label,
        r.guest_name, r.guest_phone, r.reservation_date, r.reservation_time,
        r.guests_count, r.comment, r.status, r.created_at, r.updated_at
      FROM reservations r
      JOIN locations l ON l.id = r.location_id
      WHERE r.confirmation_code = ?
    `,
    )
    .get(code.toUpperCase()) as ReservationRow | undefined;

  if (!row) {
    throw new AppError(404, 'Бронь не найдена');
  }

  return mapReservation(row);
}

export function listReservations(status?: Reservation['status']): Reservation[] {
  const db = getDb();
  const query = status
    ? `
      SELECT
        r.id, r.confirmation_code, r.location_id, l.label as location_label,
        r.guest_name, r.guest_phone, r.reservation_date, r.reservation_time,
        r.guests_count, r.comment, r.status, r.created_at, r.updated_at
      FROM reservations r
      JOIN locations l ON l.id = r.location_id
      WHERE r.status = ?
      ORDER BY r.reservation_date DESC, r.reservation_time DESC
    `
    : `
      SELECT
        r.id, r.confirmation_code, r.location_id, l.label as location_label,
        r.guest_name, r.guest_phone, r.reservation_date, r.reservation_time,
        r.guests_count, r.comment, r.status, r.created_at, r.updated_at
      FROM reservations r
      JOIN locations l ON l.id = r.location_id
      ORDER BY r.created_at DESC
      LIMIT 100
    `;

  const rows = (status ? db.prepare(query).all(status) : db.prepare(query).all()) as ReservationRow[];
  return rows.map(mapReservation);
}

export function updateReservationStatus(id: number, status: Reservation['status']): Reservation {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM reservations WHERE id = ?').get(id);
  if (!existing) {
    throw new AppError(404, 'Бронь не найдена');
  }

  db.prepare(`
    UPDATE reservations
    SET status = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(status, id);

  const row = db
    .prepare(
      `
      SELECT
        r.id, r.confirmation_code, r.location_id, l.label as location_label,
        r.guest_name, r.guest_phone, r.reservation_date, r.reservation_time,
        r.guests_count, r.comment, r.status, r.created_at, r.updated_at
      FROM reservations r
      JOIN locations l ON l.id = r.location_id
      WHERE r.id = ?
    `,
    )
    .get(id) as ReservationRow;

  return mapReservation(row);
}

export function getDashboardStats(): DashboardStats {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);

  const totals = db
    .prepare(
      `
      SELECT
        (SELECT COUNT(*) FROM reservations) as totalReservations,
        (SELECT COUNT(*) FROM reservations WHERE status = 'pending') as pendingReservations,
        (SELECT COUNT(*) FROM reservations WHERE status = 'confirmed' AND reservation_date = ?) as confirmedToday,
        (SELECT COALESCE(SUM(guests_count), 0) FROM reservations WHERE reservation_date = ? AND status IN ('pending', 'confirmed')) as guestsToday,
        (SELECT COUNT(*) FROM menu_items WHERE is_available = 1) as menuItemsCount
    `,
    )
    .get(today, today) as DashboardStats;

  return totals;
}
