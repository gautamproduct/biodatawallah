import { CONFIG } from '../config';
import type { Lang } from '../types';
import { tr } from '../ui';
import { Icon } from './Icon';

const ITEMS = [
  { icon: 'file', t: 'get1', s: 'get1s' },
  { icon: 'chat', t: 'get2', s: 'get2s' },
  { icon: 'user', t: 'get3', s: 'get3s' },
  { icon: 'edit', t: 'get4', s: 'get4s' },
] as const;

/** The concrete list of files and promises behind the ₹49. */
export function WhatYouGet({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  const vars = { price: CONFIG.price, days: CONFIG.editDays };
  return (
    <ul className={`get-list ${compact ? 'compact' : ''}`}>
      {ITEMS.map((x) => (
        <li key={x.t}>
          <span className="get-icon"><Icon name={x.icon} size={compact ? 18 : 22} /></span>
          <span><strong>{tr(lang, x.t, vars)}</strong>{!compact && <small>{tr(lang, x.s)}</small>}</span>
        </li>
      ))}
    </ul>
  );
}

export function BusinessLine({ lang }: { lang: Lang }) {
  const parts: string[] = [];
  if (CONFIG.ownerName && CONFIG.city) parts.push(tr(lang, 'runBy', { name: CONFIG.ownerName, city: CONFIG.city }));
  if (CONFIG.supportEmail) parts.push(CONFIG.supportEmail);
  if (CONFIG.helplineWhatsApp) parts.push(`WhatsApp +${CONFIG.helplineWhatsApp}`);
  return parts.length ? <p className="muted small">{parts.join(' · ')}</p> : null;
}
