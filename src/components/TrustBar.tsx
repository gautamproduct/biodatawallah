import { CONFIG } from '../config';
import type { Lang } from '../types';
import { Icon } from './Icon';

type T3 = Record<Lang, string>;
const c = (en: string, hi: string, mr: string): T3 => ({ en, hi, mr });

// Short, true promises only. No invented reviews or user counts.
const ITEMS: { icon: string; t: T3 }[] = [
  { icon: 'lock', t: c('Stays on your phone', 'फ़ोन में ही सुरक्षित', 'फोनमध्येच सुरक्षित') },
  { icon: 'user', t: c('No login', 'कोई लॉगिन नहीं', 'लॉगिन नाही') },
  { icon: 'eye', t: c('See before you pay', 'पहले देखें, फिर भुगतान', 'आधी पाहा, मग पेमेंट') },
  { icon: 'shield', t: c('Secure UPI payment', 'सुरक्षित UPI भुगतान', 'सुरक्षित UPI पेमेंट') },
  { icon: 'undo', t: c('Full refund if any problem', 'दिक्कत हो तो पूरे पैसे वापस', 'अडचण आल्यास पूर्ण पैसे परत') },
  { icon: 'eyeOff', t: c('Photo never shared', 'फ़ोटो कभी शेयर नहीं', 'फोटो कधीही शेअर नाही') },
];

/** A row of small trust badges. `pick` chooses which badges (by index) to show. */
export function TrustBar({ lang, pick = [0, 1, 2, 4], tone = 'light' }: { lang: Lang; pick?: number[]; tone?: 'light' | 'plain' }) {
  return (
    <ul className={`trustbar trustbar-${tone}`} aria-label="Our promises">
      {pick.map((i) => ITEMS[i]).filter(Boolean).map((x) => (
        <li key={x.t.en}><Icon name={x.icon} size={16} />{x.t[lang]}</li>
      ))}
      {CONFIG.helplineWhatsApp && (
        <li><Icon name="chat" size={16} />{({ en: 'WhatsApp help', hi: 'WhatsApp पर मदद', mr: 'WhatsApp वर मदत' } as T3)[lang]}</li>
      )}
    </ul>
  );
}
