import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Clock,
  Coffee,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from 'lucide-react';
import { api } from './api/client';
import {
  ABOUT_IMAGE,
  COLORS,
  CONTACT,
  FALLBACK_PROMOTIONS,
  GALLERY_IMAGES,
  HERO_IMAGE,
  INITIAL_FORM,
  MENU_CATEGORIES,
  NAV_LINKS,
  ReservationForm,
  STATS,
  type MenuCategory,
} from './data/constants';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('breakfast');
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState<ReservationForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const [locations, setLocations] = useState(CONTACT.addresses.map((address, index) => ({
    id: index === 0 ? 'kabanbay' : 'alfarabi',
    label: address.label,
    fullAddress: address.full,
    phone: CONTACT.phones[index] ?? CONTACT.phones[0],
  })));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const [promotions, setPromotions] = useState(FALLBACK_PROMOTIONS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    Promise.all([api.getMenu(), api.getLocations(), api.getPromotions()])
      .then(([menuResponse, locationsResponse, promotionsResponse]) => {
        setMenuCategories(
          menuResponse.categories.map((category) => ({
            id: category.id,
            label: category.label,
            items: category.items.map((item) => ({
              name: item.name,
              desc: item.description,
              price: item.price,
            })),
          })),
        );
        setLocations(locationsResponse.locations);
        setPromotions(promotionsResponse.promotions);
      })
      .catch(() => {
        setMenuCategories(MENU_CATEGORIES);
      })
      .finally(() => setMenuLoading(false));
  }, []);

  const scrollTo = (selector: string) => {
    setMobileOpen(false);
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await api.createReservation({
        locationId: form.locationId,
        name: form.name,
        phone: form.phone,
        date: form.date,
        time: form.time,
        guests: form.guests,
        comment: form.comment,
      });

      setConfirmationCode(response.reservation.confirmationCode);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Не удалось создать бронь');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = async (event: FormEvent) => {
    event.preventDefault();
    setLookupLoading(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const response = await api.lookupReservation(lookupCode.trim());
      const reservation = response.reservation;
      const statusLabels: Record<string, string> = {
        pending: 'Ожидает подтверждения',
        confirmed: 'Подтверждена',
        cancelled: 'Отменена',
        completed: 'Завершена',
      };
      setLookupResult(
        `${reservation.guestName}, ${reservation.reservationDate} ${reservation.reservationTime}, ` +
          `${reservation.locationLabel}, ${reservation.guestsCount} гост(ей) — ` +
          `${statusLabels[reservation.status] ?? reservation.status}`,
      );
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : 'Бронь не найдена');
    } finally {
      setLookupLoading(false);
    }
  };

  const activeItems = useMemo(
    () => menuCategories.find((category) => category.id === activeCategory)?.items ?? [],
    [menuCategories, activeCategory],
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: COLORS.bg, color: COLORS.cream, fontFamily: "'Lato', sans-serif" }}
    >
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(30,15,6,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? `1px solid ${COLORS.border}` : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: COLORS.gold }}
            >
              <Coffee size={18} style={{ color: COLORS.bg }} />
            </div>
            <div className="flex flex-col leading-none">
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '18px',
                  color: COLORS.gold,
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                }}
              >
                cappuccino
              </span>
              <span
                style={{
                  fontSize: '8px',
                  letterSpacing: '0.4em',
                  color: COLORS.muted,
                  textTransform: 'uppercase',
                }}
              >
                кофейня · астана
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="transition-colors duration-200 hover:text-primary"
                style={{
                  color: COLORS.muted,
                  letterSpacing: '0.15em',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => scrollTo('#reservation')}
              className="px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:opacity-90"
              style={{ background: COLORS.gold, color: COLORS.bg, letterSpacing: '0.15em' }}
            >
              Забронировать
            </button>
          </nav>

          <button
            type="button"
            className="md:hidden"
            style={{ color: COLORS.gold }}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className="md:hidden px-6 pb-6 pt-4 flex flex-col gap-5"
            style={{ background: 'rgba(30,15,6,0.98)', borderTop: `1px solid ${COLORS.border}` }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="text-left text-sm"
                style={{ color: COLORS.muted, letterSpacing: '0.18em', textTransform: 'uppercase' }}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => scrollTo('#reservation')}
              className="py-3 text-xs font-bold tracking-widest uppercase text-center"
              style={{ background: COLORS.gold, color: COLORS.bg, letterSpacing: '0.18em' }}
            >
              Забронировать
            </button>
          </div>
        )}
      </header>

      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: COLORS.bg }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${HERO_IMAGE}')`,
            opacity: 0.18,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(44,26,12,0) 0%, rgba(30,15,6,0.7) 60%, rgba(23,12,4,0.95) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(30,15,6,0.6) 0%, rgba(30,15,6,0) 35%, rgba(30,15,6,0) 65%, rgba(30,15,6,0.9) 100%)',
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

          <p
            className="mb-3 tracking-widest uppercase"
            style={{ color: COLORS.gold, fontSize: '10px', letterSpacing: '0.5em' }}
          >
            Кофейня · Астана
          </p>

          <h1
            className="mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(56px, 9vw, 110px)',
              fontWeight: 400,
              color: COLORS.cream,
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}
          >
            cappuccino
          </h1>

          <div
            className="mx-auto mb-6"
            style={{
              width: '80px',
              height: '1px',
              background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`,
            }}
          />

          <p
            className="max-w-lg mx-auto mb-10"
            style={{ color: COLORS.muted, fontSize: '15px', lineHeight: 1.85 }}
          >
            Тёплое место, где начинается каждый день. Завтраки до вечера, авторские блюда,
            идеальный кофе и атмосфера, в которой хочется остаться.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => scrollTo('#reservation')}
              className="px-10 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-90"
              style={{ background: COLORS.gold, color: COLORS.bg, letterSpacing: '0.22em' }}
            >
              Забронировать стол
            </button>
            <button
              type="button"
              onClick={() => scrollTo('#menu')}
              className="px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                border: '1px solid rgba(201,168,76,0.35)',
                color: COLORS.gold,
                letterSpacing: '0.22em',
              }}
            >
              Смотреть меню
            </button>
          </div>

          <div className="mt-14 flex justify-center">
            <ChevronDown
              size={20}
              style={{ color: COLORS.gold, opacity: 0.5 }}
              className="animate-bounce"
            />
          </div>
        </div>
      </section>

      <section
        style={{
          background: COLORS.bgCard,
          borderTop: `1px solid ${COLORS.border}`,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon size={18} style={{ color: COLORS.gold }} />
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '28px',
                  color: COLORS.cream,
                  fontWeight: 500,
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: COLORS.muted,
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p
              className="mb-4 tracking-widest uppercase"
              style={{ color: COLORS.gold, fontSize: '10px', letterSpacing: '0.45em' }}
            >
              О нас
            </p>
            <h2
              className="mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                color: COLORS.cream,
                lineHeight: 1.2,
              }}
            >
              Место, куда хочется
              <br />
              <em>возвращаться</em>
            </h2>
            <p className="mb-6" style={{ color: COLORS.muted, lineHeight: 1.9 }}>
              Cappuccino — это кофейня с характером. Два уютных заведения в Астане, где с утра
              пахнет свежей выпечкой и хорошим кофе. Мы любим завтраки — поэтому делаем их весь
              день.
            </p>
            <p style={{ color: COLORS.muted, lineHeight: 1.9 }}>
              В нашем меню — авторские блюда из свежих продуктов: от классических стейков и пасты
              до тёплых салатов и хачапури. Всё готовится на открытой кухне. Без компромиссов.
            </p>
            <div className="mt-10 pl-6" style={{ borderLeft: `2px solid ${COLORS.gold}` }}>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '18px',
                  color: COLORS.cream,
                  fontStyle: 'italic',
                }}
              >
                &quot;Хорошее утро начинается с хорошего кофе — и мы знаем, как его
                приготовить&quot;
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -top-4 -left-4 w-full h-full"
              style={{ border: `1px solid ${COLORS.border}` }}
            />
            <img
              src={ABOUT_IMAGE}
              alt="Уютная атмосфера кофейни Cappuccino"
              className="w-full object-cover relative z-10"
              style={{ height: '460px' }}
            />
          </div>
        </div>
      </section>

      <section id="menu" className="py-28 px-6" style={{ background: COLORS.bgDark }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="mb-4 tracking-widest uppercase"
              style={{ color: COLORS.gold, fontSize: '10px', letterSpacing: '0.45em' }}
            >
              Наше меню
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                color: COLORS.cream,
              }}
            >
              Всё, что вы любите
            </h2>
            <div
              className="mt-5 mx-auto"
              style={{
                width: '60px',
                height: '1px',
                background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`,
              }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {menuCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className="px-5 py-2 text-xs tracking-widest uppercase transition-all duration-200"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  background: activeCategory === category.id ? COLORS.gold : 'transparent',
                  color: activeCategory === category.id ? COLORS.bg : COLORS.muted,
                  border:
                    activeCategory === category.id
                      ? `1px solid ${COLORS.gold}`
                      : `1px solid ${COLORS.border}`,
                  fontWeight: activeCategory === category.id ? 700 : 400,
                }}
              >
                {category.label}
              </button>
            ))}
          </div>

          {menuLoading ? (
            <p className="text-center" style={{ color: COLORS.muted }}>
              Загружаем меню...
            </p>
          ) : (
          <div className="grid md:grid-cols-2 gap-0">
            {activeItems.map((item, index) => (
              <div
                key={item.name}
                className="flex justify-between gap-4 py-7 px-5 transition-colors duration-200"
                style={{
                  borderBottom: `1px solid ${COLORS.border}`,
                  borderLeft: index % 2 === 1 ? '1px solid rgba(201,168,76,0.08)' : undefined,
                  background: 'transparent',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = 'rgba(201,168,76,0.04)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = 'transparent';
                }}
              >
                <div className="flex-1">
                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '17px',
                      color: COLORS.cream,
                      fontWeight: 500,
                    }}
                  >
                    {item.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: COLORS.muted, lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                </div>
                <div className="flex-shrink-0 pt-1">
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '16px',
                      color: COLORS.gold,
                    }}
                  >
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      <section id="promotions" className="py-28 px-6" style={{ background: COLORS.bg }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="mb-4 tracking-widest uppercase"
              style={{ color: COLORS.gold, fontSize: '10px', letterSpacing: '0.45em' }}
            >
              Акции
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                color: COLORS.cream,
              }}
            >
              Специальные предложения
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {promotions.map((promo) => (
              <article
                key={promo.id}
                className="p-8 relative overflow-hidden"
                style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
              >
                <span
                  className="inline-block mb-4 px-3 py-1 text-xs font-bold tracking-widest uppercase"
                  style={{ background: COLORS.gold, color: COLORS.bg }}
                >
                  {promo.discountLabel}
                </span>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '22px',
                    color: COLORS.cream,
                  }}
                >
                  {promo.title}
                </h3>
                <p className="mb-4" style={{ color: COLORS.muted, lineHeight: 1.8, fontSize: '14px' }}>
                  {promo.description}
                </p>
                <p style={{ fontSize: '11px', color: COLORS.gold, letterSpacing: '0.15em' }}>
                  Действует до {promo.validUntil}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-28 px-6" style={{ background: COLORS.bgDark }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="mb-4 tracking-widest uppercase"
              style={{ color: COLORS.gold, fontSize: '10px', letterSpacing: '0.45em' }}
            >
              Галерея
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                color: COLORS.cream,
              }}
            >
              Атмосфера кофейни
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {GALLERY_IMAGES.map((src) => (
              <div
                key={src}
                className="overflow-hidden group"
                style={{ aspectRatio: '4/3', background: COLORS.bgCard }}
              >
                <img
                  src={src}
                  alt="Кофейня Cappuccino Астана"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: 'brightness(0.8) saturate(0.9)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reservation" className="py-28 px-6" style={{ background: COLORS.bgDark }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p
              className="mb-4 tracking-widest uppercase"
              style={{ color: COLORS.gold, fontSize: '10px', letterSpacing: '0.45em' }}
            >
              Резервация
            </p>
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(30px, 4vw, 46px)',
                color: COLORS.cream,
                lineHeight: 1.2,
              }}
            >
              Забронируйте
              <br />
              ваш стол
            </h2>
            <p className="mb-8" style={{ color: COLORS.muted, lineHeight: 1.9 }}>
              Свяжитесь с нами любым удобным способом или заполните форму — и мы подтвердим
              бронь в течение 30 минут.
            </p>

            <div className="space-y-4">
              {CONTACT.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 group"
                >
                  <Phone size={15} style={{ color: COLORS.gold }} />
                  <span
                    style={{ color: COLORS.muted, fontSize: '14px' }}
                    className="group-hover:text-primary transition-colors"
                  >
                    {phone}
                  </span>
                </a>
              ))}

              <div className="flex items-start gap-3">
                <Clock size={15} style={{ color: COLORS.gold, marginTop: '2px' }} />
                <div style={{ fontSize: '14px', color: COLORS.muted, lineHeight: 1.8 }}>
                  <div>Пн – Пт: {CONTACT.hours.weekdays}</div>
                  <div>Сб – Вс: {CONTACT.hours.weekend}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center text-center py-16 px-8"
                style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                  style={{ background: 'rgba(201,168,76,0.12)' }}
                >
                  <Coffee size={24} style={{ color: COLORS.gold }} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '22px',
                    color: COLORS.cream,
                  }}
                >
                  Спасибо, {form.name}!
                </h3>
                <p className="mt-3" style={{ color: COLORS.muted, fontSize: '14px' }}>
                  Ваша заявка принята. Мы позвоним вам для подтверждения.
                </p>
                <p className="mt-4" style={{ color: COLORS.gold, fontSize: '14px', letterSpacing: '0.2em' }}>
                  Код брони: {confirmationCode}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setConfirmationCode('');
                    setForm(INITIAL_FORM);
                  }}
                  className="mt-6 text-xs uppercase tracking-widest"
                  style={{ color: COLORS.muted }}
                >
                  Новая бронь
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 p-8"
                style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
              >
                <div>
                  <label
                    className="block mb-1"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.25em',
                      color: COLORS.muted,
                      textTransform: 'uppercase',
                    }}
                  >
                    Локация
                  </label>
                  <select
                    required
                    value={form.locationId}
                    onChange={(event) => setForm({ ...form, locationId: event.target.value })}
                    className="w-full px-4 py-3 text-sm outline-none"
                    style={{
                      background: COLORS.bg,
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.cream,
                      colorScheme: 'dark',
                    }}
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.fullAddress}
                      </option>
                    ))}
                  </select>
                </div>

                {[
                  { id: 'name', label: 'Ваше имя', type: 'text', placeholder: 'Иван Иванов' },
                  { id: 'phone', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__' },
                  { id: 'date', label: 'Дата', type: 'date', placeholder: '' },
                  { id: 'time', label: 'Время', type: 'time', placeholder: '' },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.25em',
                        color: COLORS.muted,
                        textTransform: 'uppercase',
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      required
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.id as keyof ReservationForm]}
                      onChange={(event) =>
                        setForm({ ...form, [field.id]: event.target.value })
                      }
                      className="w-full px-4 py-3 text-sm outline-none transition-colors"
                      style={{
                        background: COLORS.bg,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.cream,
                        colorScheme: 'dark',
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label
                    className="block mb-1"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.25em',
                      color: COLORS.muted,
                      textTransform: 'uppercase',
                    }}
                  >
                    Количество гостей
                  </label>
                  <select
                    value={form.guests}
                    onChange={(event) => setForm({ ...form, guests: event.target.value })}
                    className="w-full px-4 py-3 text-sm outline-none"
                    style={{
                      background: COLORS.bg,
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.cream,
                      colorScheme: 'dark',
                    }}
                  >
                    {['1', '2', '3', '4', '5', '6', '7', '8+'].map((value) => (
                      <option key={value} value={value}>
                        {value}{' '}
                        {value === '8+' ? 'и более' : value === '1' ? 'гость' : 'гостя'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-1"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.25em',
                      color: COLORS.muted,
                      textTransform: 'uppercase',
                    }}
                  >
                    Пожелания
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Особые пожелания, повод, аллергии..."
                    value={form.comment}
                    onChange={(event) => setForm({ ...form, comment: event.target.value })}
                    className="w-full px-4 py-3 text-sm outline-none resize-none"
                    style={{
                      background: COLORS.bg,
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.cream,
                    }}
                  />
                </div>

                {submitError && (
                  <p style={{ color: '#e57373', fontSize: '13px' }}>{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:opacity-90 mt-2 disabled:opacity-60"
                  style={{ background: COLORS.gold, color: COLORS.bg, letterSpacing: '0.22em' }}
                >
                  {isSubmitting ? 'Отправляем...' : 'Подтвердить резервацию'}
                </button>
              </form>
            )}

            <form
              onSubmit={handleLookup}
              className="mt-4 space-y-3 p-6"
              style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
            >
              <p
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  color: COLORS.muted,
                  textTransform: 'uppercase',
                }}
              >
                Проверить бронь по коду
              </p>
              <div className="flex gap-2">
                <input
                  value={lookupCode}
                  onChange={(event) => setLookupCode(event.target.value.toUpperCase())}
                  placeholder="CP-XXXXXX"
                  className="flex-1 px-4 py-3 text-sm outline-none"
                  style={{
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.cream,
                  }}
                />
                <button
                  type="submit"
                  disabled={lookupLoading || !lookupCode.trim()}
                  className="px-4 py-3 text-xs font-bold tracking-widest uppercase"
                  style={{
                    background: COLORS.gold,
                    color: COLORS.bg,
                    opacity: lookupLoading || !lookupCode.trim() ? 0.6 : 1,
                  }}
                >
                  {lookupLoading ? '...' : 'Найти'}
                </button>
              </div>
              {lookupResult && (
                <p style={{ color: COLORS.cream, fontSize: '13px', lineHeight: 1.6 }}>{lookupResult}</p>
              )}
              {lookupError && <p style={{ color: '#e57373', fontSize: '13px' }}>{lookupError}</p>}
            </form>
          </div>
        </div>
      </section>

      <footer id="contact" style={{ background: COLORS.bgFooter, borderTop: `1px solid ${COLORS.border}` }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-12 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: COLORS.gold }}
                >
                  <Coffee size={18} style={{ color: COLORS.bg }} />
                </div>
                <div className="flex flex-col leading-none">
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '20px',
                      color: COLORS.gold,
                      letterSpacing: '0.1em',
                      fontWeight: 600,
                    }}
                  >
                    cappuccino
                  </span>
                  <span style={{ fontSize: '8px', letterSpacing: '0.4em', color: COLORS.muted }}>
                    КОФЕЙНЯ
                  </span>
                </div>
              </div>
              <p style={{ color: COLORS.muted, fontSize: '13px', lineHeight: 1.9, maxWidth: '260px' }}>
                Два уютных заведения в Астане. Вкусные завтраки весь день, авторские блюда и
                лучший кофе в городе.
              </p>
              <a
                href="https://instagram.com/cappuccino_astana"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center gap-2 group"
              >
                <Instagram size={16} style={{ color: COLORS.gold }} />
                <span
                  style={{ color: COLORS.muted, fontSize: '13px' }}
                  className="group-hover:text-primary transition-colors"
                >
                  {CONTACT.instagram}
                </span>
              </a>
            </div>

            <div>
              <h4
                className="mb-6"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: COLORS.gold,
                  textTransform: 'uppercase',
                }}
              >
                Меню
              </h4>
              <ul className="space-y-3">
                {menuCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(category.id);
                        scrollTo('#menu');
                      }}
                      className="transition-colors hover:text-primary"
                      style={{ color: COLORS.muted, fontSize: '13px' }}
                    >
                      {category.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                className="mb-6"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: COLORS.gold,
                  textTransform: 'uppercase',
                }}
              >
                Контакты
              </h4>
              <div
                className="p-6 space-y-5"
                style={{
                  background: COLORS.bgCard,
                  border: '1px solid rgba(201,168,76,0.3)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
                }}
              >
                <div className="flex gap-3">
                  <MapPin size={15} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.gold }} />
                  <div>
                    <p
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.2em',
                        color: COLORS.gold,
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      Адреса
                    </p>
                    {CONTACT.addresses.map((address) => (
                      <p
                        key={address.full}
                        style={{ color: COLORS.cream, fontSize: '13px', lineHeight: 1.8 }}
                      >
                        {address.full}
                        <span style={{ color: COLORS.muted, fontSize: '11px' }}>
                          {' '}
                          ({address.label})
                        </span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone size={15} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.gold }} />
                  <div>
                    <p
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.2em',
                        color: COLORS.gold,
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      Телефон
                    </p>
                    {CONTACT.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\D/g, '')}`}
                        className="block hover:text-primary transition-colors"
                        style={{ color: COLORS.cream, fontSize: '13px', lineHeight: 1.8 }}
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail size={15} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.gold }} />
                  <div>
                    <p
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.2em',
                        color: COLORS.gold,
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      Instagram
                    </p>
                    <a
                      href="https://instagram.com/cappuccino_astana"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                      style={{ color: COLORS.cream, fontSize: '13px' }}
                    >
                      {CONTACT.instagram}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock size={15} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.gold }} />
                  <div>
                    <p
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.2em',
                        color: COLORS.gold,
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      Режим работы
                    </p>
                    <div style={{ fontSize: '13px', lineHeight: 1.9 }}>
                      <div className="flex justify-between gap-8">
                        <span style={{ color: COLORS.cream }}>Пн – Пт</span>
                        <span style={{ color: COLORS.muted }}>{CONTACT.hours.weekdays}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span style={{ color: COLORS.cream }}>Сб – Вс</span>
                        <span style={{ color: COLORS.muted }}>{CONTACT.hours.weekend}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <button
                    type="button"
                    onClick={() => scrollTo('#reservation')}
                    className="w-full py-3 text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:opacity-90"
                    style={{ background: COLORS.gold, color: COLORS.bg, letterSpacing: '0.2em' }}
                  >
                    Забронировать стол
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-3"
            style={{ borderTop: `1px solid ${COLORS.border}` }}
          >
            <p style={{ color: COLORS.muted, fontSize: '12px' }}>
              © 2025 Cappuccino Кофейня. Все права защищены.
            </p>
            <p style={{ color: COLORS.muted, fontSize: '12px' }}>Астана, Казахстан</p>
            <Link to="/admin" style={{ color: COLORS.muted, fontSize: '11px', opacity: 0.6 }}>
              Админ-панель
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
