import { Router } from 'express';
import {
  createReservation,
  getAvailability,
  getDashboardStats,
  getLocations,
  getMenu,
  getReservationByCode,
  listReservations,
  updateReservationStatus,
} from '../services/reservationService.js';
import { authenticateAdmin } from '../services/authService.js';
import { getPromotions } from '../services/promotionService.js';
import {
  adminLoginSchema,
  availabilityQuerySchema,
  createReservationSchema,
  reservationLookupSchema,
  updateReservationSchema,
} from '../validators/schemas.js';
import { requireAdmin, validateBody, validateQuery } from '../middleware/index.js';
import rateLimit from 'express-rate-limit';

const reservationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много попыток бронирования. Попробуйте позже.' },
});

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'cappuccino-api',
    timestamp: new Date().toISOString(),
  });
});

apiRouter.get('/menu', (_req, res) => {
  res.json({ categories: getMenu() });
});

apiRouter.get('/promotions', (_req, res) => {
  res.json({ promotions: getPromotions() });
});

apiRouter.get('/locations', (_req, res) => {
  res.json({ locations: getLocations() });
});

apiRouter.get('/info', (_req, res) => {
  res.json({
    brand: {
      name: 'cappuccino',
      tagline: 'кофейня · астана',
      instagram: '@cappuccino_astana',
    },
    hours: {
      weekdays: '09:00 – 23:00',
      weekend: '10:00 – 00:00',
    },
    stats: [
      { value: '4.8', label: 'рейтинг в 2ГИС' },
      { value: '100+', label: 'позиций в меню' },
      { value: '2', label: 'уютных локации' },
      { value: 'с 2013', label: 'создаём атмосферу' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1414235791060-d1e220ecdfc5?w=700&h=520&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1555396273-b63fa82d7802?w=700&h=520&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=700&h=520&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&h=520&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1476224203421-74177f19a496?w=700&h=520&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&h=520&fit=crop&auto=format',
    ],
  });
});

apiRouter.get('/reservations/availability', validateQuery(availabilityQuerySchema), (req, res) => {
  const { date, locationId, guests } = req.query as unknown as {
    date: string;
    locationId: 'kabanbay' | 'alfarabi';
    guests: number;
  };

  res.json({
    date,
    locationId,
    guests,
    slots: getAvailability(locationId, date, guests),
  });
});

apiRouter.post('/reservations', reservationLimiter, validateBody(createReservationSchema), (req, res) => {
  const reservation = createReservation(req.body);
  res.status(201).json({
    message: 'Бронь успешно создана',
    reservation,
  });
});

apiRouter.get('/reservations/lookup/:code', (req, res) => {
  const parsed = reservationLookupSchema.safeParse({ code: req.params.code });
  if (!parsed.success) {
    res.status(400).json({ error: 'Некорректный код бронирования' });
    return;
  }

  res.json({ reservation: getReservationByCode(parsed.data.code) });
});

apiRouter.post('/admin/login', validateBody(adminLoginSchema), (req, res) => {
  const token = authenticateAdmin(req.body.email, req.body.password);
  res.json({ token, expiresIn: '12h' });
});

apiRouter.get('/admin/stats', requireAdmin, (_req, res) => {
  res.json({ stats: getDashboardStats() });
});

apiRouter.get('/admin/reservations', requireAdmin, (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  res.json({ reservations: listReservations(status as never) });
});

apiRouter.patch('/admin/reservations/:id', requireAdmin, validateBody(updateReservationSchema), (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Некорректный ID брони' });
    return;
  }

  const reservation = updateReservationStatus(id, req.body.status);
  res.json({ reservation });
});
