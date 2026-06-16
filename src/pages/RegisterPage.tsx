import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cardStyle, fieldStyle } from '../components/PageTitle';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../data/constants';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    try {
      await register({ email, password, fullName, phone });
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-4" style={cardStyle}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: COLORS.cream, textAlign: 'center' }}>
          Регистрация
        </h1>
        <p className="text-center text-sm" style={{ color: COLORS.muted }}>
          Создайте аккаунт для бронирования и истории заказов
        </p>
        <input
          type="text"
          required
          placeholder="Имя и фамилия"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 text-sm outline-none"
          style={fieldStyle}
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 text-sm outline-none"
          style={fieldStyle}
        />
        <input
          type="tel"
          required
          placeholder="Телефон +7..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 text-sm outline-none"
          style={fieldStyle}
        />
        <input
          type="password"
          required
          placeholder="Пароль (мин. 6 символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 text-sm outline-none"
          style={fieldStyle}
        />
        <input
          type="password"
          required
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 text-sm outline-none"
          style={fieldStyle}
        />
        {error && <p style={{ color: '#e57373', fontSize: '13px' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-60"
          style={{ background: COLORS.gold, color: COLORS.bg }}
        >
          {loading ? 'Регистрируем...' : 'Создать аккаунт'}
        </button>
        <p className="text-center text-sm" style={{ color: COLORS.muted }}>
          Уже есть аккаунт?{' '}
          <Link to="/login" style={{ color: COLORS.gold }}>Войти</Link>
        </p>
      </form>
    </section>
  );
}
