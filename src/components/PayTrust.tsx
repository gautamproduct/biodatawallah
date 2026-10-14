import type { Lang } from '../types';
import { Icon } from './Icon';

type T3 = Record<Lang, string>;
const c = (en: string, hi: string, mr: string): T3 => ({ en, hi, mr });

const FULL: { icon: string; t: T3 }[] = [
  { icon: 'lock', t: c('Razorpay secure', 'Razorpay सुरक्षित', 'Razorpay सुरक्षित') },
  { icon: 'rupee', t: c('No hidden fees', 'कोई छुपा शुल्क नहीं', 'छुपे शुल्क नाहीत') },
  { icon: 'undo', t: c('Refund guarantee', 'पैसे वापसी गारंटी', 'पैसे परत हमी') },
];
const APPS = ['UPI', 'GPay', 'PhonePe', 'Paytm'];

const HEAD = c('Secure payment', 'सुरक्षित भुगतान', 'सुरक्षित पेमेंट');

/** Full reassurance block that sits directly under the pay button. */
export function PayTrust({ lang }: { lang: Lang }) {
  return (
    <div className="paytrust">
      <div className="pt-head"><span className="pt-shield"><Icon name="shield" size={16} /></span>{HEAD[lang]}</div>
      <div className="pay-apps" aria-label="Payment options">{APPS.map((a) => <span key={a} className={`app-${a.toLowerCase()}`}>{a}</span>)}</div>
      <ul>
        {FULL.map((x, i) => <li key={x.t.en}><span className={`pt-ic pt-ic-${i}`}><Icon name={x.icon} size={14} /></span>{x.t[lang]}</li>)}
      </ul>
    </div>
  );
}

const SHORT = c('Secure UPI · Refund guarantee', 'सुरक्षित UPI · पैसे वापसी गारंटी', 'सुरक्षित UPI · पैसे परत हमी');

/** One-line reassurance for anywhere the price is mentioned. */
export function PayAssure({ lang, className = '' }: { lang: Lang; className?: string }) {
  return <p className={`payassure ${className}`}><Icon name="lock" size={15} />{SHORT[lang]}</p>;
}
