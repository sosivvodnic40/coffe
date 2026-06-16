import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { closeDb } from '../src/db/database.js';

const testDbPath = path.resolve('data/test-cappuccino.db');
const app = createApp();

beforeAll(() => {
  closeDb();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  process.env.DATABASE_PATH = testDbPath;
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.ADMIN_EMAIL = 'admin@cappuccino.kz';
  process.env.ADMIN_PASSWORD = 'Cappuccino2025!';
});

afterAll(() => {
  closeDb();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

describe('Cappuccino API', () => {
  it('GET /api/health returns ok', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('GET /api/menu returns categories', async () => {
    const response = await request(app).get('/api/menu');
    expect(response.status).toBe(200);
    expect(response.body.categories.length).toBeGreaterThanOrEqual(6);
  });

  it('GET /api/promotions returns promotions', async () => {
    const response = await request(app).get('/api/promotions');
    expect(response.status).toBe(200);
    expect(response.body.promotions.length).toBeGreaterThanOrEqual(3);
  });

  it('GET /api/locations returns locations', async () => {
    const response = await request(app).get('/api/locations');
    expect(response.status).toBe(200);
    expect(response.body.locations.length).toBeGreaterThanOrEqual(2);
  });

  it('GET /api/reservations/availability returns slots', async () => {
    const response = await request(app).get('/api/reservations/availability').query({
      date: '2026-12-20',
      locationId: 'kabanbay',
      guests: 2,
    });
    expect(response.status).toBe(200);
    expect(response.body.slots.length).toBeGreaterThan(0);
  });

  it('POST /api/reservations creates reservation', async () => {
    const response = await request(app).post('/api/reservations').send({
      locationId: 'kabanbay',
      name: 'Test User',
      phone: '+77752188899',
      date: '2026-12-20',
      time: '14:00',
      guests: '2',
      comment: 'test',
    });

    expect(response.status).toBe(201);
    expect(response.body.reservation.confirmationCode).toMatch(/^CP-/);
  });

  it('POST /api/reservations rejects invalid payload', async () => {
    const response = await request(app).post('/api/reservations').send({ name: 'A' });
    expect(response.status).toBe(400);
  });

  it('GET /api/admin/stats requires auth', async () => {
    const response = await request(app).get('/api/admin/stats');
    expect(response.status).toBe(401);
  });

  it('admin login and stats flow works', async () => {
    const login = await request(app).post('/api/admin/login').send({
      email: 'admin@cappuccino.kz',
      password: 'Cappuccino2025!',
    });

    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();

    const stats = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(stats.status).toBe(200);
    expect(stats.body.stats.totalReservations).toBeGreaterThanOrEqual(1);
  });

  it('PATCH /api/admin/reservations/:id updates status', async () => {
    const login = await request(app).post('/api/admin/login').send({
      email: 'admin@cappuccino.kz',
      password: 'Cappuccino2025!',
    });

    const created = await request(app).post('/api/reservations').send({
      locationId: 'kabanbay',
      name: 'Status Test',
      phone: '+77752188899',
      date: '2026-12-21',
      time: '15:00',
      guests: '2',
    });

    const patch = await request(app)
      .patch(`/api/admin/reservations/${created.body.reservation.id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ status: 'confirmed' });

    expect(patch.status).toBe(200);
    expect(patch.body.reservation.status).toBe('confirmed');
  });

  it('GET /api/reservations/lookup/:code finds reservation', async () => {
    const created = await request(app).post('/api/reservations').send({
      locationId: 'alfarabi',
      name: 'Lookup Test',
      phone: '+77752188899',
      date: '2026-12-22',
      time: '16:00',
      guests: '2',
    });

    const code = created.body.reservation.confirmationCode;
    const lookup = await request(app).get(`/api/reservations/lookup/${code}`);

    expect(lookup.status).toBe(200);
    expect(lookup.body.reservation.confirmationCode).toBe(code);
  });

  it('user register, login and profile flow works', async () => {
    const register = await request(app).post('/api/auth/register').send({
      email: 'guest@test.kz',
      password: 'Test1234',
      fullName: 'Guest User',
      phone: '+77752188899',
    });

    expect(register.status).toBe(201);
    expect(register.body.token).toBeTruthy();
    expect(register.body.user.email).toBe('guest@test.kz');

    const login = await request(app).post('/api/auth/login').send({
      email: 'guest@test.kz',
      password: 'Test1234',
    });

    expect(login.status).toBe(200);
    const token = login.body.token;

    const profile = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(profile.status).toBe(200);
    expect(profile.body.user.fullName).toBe('Guest User');

    const reservation = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        locationId: 'kabanbay',
        name: 'Guest User',
        phone: '+77752188899',
        date: '2026-12-25',
        time: '18:00',
        guests: '2',
      });

    expect(reservation.status).toBe(201);

    const myReservations = await request(app)
      .get('/api/auth/reservations')
      .set('Authorization', `Bearer ${token}`);

    expect(myReservations.status).toBe(200);
    expect(myReservations.body.reservations.length).toBeGreaterThanOrEqual(1);
  });
});
