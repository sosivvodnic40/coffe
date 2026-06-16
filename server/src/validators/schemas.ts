import { z } from 'zod';

export const createReservationSchema = z.object({
  locationId: z.enum(['kabanbay', 'alfarabi']),
  name: z.string().trim().min(2, 'Имя должно содержать минимум 2 символа').max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(\+7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, 'Некорректный номер телефона'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Некорректная дата'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Некорректное время'),
  guests: z.union([
    z.literal('1'),
    z.literal('2'),
    z.literal('3'),
    z.literal('4'),
    z.literal('5'),
    z.literal('6'),
    z.literal('7'),
    z.literal('8+'),
  ]),
  comment: z.string().trim().max(500).optional().default(''),
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  locationId: z.enum(['kabanbay', 'alfarabi']),
  guests: z.coerce.number().int().min(1).max(20).optional().default(2),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const updateReservationSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
});

export const reservationLookupSchema = z.object({
  code: z.string().trim().min(6).max(12),
});

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, 'Некорректный номер телефона');

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  fullName: z.string().trim().min(2, 'Имя должно содержать минимум 2 символа').max(80),
  phone: phoneSchema,
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(80).optional(),
  phone: phoneSchema.optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
