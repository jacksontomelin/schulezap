import React from 'react';
import Icon from './Icons';

/* Paleta de avatares — cores fortes, sem pastel */
export const AVATAR_COLORS = {
  M: '#C62828', L: '#2E86C1', B: '#E89B00', T: '#5B8C2A', H: '#8E44AD', A: '#1B5E8E', P: '#0F6E56',
};

export function Avatar({ initial, size = 40, ring, badge, badgeIcon, foto }) {
  const bg = AVATAR_COLORS[initial] || '#6B5A36';
  const inner = foto ? (
    <img src={foto} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block', border: ring ? '2px solid #fff' : 'none' }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: size * 0.4, border: ring ? '2px solid #fff' : 'none' }}>
      {initial}
    </div>
  );
  return (
    <div style={{ position: 'relative', flexShrink: 0, width: size + (ring ? 6 : 0), height: size + (ring ? 6 : 0) }}>
      {ring ? <div style={{ padding: 3, borderRadius: '50%', background: 'var(--gold)' }}>{inner}</div> : inner}
      {badgeIcon && (
        <div style={{ position: 'absolute', bottom: -2, right: -2, width: size * 0.42, height: size * 0.42, borderRadius: '50%', background: 'var(--ink)', color: 'var(--gold)', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={badgeIcon} size={size * 0.22} stroke={2.5} />
        </div>
      )}
      {badge && (
        <div style={{ position: 'absolute', bottom: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', border: '2px solid #fff' }}>{badge}</div>
      )}
    </div>
  );
}

/* Tile colorido com ícone (estilo iOS Settings) */
export function Tile({ icon, tone = 'red', size = 40, radius = 12 }) {
  const tones = {
    red: { bg: 'var(--red-light)', fg: 'var(--red)' },
    gold: { bg: 'var(--gold-light)', fg: 'var(--gold-text)' },
    blue: { bg: 'var(--blue-light)', fg: 'var(--blue-text)' },
    green: { bg: '#E4F1DA', fg: '#3B6D11' },
    ink: { bg: 'var(--ink)', fg: 'var(--gold)' },
    solidRed: { bg: 'var(--red)', fg: '#fff' },
    solidGold: { bg: 'var(--gold)', fg: 'var(--ink)' },
  };
  const t = tones[tone] || tones.red;
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon name={icon} size={size * 0.5} />
    </div>
  );
}

/* Pill / contador */
export function Pill({ icon, children, tone = 'neutral', active, onClick, size = 'md' }) {
  const tones = {
    neutral: { bg: '#F5EFDD', fg: 'var(--ink-2)' },
    red: { bg: 'var(--red-light)', fg: 'var(--red)' },
    gold: { bg: 'var(--gold-light)', fg: 'var(--gold-text)' },
    ink: { bg: 'var(--ink)', fg: 'var(--gold)' },
  };
  const t = active ? tones.red : (tones[tone] || tones.neutral);
  const pad = size === 'sm' ? '3px 9px' : '6px 12px';
  const fs = size === 'sm' ? 11 : 13;
  return (
    <button type="button" onClick={onClick} className="sz-pill" style={{ background: t.bg, color: t.fg, padding: pad, fontSize: fs, cursor: onClick ? 'pointer' : 'default' }}>
      {icon && <Icon name={icon} size={fs + 3} stroke={2.4} style={active && icon === 'heart' ? { fill: 'currentColor' } : undefined} />}
      {children}
    </button>
  );
}

/* Marca SVG vetorial (usada em tamanhos pequenos onde o PNG não fica bom) */
export function Mark({ size = 32, color = '#C62828' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="SchuleZap">
      <path d="M52 16L86 40L86 66L52 88L18 66L18 40Z" fill="none" stroke={color} strokeWidth="7" strokeLinejoin="round" />
      <path d="M28 44L76 44M52 20L52 84" stroke={color} strokeWidth="4" opacity=".55" />
      <circle cx="52" cy="50" r="8" fill={color} />
      <path d="M38 74Q38 60 52 60Q66 60 66 74Z" fill={color} />
    </svg>
  );
}

export function Wordmark({ size = 20, light = false }) {
  return (
    <span style={{ fontWeight: 900, fontSize: size, letterSpacing: '-0.02em', lineHeight: 1 }}>
      <span style={{ color: light ? '#fff' : 'var(--ink)' }}>Schule</span><span style={{ color: light ? 'var(--gold)' : 'var(--red)' }}>Zap</span>
    </span>
  );
}
