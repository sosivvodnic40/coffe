import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import { COLORS, CONTACT } from '../data/constants';

export default function ContactPage() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <PageTitle
          label="Контакты"
          title="Как нас найти"
          subtitle="Два уютных заведения в Астане. Звоните, пишите или бронируйте стол онлайн."
        />
        <div className="grid md:grid-cols-2 gap-8">
          {CONTACT.addresses.map((address, index) => (
            <div key={address.full} className="p-8" style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
              <div className="flex gap-3 mb-4">
                <MapPin size={18} style={{ color: COLORS.gold }} />
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: COLORS.gold }}>{address.label}</p>
                  <p style={{ color: COLORS.cream }}>{address.full}</p>
                </div>
              </div>
              <a href={`tel:${(CONTACT.phones[index] ?? CONTACT.phones[0]).replace(/\D/g, '')}`} className="flex gap-3 mb-3">
                <Phone size={18} style={{ color: COLORS.gold }} />
                <span style={{ color: COLORS.muted }}>{CONTACT.phones[index] ?? CONTACT.phones[0]}</span>
              </a>
            </div>
          ))}
        </div>
        <div className="mt-8 p-8" style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
          <div className="flex gap-3 mb-4">
            <Clock size={18} style={{ color: COLORS.gold }} />
            <div style={{ color: COLORS.muted }}>
              <p>Пн – Пт: {CONTACT.hours.weekdays}</p>
              <p>Сб – Вс: {CONTACT.hours.weekend}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Mail size={18} style={{ color: COLORS.gold }} />
            <span style={{ color: COLORS.muted }}>Instagram: {CONTACT.instagram}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
