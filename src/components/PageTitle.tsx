import { COLORS } from '../data/constants';

type PageTitleProps = {
  label: string;
  title: string;
  subtitle?: string;
};

export default function PageTitle({ label, title, subtitle }: PageTitleProps) {
  return (
    <div className="text-center mb-12">
      <p
        className="mb-3 tracking-widest uppercase"
        style={{ color: COLORS.gold, fontSize: '10px', letterSpacing: '0.45em' }}
      >
        {label}
      </p>
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 4.5vw, 48px)',
          color: COLORS.cream,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-xl mx-auto" style={{ color: COLORS.muted, lineHeight: 1.8 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export const fieldStyle = {
  background: COLORS.bg,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.cream,
} as const;

export const cardStyle = {
  background: COLORS.bgCard,
  border: `1px solid ${COLORS.border}`,
} as const;
