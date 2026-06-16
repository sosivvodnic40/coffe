import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cardStyle, fieldStyle } from '../components/PageTitle';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../data/constants';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-4" style={cardStyle}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: COLORS.cream, textAlign: 'center' }}>
          Вход
        </h1>
        <p className="text-center text-sm" style={{ color: COLORS.muted }}>
          Войдите, чтобы видеть свои брони в профиле
        </p>
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
          type="password"
          required
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? 'Входим...' : 'Войти'}
        </button>
        <p className="text-center text-sm" style={{ color: COLORS.muted }}>
          Нет аккаунта?{' '}
          <Link to="/register" style={{ color: COLORS.gold }}>Зарегистрироваться</Link>
        </p>
      </form>
    </section>
  );
}
