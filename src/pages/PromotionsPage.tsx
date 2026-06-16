import { useEffect, useState } from 'react';
import { api, type ApiPromotion } from '../api/client';
import PageTitle from '../components/PageTitle';
import { COLORS, FALLBACK_PROMOTIONS } from '../data/constants';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<ApiPromotion[]>(FALLBACK_PROMOTIONS);

  useEffect(() => {
    api.getPromotions().then((r) => setPromotions(r.promotions)).catch(() => {});
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <PageTitle label="Акции" title="Специальные предложения" />
        <div className="grid md:grid-cols-2 gap-6">
          {promotions.map((promo) => (
            <article key={promo.id} className="p-8" style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
              <span className="inline-block mb-4 px-3 py-1 text-xs font-bold uppercase" style={{ background: COLORS.gold, color: COLORS.bg }}>
                {promo.discountLabel}
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: COLORS.cream, marginBottom: '12px' }}>
                {promo.title}
              </h3>
              <p style={{ color: COLORS.muted, lineHeight: 1.8, fontSize: '14px' }}>{promo.description}</p>
              <p className="mt-4" style={{ fontSize: '11px', color: COLORS.gold }}>Действует до {promo.validUntil}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
