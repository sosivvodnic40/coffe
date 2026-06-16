import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import PageTitle from '../components/PageTitle';
import { COLORS, MENU_CATEGORIES, type MenuCategory } from '../data/constants';

export default function MenuPage() {
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('breakfast');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMenu()
      .then((response) => {
        setMenuCategories(
          response.categories.map((category) => ({
            id: category.id,
            label: category.label,
            items: category.items.map((item) => ({
              name: item.name,
              desc: item.description,
              price: item.price,
            })),
          })),
        );
      })
      .catch(() => setMenuCategories(MENU_CATEGORIES))
      .finally(() => setLoading(false));
  }, []);

  const activeItems = useMemo(
    () => menuCategories.find((category) => category.id === activeCategory)?.items ?? [],
    [menuCategories, activeCategory],
  );

  return (
    <section className="py-20 px-6" style={{ background: COLORS.bgDark }}>
      <div className="max-w-6xl mx-auto">
        <PageTitle label="Наше меню" title="Всё, что вы любите" />
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className="px-5 py-2 text-xs tracking-widest uppercase"
              style={{
                background: activeCategory === category.id ? COLORS.gold : 'transparent',
                color: activeCategory === category.id ? COLORS.bg : COLORS.muted,
                border: `1px solid ${activeCategory === category.id ? COLORS.gold : COLORS.border}`,
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
        {loading ? (
          <p className="text-center" style={{ color: COLORS.muted }}>Загружаем меню...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-0">
            {activeItems.map((item) => (
              <div
                key={item.name}
                className="flex justify-between gap-4 py-7 px-5"
                style={{ borderBottom: `1px solid ${COLORS.border}` }}
              >
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: COLORS.cream }}>{item.name}</h3>
                  <p style={{ fontSize: '13px', color: COLORS.muted, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", color: COLORS.gold }}>{item.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
