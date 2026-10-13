import { CONFIG } from '../config';
import type { Lang } from '../types';
import { tr } from '../ui';

// Plain-language drafts. Have a lawyer review these before taking real payments.
const PRIVACY: Record<Lang, string[]> = {
  en: [
    'Biodata Wallah makes your biodata inside your own browser. The details you type and the photo you add are saved only on this phone or computer (in browser storage). We do not upload them to our servers.',
    'We do not sell, show or share your details or photo with anyone. We do not use them to train any AI.',
    'When you pay, our payment partner Razorpay processes the payment. Razorpay receives the details needed to take the payment (such as your UPI ID or phone number) under its own privacy policy.',
    'Only make a biodata for yourself, or for someone who has given you permission. Biodatas are for adults only.',
    'You can delete everything at any time with "Delete all my data". Clearing your browser data also deletes it.',
    'Questions or complaints: message us on WhatsApp. We reply within 2 working days.',
  ],
  hi: [
    'बायोडाटा वाला आपका बायोडाटा आपके अपने ब्राउज़र में बनाता है। आपकी लिखी जानकारी और फ़ोटो सिर्फ़ इसी फ़ोन या कंप्यूटर (ब्राउज़र स्टोरेज) में सेव होती है। हम इसे अपने सर्वर पर अपलोड नहीं करते।',
    'हम आपकी जानकारी या फ़ोटो किसी को नहीं बेचते, दिखाते या देते। इसका उपयोग किसी AI को सिखाने में नहीं होता।',
    'भुगतान हमारे पेमेंट पार्टनर Razorpay के ज़रिए होता है। भुगतान के लिए ज़रूरी जानकारी (जैसे UPI ID या फ़ोन नंबर) Razorpay की अपनी गोपनीयता नीति के तहत उनके पास जाती है।',
    'बायोडाटा सिर्फ़ अपना या किसी की अनुमति से ही बनाएँ। यह सेवा केवल वयस्कों के लिए है।',
    '"मेरा सारा डेटा मिटाएँ" से आप कभी भी सब कुछ मिटा सकते हैं। ब्राउज़र डेटा साफ़ करने से भी यह मिट जाता है।',
    'सवाल या शिकायत: हमें WhatsApp करें। हम 2 कार्य दिवसों में जवाब देते हैं।',
  ],
  mr: [
    'बायोडाटा वाला तुमचा बायोडाटा तुमच्या स्वतःच्या ब्राउझरमध्ये बनवतो. तुम्ही लिहिलेली माहिती आणि फोटो फक्त याच फोन किंवा कॉम्प्युटरमध्ये (ब्राउझर स्टोरेज) सेव्ह होतात. आम्ही ते आमच्या सर्व्हरवर अपलोड करत नाही.',
    'आम्ही तुमची माहिती किंवा फोटो कोणालाही विकत, दाखवत किंवा देत नाही. त्याचा वापर कोणत्याही AI ला शिकवण्यासाठी होत नाही.',
    'पेमेंट आमचे पार्टनर Razorpay मार्फत होते. पेमेंटसाठी आवश्यक माहिती (जसे UPI ID किंवा फोन नंबर) Razorpay च्या गोपनीयता धोरणानुसार त्यांच्याकडे जाते.',
    'बायोडाटा फक्त स्वतःचा किंवा परवानगी घेऊनच बनवा. ही सेवा फक्त प्रौढांसाठी आहे.',
    '"माझा सर्व डेटा पुसा" वापरून तुम्ही कधीही सर्व पुसू शकता. ब्राउझर डेटा साफ केल्यानेही ते पुसले जाते.',
    'प्रश्न किंवा तक्रार: आम्हाला WhatsApp करा. आम्ही 2 कामकाजाच्या दिवसांत उत्तर देतो.',
  ],
};

const TERMS: Record<Lang, string[]> = {
  en: [
    `Making and previewing a biodata is free. Downloading the final PDF and WhatsApp image costs ₹${CONFIG.price} per biodata (one-time, no subscription).`,
    `After payment you can edit and download the same biodata again for ${CONFIG.editDays} days on the same phone.`,
    'Refunds: if the file does not download or has a problem we cannot fix, message us on WhatsApp within 7 days for a full refund.',
    'Horoscope details are what you enter. Please verify them with your pandit. "Write it for me" text is a suggestion; please read and edit it.',
    'You are responsible for the truth of the details in your biodata.',
  ],
  hi: [
    `बायोडाटा बनाना और देखना मुफ़्त है। फ़ाइनल PDF और WhatsApp फ़ोटो डाउनलोड करने का शुल्क ₹${CONFIG.price} प्रति बायोडाटा है (एक बार, कोई सब्सक्रिप्शन नहीं)।`,
    `भुगतान के बाद ${CONFIG.editDays} दिन तक इसी फ़ोन पर वही बायोडाटा बदल और दोबारा डाउनलोड कर सकते हैं।`,
    'रिफ़ंड: फ़ाइल डाउनलोड न हो या ऐसी समस्या हो जो हम ठीक न कर सकें, तो 7 दिन के अंदर WhatsApp करें — पूरे पैसे वापस।',
    'कुंडली की जानकारी आपकी भरी हुई है, कृपया पंडित जी से मिलान करें। "मेरे लिए लिख दें" का लेख सुझाव है, कृपया पढ़कर बदल लें।',
    'बायोडाटा में दी गई जानकारी की सच्चाई की ज़िम्मेदारी आपकी है।',
  ],
  mr: [
    `बायोडाटा बनवणे आणि पाहणे मोफत आहे. अंतिम PDF आणि WhatsApp फोटो डाउनलोड करण्याचे शुल्क ₹${CONFIG.price} प्रति बायोडाटा (एकदाच, सबस्क्रिप्शन नाही).`,
    `पेमेंटनंतर ${CONFIG.editDays} दिवस याच फोनवर तोच बायोडाटा बदलू आणि पुन्हा डाउनलोड करू शकता.`,
    'परतावा: फाईल डाउनलोड न झाल्यास किंवा आम्ही दूर करू शकत नाही अशी अडचण असल्यास 7 दिवसांत WhatsApp करा — पूर्ण पैसे परत.',
    'पत्रिकेची माहिती तुम्ही भरलेली आहे, कृपया गुरुजींकडून खात्री करा. "माझ्यासाठी लिहा" मधील मजकूर सूचना आहे, कृपया वाचून बदला.',
    'बायोडाट्यातील माहितीच्या सत्यतेची जबाबदारी तुमची आहे.',
  ],
};

export function LegalModal({ kind, lang, onClose }: { kind: 'privacy' | 'terms'; lang: Lang; onClose: () => void }) {
  const items = kind === 'privacy' ? PRIVACY[lang] : TERMS[lang];
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>{tr(lang, kind)}</h2>
        <ol className="legal-list">{items.map((p, i) => <li key={i}>{p}</li>)}</ol>
        <button className="btn btn-primary" onClick={onClose}>{tr(lang, 'close')}</button>
      </div>
    </div>
  );
}

export function helpLink(text: string) {
  if (!CONFIG.helplineWhatsApp) return null;
  return `https://wa.me/${CONFIG.helplineWhatsApp}?text=${encodeURIComponent(text)}`;
}
