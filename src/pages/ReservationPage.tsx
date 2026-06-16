import { FormEvent, useEffect, useState } from 'react';
import { Coffee, Clock, Phone } from 'lucide-react';
import { api } from '../api/client';
import PageTitle, { cardStyle, fieldStyle } from '../components/PageTitle';
import { useAuth } from '../context/AuthContext';
import { COLORS, CONTACT, INITIAL_FORM, ReservationForm } from '../data/constants';

export default function ReservationPage() {
  const { user, token } = useAuth();
  const [form, setForm] = useState<ReservationForm>(INITIAL_FORM);
  const [locations, setLocations] = useState(
    CONTACT.addresses.map((address, index) => ({
      id: index === 0 ? 'kabanbay' : 'alfarabi',
      label: address.label,
      fullAddress: address.full,
      phone: CONTACT.phones[index] ?? CONTACT.phones[0],
    })),
  );
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    api.getLocations().then((r) => setLocations(r.locations)).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        name: user.fullName,
        phone: user.phone,
      }));
    }
  }, [user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await api.createReservation(
        {
          locationId: form.locationId,
          name: form.name,
          phone: form.phone,
          date: form.date,
          time: form.time,
          guests: form.guests,
          comment: form.comment,
        },
        token ?? undefined,
      );
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
      const r = response.reservation;
      const labels: Record<string, string> = {
        pending: 'Ожидает',
        confirmed: 'Подтверждена',
        cancelled: 'Отменена',
        completed: 'Завершена',
      };
      setLookupResult(
        `${r.guestName}, ${r.reservationDate} ${r.reservationTime}, ${r.locationLabel} — ${labels[r.status]}`,
      );
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : 'Бронь не найдена');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <section className="py-20 px-6" style={{ background: COLORS.bgDark }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div>
          <PageTitle label="Резервация" title="Забронируйте ваш стол" />
          <p className="mb-8" style={{ color: COLORS.muted, lineHeight: 1.9 }}>
            Заполните форму — мы подтвердим бронь в течение 30 минут.
            {user && ' Ваши данные подставлены из профиля.'}
          </p>
          {CONTACT.phones.map((phone) => (
            <a key={phone} href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center gap-3 mb-3">
              <Phone size={15} style={{ color: COLORS.gold }} />
              <span style={{ color: COLORS.muted, fontSize: '14px' }}>{phone}</span>
            </a>
          ))}
          <div className="flex items-start gap-3 mt-4">
            <Clock size={15} style={{ color: COLORS.gold, marginTop: 2 }} />
            <div style={{ fontSize: '14px', color: COLORS.muted }}>
              <p>Пн – Пт: {CONTACT.hours.weekdays}</p>
              <p>Сб – Вс: {CONTACT.hours.weekend}</p>
            </div>
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="text-center py-16 px-8" style={cardStyle}>
              <Coffee size={32} style={{ color: COLORS.gold, margin: '0 auto 16px' }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: COLORS.cream }}>
                Спасибо, {form.name}!
              </h3>
              <p className="mt-3" style={{ color: COLORS.muted, fontSize: '14px' }}>
                Код брони: <span style={{ color: COLORS.gold }}>{confirmationCode}</span>
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); }}
                className="mt-6 text-xs uppercase tracking-widest"
                style={{ color: COLORS.muted }}
              >
                Новая бронь
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-8" style={cardStyle}>
              <select
                required
                value={form.locationId}
                onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                className="w-full px-4 py-3 text-sm outline-none"
                style={{ ...fieldStyle, colorScheme: 'dark' }}
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.fullAddress}</option>
                ))}
              </select>
              {[
                { id: 'name' as const, label: 'Имя', type: 'text' },
                { id: 'phone' as const, label: 'Телефон', type: 'tel' },
                { id: 'date' as const, label: 'Дата', type: 'date' },
                { id: 'time' as const, label: 'Время', type: 'time' },
              ].map((field) => (
                <input
                  key={field.id}
                  required
                  type={field.type}
                  placeholder={field.label}
                  value={form[field.id]}
                  onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                  className="w-full px-4 py-3 text-sm outline-none"
                  style={{ ...fieldStyle, colorScheme: 'dark' }}
                />
              ))}
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full px-4 py-3 text-sm outline-none"
                style={{ ...fieldStyle, colorScheme: 'dark' }}
              >
                {['1', '2', '3', '4', '5', '6', '7', '8+'].map((v) => (
                  <option key={v} value={v}>{v} {v === '8+' ? 'и более' : 'гост(ей)'}</option>
                ))}
              </select>
              <textarea
                rows={3}
                placeholder="Пожелания..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full px-4 py-3 text-sm outline-none resize-none"
                style={fieldStyle}
              />
              {submitError && <p style={{ color: '#e57373', fontSize: '13px' }}>{submitError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest disabled:opacity-60"
                style={{ background: COLORS.gold, color: COLORS.bg }}
              >
                {isSubmitting ? 'Отправляем...' : 'Подтвердить резервацию'}
              </button>
            </form>
          )}

          <form onSubmit={handleLookup} className="mt-4 space-y-3 p-6" style={cardStyle}>
            <p className="text-xs uppercase tracking-widest" style={{ color: COLORS.muted }}>Проверить бронь по коду</p>
            <div className="flex gap-2">
              <input
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
                placeholder="CP-XXXXXX"
                className="flex-1 px-4 py-3 text-sm outline-none"
                style={fieldStyle}
              />
              <button type="submit" disabled={lookupLoading} className="px-4 py-3 text-xs font-bold uppercase" style={{ background: COLORS.gold, color: COLORS.bg }}>
                Найти
              </button>
            </div>
            {lookupResult && <p style={{ color: COLORS.cream, fontSize: '13px' }}>{lookupResult}</p>}
            {lookupError && <p style={{ color: '#e57373', fontSize: '13px' }}>{lookupError}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
