import { Link } from 'react-router-dom';
import { ChevronDown, Coffee } from 'lucide-react';
import { COLORS, HERO_IMAGE, STATS } from '../data/constants';

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGE}')`, opacity: 0.18 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(44,26,12,0) 0%, rgba(30,15,6,0.7) 60%, rgba(23,12,4,0.95) 100%)',
          }}
        />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.35)',
              }}
            >
              <Coffee size={36} style={{ color: COLORS.gold }} />
            </div>
          </div>
          <p className="mb-3 tracking-widest uppercase" style={{ color: COLORS.gold, fontSize: '10px', letterSpacing: '0.5em' }}>
            Кофейня · Астана
          </p>
          <h1
            className="mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(56px, 9vw, 100px)',
              color: COLORS.cream,
              lineHeight: 1,
            }}
          >
            cappuccino
          </h1>
          <p className="max-w-lg mx-auto mb-10" style={{ color: COLORS.muted, fontSize: '15px', lineHeight: 1.85 }}>
            Тёплое место, где начинается каждый день. Завтраки до вечера, авторские блюда и идеальный кофе.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reservation"
              className="px-10 py-4 text-xs font-bold tracking-widest uppercase"
              style={{ background: COLORS.gold, color: COLORS.bg }}
            >
              Забронировать стол
            </Link>
            <Link
              to="/menu"
              className="px-10 py-4 text-xs tracking-widest uppercase"
              style={{ border: '1px solid rgba(201,168,76,0.35)', color: COLORS.gold }}
            >
              Смотреть меню
            </Link>
          </div>
          <div className="mt-14 flex justify-center">
            <ChevronDown size={20} style={{ color: COLORS.gold, opacity: 0.5 }} className="animate-bounce" />
          </div>
        </div>
      </section>

      <section style={{ background: COLORS.bgCard, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon size={18} style={{ color: COLORS.gold }} />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: COLORS.cream }}>{value}</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: COLORS.muted, textTransform: 'uppercase' }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <p className="mb-6 max-w-2xl mx-auto" style={{ color: COLORS.muted, lineHeight: 1.9 }}>
          Добро пожаловать в Cappuccino — кофейню с итальянской линейкой блюд в сердце Астаны.
          Узнайте больше о нас, изучите меню или забронируйте стол онлайн.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/about" className="px-6 py-3 text-xs uppercase tracking-widest" style={{ border: `1px solid ${COLORS.border}`, color: COLORS.gold }}>
            О нас
          </Link>
          <Link to="/promotions" className="px-6 py-3 text-xs uppercase tracking-widest" style={{ border: `1px solid ${COLORS.border}`, color: COLORS.gold }}>
            Акции
          </Link>
          <Link to="/gallery" className="px-6 py-3 text-xs uppercase tracking-widest" style={{ border: `1px solid ${COLORS.border}`, color: COLORS.gold }}>
            Галерея
          </Link>
        </div>
      </section>
    </>
  );
}
