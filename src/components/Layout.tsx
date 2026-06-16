import { Link, NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Coffee, Instagram, MapPin, Menu, Phone, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COLORS, CONTACT, MENU_CATEGORIES, NAV_LINKS } from '../data/constants';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors duration-200 hover:text-primary ${
    isActive ? 'text-primary' : ''
  }`;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: COLORS.bg, color: COLORS.cream, fontFamily: "'Lato', sans-serif" }}
    >
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(30,15,6,0.97)' : 'rgba(30,15,6,0.85)',
          backdropFilter: 'blur(14px)',
          borderBottom: scrolled ? `1px solid ${COLORS.border}` : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
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
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                className={navLinkClass}
                style={{ color: COLORS.muted, letterSpacing: '0.12em', fontSize: '10px', textTransform: 'uppercase' }}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                to="/profile"
                className="text-xs uppercase tracking-widest"
                style={{ color: COLORS.gold }}
              >
                {user.fullName.split(' ')[0]}
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs uppercase tracking-widest" style={{ color: COLORS.muted }}>
                  Вход
                </Link>
                <Link
                  to="/register"
                  className="text-xs uppercase tracking-widest"
                  style={{ color: COLORS.gold }}
                >
                  Регистрация
                </Link>
              </>
            )}
            <Link
              to="/reservation"
              className="px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:opacity-90"
              style={{ background: COLORS.gold, color: COLORS.bg }}
            >
              Забронировать
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden"
            style={{ color: COLORS.gold }}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className="lg:hidden px-6 pb-6 pt-4 flex flex-col gap-4"
            style={{ background: 'rgba(30,15,6,0.98)', borderTop: `1px solid ${COLORS.border}` }}
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                onClick={() => setMobileOpen(false)}
                className="text-left text-sm uppercase tracking-widest"
                style={{ color: COLORS.muted }}
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ color: COLORS.gold }}>
                Профиль
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{ color: COLORS.muted }}>
                  Вход
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} style={{ color: COLORS.gold }}>
                  Регистрация
                </Link>
              </>
            )}
            <Link
              to="/reservation"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-xs font-bold tracking-widest uppercase text-center"
              style={{ background: COLORS.gold, color: COLORS.bg }}
            >
              Забронировать
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 pt-[72px]">
        <Outlet />
      </main>

      <footer style={{ background: COLORS.bgFooter, borderTop: `1px solid ${COLORS.border}` }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Coffee size={18} style={{ color: COLORS.gold }} />
                <span style={{ fontFamily: "'Cinzel', serif", color: COLORS.gold }}>cappuccino</span>
              </div>
              <p style={{ color: COLORS.muted, fontSize: '13px', lineHeight: 1.8 }}>
                Два уютных заведения в Астане. Завтраки весь день, авторские блюда и лучший кофе.
              </p>
              <a
                href="https://instagram.com/cappuccino_astana"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2"
              >
                <Instagram size={16} style={{ color: COLORS.gold }} />
                <span style={{ color: COLORS.muted, fontSize: '13px' }}>{CONTACT.instagram}</span>
              </a>
            </div>
            <div>
              <h4 className="mb-4 text-xs uppercase tracking-widest" style={{ color: COLORS.gold }}>
                Меню
              </h4>
              <ul className="space-y-2">
                {MENU_CATEGORIES.map((category) => (
                  <li key={category.id}>
                    <Link to="/menu" style={{ color: COLORS.muted, fontSize: '13px' }}>
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs uppercase tracking-widest" style={{ color: COLORS.gold }}>
                Контакты
              </h4>
              <div className="space-y-3">
                {CONTACT.addresses.map((address) => (
                  <div key={address.full} className="flex gap-2">
                    <MapPin size={14} style={{ color: COLORS.gold, marginTop: 2 }} />
                    <span style={{ color: COLORS.muted, fontSize: '13px' }}>{address.full}</span>
                  </div>
                ))}
                {CONTACT.phones.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\D/g, '')}`} className="flex gap-2">
                    <Phone size={14} style={{ color: COLORS.gold, marginTop: 2 }} />
                    <span style={{ color: COLORS.muted, fontSize: '13px' }}>{phone}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-xs" style={{ color: COLORS.muted }}>
            © 2026 Cappuccino · Астана
          </p>
        </div>
      </footer>
    </div>
  );
}
