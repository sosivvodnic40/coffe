import { getDb } from '../db/database.js';

export type Promotion = {
  id: number;
  title: string;
  description: string;
  discountLabel: string;
  validUntil: string;
};

export function getPromotions(): Promotion[] {
  const db = getDb();
  const rows = db
    .prepare(
      `
      SELECT id, title, description, discount_label, valid_until
      FROM promotions
      WHERE is_active = 1
      ORDER BY sort_order ASC, id ASC
    `,
    )
    .all() as {
      id: number;
      title: string;
      description: string;
      discount_label: string;
      valid_until: string;
    }[];

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    discountLabel: row.discount_label,
    validUntil: row.valid_until,
  }));
}
