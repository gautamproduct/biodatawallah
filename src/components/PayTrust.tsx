import { CONFIG } from '../config';
import type { Lang } from '../types';
import { Icon } from './Icon';

type T3 = Record<Lang, string>;
const c = (en: string, hi: string, mr: string): T3 => ({ en, hi, mr });

const FULL: { icon: string; t: T3 }[] = [
  { icon: 'lock', t: c('Secure payment by Razorpay', 'Razorpay से सुरक्षित भुगतान', 'Razorpay द्वारे सुरक्षित पेमेंट') },
  { icon: 'shield', t: c('We never see your UPI PIN or card', 'आपका UPI PIN या कार्ड हम कभी नहीं देखते', 'तुमचा UPI PIN किंवा कार्ड आम्ही कधीही पाहत नाही') },
  { icon: 'rupee', t: c(`One-time ₹${CONFIG.price}. No hidden charges`, `सिर्फ़ एक बार ₹${CONFIG.price}। कोई छुपा शुल्क नहीं`, `फक्त एकदाच ₹${CONFIG.price}. कोणतेही छुपे शुल्क नाही`) },
  { icon: 'download', t: c('Instant download after payment', 'भुगतान के तुरंत बाद डाउनलोड', 'पेमेंटनंतर लगेच डाउनलोड') },
  { icon: 'undo', t: c('File problem? Full refund in 7 days', 'फ़ाइल में दिक्कत? 7 दिन में पूरे पैसे वापस', 'फाईलमध्ये अडचण? 7 दिवसांत पूर्ण पैसे परत') },
];
const APPS = ['UPI', 'GPay', 'PhonePe', 'Paytm', 'BHIM', 'Cards'];

/** Full reassurance block that sits directly under the pay button. */
export function PayTrust({ lang }: { lang: Lang }) {
  return (
    <div className="paytrust">
      <div className="pay-apps" aria-label="Payment options">{APPS.map((a) => <span key={a}>{a}</span>)}</div>
      <ul>
        {FULL.map((x) => <li key={x.t.en}><Icon name={x.icon} size={16} />{x.t[lang]}</li>)}
      </ul>
    </div>
  );
}

const SHORT = c('Secure UPI · No hidden charges · Refund if any problem', 'सुरक्षित UPI · कोई छुपा शुल्क नहीं · दिक्कत पर पैसे वापस', 'सुरक्षित UPI · छुपे शुल्क नाहीत · अडचणीत पैसे परत');

/** One-line reassurance for anywhere the price is mentioned. */
export function PayAssure({ lang, className = '' }: { lang: Lang; className?: string }) {
  return <p className={`payassure ${className}`}><Icon name="lock" size={15} />{SHORT[lang]}</p>;
}
