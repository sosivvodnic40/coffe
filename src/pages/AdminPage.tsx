import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, LogOut, RefreshCw } from 'lucide-react';
import { api, type ApiReservation, type DashboardStats } from '../api/client';
import { COLORS } from '../data/constants';

const STATUS_LABELS: Record<ApiReservation['status'], string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждена',
  cancelled: 'Отменена',
  completed: 'Завершена',
};

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem('cappuccino_admin_token') ?? '');
  const [email, setEmail] = useState('admin@cappuccino.kz');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [actionError, setActionError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadDashboard = async (authToken: string) => {
    setLoading(true);
    try {
      const [statsResponse, reservationsResponse] = await Promise.all([
        api.adminStats(authToken),
        api.adminReservations(authToken, filter || undefined),
      ]);
      setStats(statsResponse.stats);
      setReservations(reservationsResponse.reservations);
    } catch {
      localStorage.removeItem('cappuccino_admin_token');
      setToken('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboard(token);
    }
  }, [token, filter]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError('');
    try {
      const response = await api.adminLogin(email, password);
      localStorage.setItem('cappuccino_admin_token', response.token);
      setToken(response.token);
      setPassword('');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Ошибка входа');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cappuccino_admin_token');
    setToken('');
    setStats(null);
    setReservations([]);
  };

  const updateStatus = async (id: number, status: ApiReservation['status']) => {
    if (!token) return;

    const reservation = reservations.find((item) => item.id === id);
    if (!reservation || reservation.status === status) return;

    const previousStatus = reservation.status;
    setActionError('');
    setUpdatingId(id);
    setReservations((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    try {
      await api.adminUpdateReservation(token, id, status);
      const statsResponse = await api.adminStats(token);
      setStats(statsResponse.stats);

      if (filter && filter !== status) {
        setReservations((current) => current.filter((item) => item.id !== id));
      }
    } catch (error) {
      setReservations((current) =>
        current.map((item) => (item.id === id ? { ...item, status: previousStatus } : item)),
      );
      setActionError(error instanceof Error ? error.message : 'Не удалось обновить статус');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: COLORS.bg, color: COLORS.cream, fontFamily: "'Lato', sans-serif" }}
    >
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: COLORS.border, background: COLORS.bgCard }}
      >
        <div className="flex items-center gap-3">
          <Coffee size={20} style={{ color: COLORS.gold }} />
          <div>
            <p style={{ color: COLORS.gold, fontFamily: "'Cinzel', serif", letterSpacing: '0.1em' }}>
              cappuccino
            </p>
            <p style={{ fontSize: '11px', color: COLORS.muted }}>Панель администратора</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" style={{ color: COLORS.muted, fontSize: '13px' }}>
            На сайт
          </Link>
          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs uppercase tracking-widest"
              style={{ color: COLORS.gold }}
            >
              <LogOut size={14} />
              Выйти
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {!token ? (
          <form
            onSubmit={handleLogin}
            className="max-w-md mx-auto p-8 space-y-4"
            style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
          >
            <h1
              className="text-center mb-2"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px' }}
            >
              Вход администратора
            </h1>
            <p className="text-center mb-6" style={{ color: COLORS.muted, fontSize: '14px' }}>
              Управление бронированиями и просмотр статистики
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.cream }}
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.cream }}
            />
            {loginError && <p style={{ color: '#e57373', fontSize: '13px' }}>{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 text-xs font-bold tracking-widest uppercase"
              style={{ background: COLORS.gold, color: COLORS.bg }}
            >
              Войти
            </button>
          </form>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px' }}>
                Управление бронированиями
              </h1>
              <button
                type="button"
                onClick={() => loadDashboard(token)}
                className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest"
                style={{ border: `1px solid ${COLORS.border}`, color: COLORS.gold }}
              >
                <RefreshCw size={14} />
                Обновить
              </button>
            </div>

            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Всего броней', value: stats.totalReservations },
                  { label: 'Ожидают', value: stats.pendingReservations },
                  { label: 'Подтверждено сегодня', value: stats.confirmedToday },
                  { label: 'Гостей сегодня', value: stats.guestsToday },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-5"
                    style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                  >
                    <p style={{ fontSize: '24px', color: COLORS.gold, fontFamily: "'Playfair Display', serif" }}>
                      {item.value}
                    </p>
                    <p style={{ fontSize: '12px', color: COLORS.muted }}>{item.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-4 flex gap-2 flex-wrap">
              {['', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
                <button
                  key={status || 'all'}
                  type="button"
                  onClick={() => setFilter(status)}
                  className="px-4 py-2 text-xs uppercase tracking-widest"
                  style={{
                    background: filter === status ? COLORS.gold : 'transparent',
                    color: filter === status ? COLORS.bg : COLORS.muted,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  {status ? STATUS_LABELS[status as ApiReservation['status']] : 'Все'}
                </button>
              ))}
            </div>

            {actionError && (
              <p className="mb-4" style={{ color: '#e57373', fontSize: '13px' }}>
                {actionError}
              </p>
            )}

            {loading ? (
              <p style={{ color: COLORS.muted }}>Загрузка...</p>
            ) : (
              <div className="overflow-x-auto" style={{ border: `1px solid ${COLORS.border}` }}>
                <table className="w-full text-sm" style={{ background: COLORS.bgCard }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}`, color: COLORS.muted }}>
                      <th className="text-left p-4">Код</th>
                      <th className="text-left p-4">Гость</th>
                      <th className="text-left p-4">Дата / время</th>
                      <th className="text-left p-4">Локация</th>
                      <th className="text-left p-4">Гостей</th>
                      <th className="text-left p-4">Статус</th>
                      <th className="text-left p-4">Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <td className="p-4" style={{ color: COLORS.gold }}>
                          {reservation.confirmationCode}
                        </td>
                        <td className="p-4">
                          <div>{reservation.guestName}</div>
                          <div style={{ color: COLORS.muted, fontSize: '12px' }}>{reservation.guestPhone}</div>
                        </td>
                        <td className="p-4">
                          {reservation.reservationDate} {reservation.reservationTime}
                        </td>
                        <td className="p-4">{reservation.locationLabel}</td>
                        <td className="p-4">{reservation.guestsCount}</td>
                        <td className="p-4">{STATUS_LABELS[reservation.status]}</td>
                        <td className="p-4">
                          <select
                            value={reservation.status}
                            disabled={updatingId === reservation.id}
                            onChange={(e) =>
                              updateStatus(reservation.id, e.target.value as ApiReservation['status'])
                            }
                            className="px-2 py-1 text-xs outline-none cursor-pointer"
                            style={{
                              background: COLORS.bg,
                              border: `1px solid ${COLORS.border}`,
                              color: COLORS.cream,
                              opacity: updatingId === reservation.id ? 0.6 : 1,
                            }}
                          >
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reservations.length === 0 && (
                  <p className="p-8 text-center" style={{ color: COLORS.muted }}>
                    Бронирования не найдены
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
