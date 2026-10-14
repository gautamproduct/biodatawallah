import { CONFIG } from '../config';
import type { Lang } from '../types';
import { Icon } from './Icon';

type T3 = Record<Lang, string>;
const c = (en: string, hi: string, mr: string): T3 => ({ en, hi, mr });

// Short, true promises only. No invented reviews or user counts.
const ITEMS: { icon: string; t: T3 }[] = [
  { icon: 'lock', t: c('Data stays private', 'डेटा सुरक्षित', 'डेटा सुरक्षित') },
  { icon: 'user', t: c('No login', 'लॉगिन नहीं', 'लॉगिन नाही') },
  { icon: 'eye', t: c('See first, pay later', 'पहले देखें', 'आधी पाहा') },
  { icon: 'shield', t: c('Secure UPI', 'सुरक्षित UPI', 'सुरक्षित UPI') },
  { icon: 'undo', t: c('Refund guarantee', 'पैसे वापसी', 'पैसे परत') },
  { icon: 'eyeOff', t: c('Photo private', 'फ़ोटो सुरक्षित', 'फोटो सुरक्षित') },
];

/** A row of small trust badges. `pick` chooses which badges (by index) to show. */
export function TrustBar({ lang, pick = [0, 1, 2, 4], tone = 'light' }: { lang: Lang; pick?: number[]; tone?: 'light' | 'plain' }) {
  return (
    <ul className={`trustbar trustbar-${tone}`} aria-label="Our promises">
      {pick.filter((i) => ITEMS[i]).map((i) => (
        <li key={ITEMS[i].t.en} className={`tb-${i}`}><span className="tb-ic"><Icon name={ITEMS[i].icon} size={14} /></span>{ITEMS[i].t[lang]}</li>
      ))}
      {CONFIG.helplineWhatsApp && (
        <li className="tb-wa"><span className="tb-ic"><Icon name="chat" size={14} /></span>{({ en: 'WhatsApp help', hi: 'WhatsApp मदद', mr: 'WhatsApp मदत' } as T3)[lang]}</li>
      )}
    </ul>
  );
}
