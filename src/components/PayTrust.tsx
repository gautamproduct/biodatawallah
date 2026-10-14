import type { Lang } from '../types';
import { BRANDS, type Brand } from './brands';
import { Icon } from './Icon';

type T3 = Record<Lang, string>;
const c = (en: string, hi: string, mr: string): T3 => ({ en, hi, mr });

const FULL: { icon: string; t: T3 }[] = [
  { icon: 'rupee', t: c('No hidden fees', 'कोई छुपा शुल्क नहीं', 'छुपे शुल्क नाहीत') },
  { icon: 'undo', t: c('Refund guarantee', 'पैसे वापसी गारंटी', 'पैसे परत हमी') },
];
const APPS: Brand[] = ['gpay', 'phonepe', 'paytm', 'visa', 'mastercard'];

function Logo({ b, size = 18 }: { b: Brand; size?: number }) {
  const x = BRANDS[b];
  return <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={x.title}><path d={x.path} fill={x.hex} /></svg>;
}

const HEAD = c('Secure payment', 'सुरक्षित भुगतान', 'सुरक्षित पेमेंट');

/** Full reassurance block that sits directly under the pay button. */
export function PayTrust({ lang }: { lang: Lang }) {
  return (
    <div className="paytrust">
      <div className="pt-head"><span className="pt-shield"><Icon name="shield" size={16} /></span>{HEAD[lang]}</div>
      <div className="pay-apps" aria-label="Payment options">
        <span className="app-upi"><b>UPI</b></span>
        {APPS.map((a) => <span key={a} className="app-logo" title={BRANDS[a].title}><Logo b={a} size={a === 'gpay' || a === 'paytm' ? 30 : 20} /></span>)}
      </div>
      <div className="pt-razor"><Logo b="razorpay" size={14} />{lang === 'en' ? <>Secured by <b>Razorpay</b></> : <><b>Razorpay</b>&nbsp;{lang === 'hi' ? 'द्वारा सुरक्षित' : 'द्वारे सुरक्षित'}</>}</div>
      <ul>
        {FULL.map((x, i) => <li key={x.t.en}><span className={`pt-ic pt-ic-${i + 1}`}><Icon name={x.icon} size={14} /></span>{x.t[lang]}</li>)}
      </ul>
    </div>
  );
}

const SHORT = c('Secure UPI · Refund guarantee', 'सुरक्षित UPI · पैसे वापसी गारंटी', 'सुरक्षित UPI · पैसे परत हमी');

/** One-line reassurance for anywhere the price is mentioned. */
export function PayAssure({ lang, className = '' }: { lang: Lang; className?: string }) {
  return <p className={`payassure ${className}`}><Icon name="lock" size={15} />{SHORT[lang]}</p>;
}
