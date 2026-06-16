import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type ApiReservation } from '../api/client';
import PageTitle, { cardStyle, fieldStyle } from '../components/PageTitle';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../data/constants';

const STATUS_LABELS: Record<ApiReservation['status'], string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждена',
  cancelled: 'Отменена',
  completed: 'Завершена',
};

export default function ProfilePage() {
  const { user, token, loading, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (!token) return;
    api.getUserReservations(token).then((r) => setReservations(r.reservations)).catch(() => {});
  }, [token]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      await api.updateProfile(token, { fullName, phone });
      await refreshProfile();
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return <p className="py-20 text-center" style={{ color: COLORS.muted }}>Загрузка...</p>;
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <PageTitle label="Личный кабинет" title={`Здравствуйте, ${user.fullName.split(' ')[0]}`} />

        <form onSubmit={handleSave} className="p-8 mb-8 space-y-4" style={cardStyle}>
          <h2 className="text-sm uppercase tracking-widest" style={{ color: COLORS.gold }}>Профиль</h2>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 text-sm outline-none"
            style={fieldStyle}
            placeholder="Имя"
          />
          <input value={user.email} disabled className="w-full px-4 py-3 text-sm outline-none opacity-60" style={fieldStyle} />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 text-sm outline-none"
            style={fieldStyle}
            placeholder="Телефон"
          />
          {saveError && <p style={{ color: '#e57373', fontSize: '13px' }}>{saveError}</p>}
          {saveSuccess && <p style={{ color: COLORS.gold, fontSize: '13px' }}>Профиль сохранён</p>}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-60"
              style={{ background: COLORS.gold, color: COLORS.bg }}
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => { logout(); navigate('/'); }}
              className="px-6 py-3 text-xs uppercase tracking-widest"
              style={{ border: `1px solid ${COLORS.border}`, color: COLORS.muted }}
            >
              Выйти
            </button>
          </div>
        </form>

        <div className="p-8" style={cardStyle}>
          <h2 className="text-sm uppercase tracking-widest mb-6" style={{ color: COLORS.gold }}>Мои брони</h2>
          {reservations.length === 0 ? (
            <p style={{ color: COLORS.muted }}>
              У вас пока нет броней.{' '}
              <Link to="/reservation" style={{ color: COLORS.gold }}>Забронировать стол</Link>
            </p>
          ) : (
            <div className="space-y-4">
              {reservations.map((r) => (
                <div key={r.id} className="p-4" style={{ border: `1px solid ${COLORS.border}` }}>
                  <p style={{ color: COLORS.gold, fontSize: '13px', letterSpacing: '0.1em' }}>{r.confirmationCode}</p>
                  <p style={{ color: COLORS.cream }}>{r.reservationDate} · {r.reservationTime}</p>
                  <p style={{ color: COLORS.muted, fontSize: '13px' }}>
                    {r.locationLabel} · {r.guestsCount} гост(ей) · {STATUS_LABELS[r.status]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
