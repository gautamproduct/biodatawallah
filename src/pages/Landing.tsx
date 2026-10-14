import { useMemo, useState } from 'react';
import { LangSwitch, TopBar } from '../components/Header';
import { Icon } from '../components/Icon';
import { helpLink } from '../components/Legal';
import { Scaled } from '../components/Scaled';
import { BusinessLine, WhatYouGet } from '../components/WhatYouGet';
import { CONFIG } from '../config';
import { go } from '../nav';
import { sampleDoc } from '../samples';
import { deleteDoc, deleteEverything, getUnlock, listDocs } from '../store';
import { Biodata, PAGE_H, PAGE_W, personName, WhatsAppCard } from '../templates/Biodata';
import { TEMPLATES } from '../templates/catalog';
import type { Lang } from '../types';
import { tr } from '../ui';

type T3 = Record<Lang, string>;
const c = (en: string, hi: string, mr: string): T3 => ({ en, hi, mr });

const COPY = {
  pillTag: c('New', 'नया', 'नवीन'),
  pill: c('Hindi, Marathi & English · 30 designs', 'हिंदी, मराठी और अंग्रेज़ी · 30 डिज़ाइन', 'मराठी, हिंदी आणि इंग्रजी · 30 डिझाइन'),
  h1a: c('Your biodata,', 'आपका बायोडाटा,', 'तुमचा बायोडाटा,'),
  h1b: c('ready in 5 minutes.', '5 मिनट में तैयार।', '5 मिनिटांत तयार.'),
  sub: c(
    'Make a beautiful marriage, job or general biodata on your phone. We write the hard parts in your language. Free to make — pay only when you download.',
    'शादी, नौकरी या सामान्य बायोडाटा अपने फ़ोन पर बनाइए। मुश्किल हिस्से हम आपकी भाषा में लिख देते हैं। बनाना मुफ़्त — पैसे सिर्फ़ डाउनलोड पर।',
    'लग्न, नोकरी किंवा सामान्य बायोडाटा तुमच्या फोनवर बनवा. अवघड भाग आम्ही तुमच्या भाषेत लिहून देतो. बनवणे मोफत — पैसे फक्त डाउनलोड करताना.',
  ),
  seeDesigns: c('See designs', 'डिज़ाइन देखें', 'डिझाइन पाहा'),
  micro: [c('No login', 'कोई लॉगिन नहीं', 'लॉगिन नाही'), c('Stays on your phone', 'फ़ोन में ही रहता है', 'फोनमध्येच राहतो'), c('UPI payment', 'UPI से भुगतान', 'UPI पेमेंट')],
  chat1: c('Beta, please send the biodata', 'बेटा, बायोडाटा भेज दो', 'बाळा, बायोडाटा पाठव'),
  chat3: c('Looks lovely! Sending to Sharma ji', 'बहुत सुंदर! शर्मा जी को भेज रहे हैं', 'खूप छान! शर्मा काकांना पाठवतो'),
  family: c('Family', 'परिवार', 'कुटुंब'),
  online: c('online', 'ऑनलाइन', 'ऑनलाइन'),
  chipA: c('“About me” written for you', '“मेरे बारे में” लिखा तैयार', '“माझ्याविषयी” लिहून तयार'),
  chipB: c('Your data stays on your phone', 'डेटा आपके फ़ोन में ही', 'डेटा तुमच्या फोनमध्येच'),
  chipC: c(`₹${CONFIG.price} only at download`, `सिर्फ़ डाउनलोड पर ₹${CONFIG.price}`, `फक्त डाउनलोडला ₹${CONFIG.price}`),
  forAll: c('Formats for', 'इनके लिए फ़ॉर्मेट', 'यांच्यासाठी फॉरमॅट'),
  communities: [c('Hindu', 'हिंदू', 'हिंदू'), c('Jain', 'जैन', 'जैन'), c('Muslim', 'मुस्लिम', 'मुस्लिम'), c('Sikh', 'सिख', 'शीख'), c('Christian', 'ईसाई', 'ख्रिश्चन'), c('Job & resume', 'नौकरी व रिज़्यूमे', 'नोकरी व रिझ्युमे')],
  designsKicker: c('Designs', 'डिज़ाइन', 'डिझाइन'),
  designsTitle: c('Modern designs families love to share', 'ऐसे डिज़ाइन जिन्हें परिवार गर्व से भेजें', 'कुटुंब अभिमानाने पाठवतील असे डिझाइन'),
  featKicker: c('Why families choose us', 'परिवार हमें क्यों चुनते हैं', 'कुटुंबे आम्हाला का निवडतात'),
  featTitle: c('Everything a biodata needs. Nothing it doesn’t.', 'बायोडाटा के लिए जो चाहिए, सब कुछ। फ़ालतू कुछ नहीं।', 'बायोडाट्यासाठी हवे ते सर्व. अनावश्यक काहीही नाही.'),
  f1t: c('We write “About me” for you', '“मेरे बारे में” हम लिख देते हैं', '“माझ्याविषयी” आम्ही लिहून देतो'),
  f1p: c('Pick a few words that describe them. We write warm, respectful sentences in your language.', 'स्वभाव के कुछ शब्द चुनें। हम आपकी भाषा में सुंदर, सम्मानजनक वाक्य लिख देते हैं।', 'स्वभावाचे काही शब्द निवडा. आम्ही तुमच्या भाषेत सुंदर, आदरपूर्वक वाक्ये लिहितो.'),
  f2t: c('Your language, properly', 'आपकी भाषा, सही तरीके से', 'तुमची भाषा, योग्य पद्धतीने'),
  f2p: c('Real Devanagari, not Google-translate. Speak instead of typing.', 'असली देवनागरी, गूगल ट्रांसलेट नहीं। टाइप करने की जगह बोलें।', 'खरी देवनागरी, गूगल ट्रान्सलेट नाही. टाइप करण्याऐवजी बोला.'),
  f3t: c('Private by design', 'शुरू से ही निजी', 'सुरुवातीपासून खाजगी'),
  f4t: c('Ready for WhatsApp', 'WhatsApp के लिए तैयार', 'WhatsApp साठी तयार'),
  f4p: c('A crisp photo for chats, plus a print-ready PDF for the pandit and relatives.', 'चैट के लिए साफ़ फ़ोटो, और पंडित जी व रिश्तेदारों के लिए प्रिंट वाला PDF।', 'चॅटसाठी स्पष्ट फोटो, आणि गुरुजी व नातेवाइकांसाठी प्रिंटसाठी PDF.'),
  f5t: c('Hide what you don’t want to share', 'जो नहीं बताना, वो छुपाएँ', 'जे सांगायचे नाही ते लपवा'),
  f5p: c('Caste, income and address are hidden until you choose to show them.', 'जाति, आय और पता तब तक छुपे रहते हैं जब तक आप ख़ुद न दिखाएँ।', 'जात, उत्पन्न आणि पत्ता तुम्ही दाखवेपर्यंत लपवलेले राहतात.'),
  f6t: c('Speak instead of typing', 'टाइप नहीं, बोलकर लिखें', 'टाइप नाही, बोलून लिहा'),
  sampleAbout: c(
    'Priya is a cultured, understanding and family-oriented girl. She has completed an MBA and works as a bank officer in Bhopal.',
    'प्रिया एक संस्कारी, समझदार और परिवार से जुड़ी हुई लड़की है। उन्होंने एमबीए किया है और भोपाल में बैंक अधिकारी हैं।',
    'स्नेहा ही एक संस्कारी, समजूतदार आणि कुटुंबवत्सल मुलगी आहे. ती मुंबईत संशोधक म्हणून कार्यरत आहे.',
  ),
  stepsKicker: c('How it works', 'कैसे काम करता है', 'कसे काम करते'),
  stepsTitle: c('Three steps. No shop visit.', 'तीन कदम। दुकान जाने की ज़रूरत नहीं।', 'तीन पायऱ्या. दुकानात जायची गरज नाही.'),
  priceKicker: c('Pricing', 'क़ीमत', 'किंमत'),
  priceTitle: c('One simple price', 'एक सीधी क़ीमत', 'एकच सोपी किंमत'),
  per: c('per biodata', 'प्रति बायोडाटा', 'प्रति बायोडाटा'),
  priceNote: c('Free to make and preview. Pay only to download.', 'बनाना और देखना मुफ़्त। सिर्फ़ डाउनलोड पर भुगतान।', 'बनवणे आणि पाहणे मोफत. फक्त डाउनलोडसाठी पेमेंट.'),
  final: c('Make the biodata your family will be proud to send.', 'ऐसा बायोडाटा बनाइए जिसे परिवार गर्व से भेजे।', 'असा बायोडाटा बनवा जो कुटुंब अभिमानाने पाठवेल.'),
  navDesigns: c('Designs', 'डिज़ाइन', 'डिझाइन'),
  navPricing: c('Pricing', 'क़ीमत', 'किंमत'),
  navFaq: c('FAQ', 'सवाल', 'प्रश्न'),
};

export function Landing({ lang, onLang, onLegal }: { lang: Lang; onLang: (l: Lang) => void; onLegal: (k: 'privacy' | 'terms') => void }) {
  const L = lang;
  const [docs, setDocs] = useState(listDocs);
  const vars = { price: CONFIG.price, days: CONFIG.editDays };
  const heroDoc = useMemo(() => sampleDoc(L, 'mehrab-rose', 'marriage', L === 'mr' ? 5 : L === 'en' ? 3 : 0), [L]);
  const strip = useMemo(() => TEMPLATES.slice(0, 16).map((t, i) => sampleDoc(L, t.id, t.purposes.includes('marriage') ? 'marriage' : 'job', i)), [L]);
  const help = helpLink('Namaste, I need help with my biodata.');
  const name = personName(heroDoc).split(' ')[0];
  const jump = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="landing">
      <div className="glow" aria-hidden />
      <div className="page">
        <TopBar>
          <nav className="topnav">
            <a href="#designs" onClick={jump('designs')}>{COPY.navDesigns[L]}</a>
            <a href="#pricing" onClick={jump('pricing')}>{COPY.navPricing[L]}</a>
            <a href="#faq" onClick={jump('faq')}>{COPY.navFaq[L]}</a>
          </nav>
          <LangSwitch lang={L} onLang={onLang} />
        </TopBar>

        <section className="hero">
          <div>
            <span className="pill"><b>{COPY.pillTag[L]}</b>{COPY.pill[L]}</span>
            <h1>{COPY.h1a[L]}<br /><span className="grad-text">{COPY.h1b[L]}</span></h1>
            <p className="hero-sub">{COPY.sub[L]}</p>
            <div className="hero-ctas">
              <button className="btn btn-primary btn-lg" onClick={() => go('start')}>{tr(L, 'ctaStart')} <Icon name="arrow" /></button>
              {docs[0]
                ? <button className="btn btn-quiet btn-lg" onClick={() => go(`edit/${docs[0].id}`)}>{tr(L, 'continueDraft')}</button>
                : <button className="btn btn-quiet btn-lg" onClick={() => go('gallery')}>{COPY.seeDesigns[L]}</button>}
            </div>
            <ul className="micro">{COPY.micro.map((m) => <li key={m.en}><Icon name="check" size={16} />{m[L]}</li>)}</ul>
          </div>

          <div className="phone-stage" aria-hidden>
            <div className="phone">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="wa-top">
                  <span className="wa-av">{name.slice(0, 1)}</span>
                  <span className="wa-title">{COPY.family[L]}<small>{COPY.online[L]}</small></span>
                </div>
                <div className="wa-chat">
                  <div className="bub in">{COPY.chat1[L]}<time>9:41</time></div>
                  <div className="bub out bub-img">
                    <Scaled width={1080} height={1350}><WhatsAppCard doc={heroDoc} /></Scaled>
                    <time>9:42 ✓✓</time>
                  </div>
                  <div className="bub out">
                    <div className="bub-file"><span className="pdf">PDF</span><span>{name}-biodata.pdf<small>1 page · A4</small></span></div>
                    <time>9:42 ✓✓</time>
                  </div>
                  <div className="bub in">{COPY.chat3[L]}<time>9:43</time></div>
                </div>
              </div>
            </div>
            <span className="float-chip c1"><span className="dot"><Icon name="sparkle" size={16} /></span>{COPY.chipA[L]}</span>
            <span className="float-chip c2"><span className="dot"><Icon name="lock" size={16} /></span>{COPY.chipB[L]}</span>
            <span className="float-chip c3"><span className="dot"><Icon name="check" size={16} /></span>{COPY.chipC[L]}</span>
          </div>
        </section>

        <div className="communities">
          <span className="lead">{COPY.forAll[L]}</span>
          {COPY.communities.map((x) => <span key={x.en}>{x[L]}</span>)}
        </div>
      </div>

      <section className="section" id="designs">
        <div className="page section-head">
          <div>
            <p className="kicker">{COPY.designsKicker[L]}</p>
            <h2 className="section-title">{COPY.designsTitle[L]}</h2>
          </div>
          <button className="btn btn-quiet" onClick={() => go('gallery')}>{tr(L, 'allDesigns')} <Icon name="arrow" size={18} /></button>
        </div>
        <div className="marquee">
          <div className="marquee-track">
            {[...strip, ...strip].map((d, i) => (
              <button key={`${d.id}-${i}`} className="marquee-item" onClick={() => go(`start/${d.purpose}`)} aria-label={d.heading} tabIndex={i >= strip.length ? -1 : 0}>
                <Scaled width={PAGE_W} height={PAGE_H}><Biodata doc={d} /></Scaled>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="page">
        <section className="section">
          <p className="kicker">{COPY.featKicker[L]}</p>
          <h2 className="section-title">{COPY.featTitle[L]}</h2>
          <div className="bento" style={{ marginTop: 32 }}>
            <div className="b-card b-wide">
              <span className="b-icon"><Icon name="sparkle" /></span>
              <h3>{COPY.f1t[L]}</h3>
              <p>{COPY.f1p[L]}</p>
              <div className="b-sample"><b>✨ </b>{COPY.sampleAbout[L]}</div>
            </div>
            <div className="b-card b-narrow">
              <span className="b-icon"><Icon name="chat" /></span>
              <h3>{COPY.f2t[L]}</h3>
              <p>{COPY.f2p[L]}</p>
              <div className="b-langs"><span>हिंदी</span><span>मराठी</span><span>En</span></div>
            </div>
            <div className="b-card b-mid b-dark">
              <span className="b-icon"><Icon name="lock" /></span>
              <h3>{COPY.f3t[L]}</h3>
              <ul className="b-checks">
                {(['pledge1', 'pledge2', 'pledge3'] as const).map((k) => <li key={k}><Icon name="check" size={16} />{tr(L, k)}</li>)}
              </ul>
            </div>
            <div className="b-card b-mid b-grad">
              <span className="b-icon"><Icon name="download" /></span>
              <h3>{COPY.f4t[L]}</h3>
              <p>{COPY.f4p[L]}</p>
              <div className="b-big">PDF + JPG</div>
            </div>
            <div className="b-card b-wide" style={{ minHeight: 180 }}>
              <span className="b-icon"><Icon name="eyeOff" /></span>
              <h3>{COPY.f5t[L]}</h3>
              <p>{COPY.f5p[L]}</p>
            </div>
            <div className="b-card b-narrow" style={{ minHeight: 180 }}>
              <span className="b-icon"><Icon name="mic" /></span>
              <h3>{COPY.f6t[L]}</h3>
            </div>
          </div>
        </section>

        <section className="section">
          <p className="kicker">{COPY.stepsKicker[L]}</p>
          <h2 className="section-title">{COPY.stepsTitle[L]}</h2>
          <ol className="steps" style={{ marginTop: 32 }}>
            {(['how1', 'how2', 'how3'] as const).map((k, i) => (
              <li key={k}><span className="step-no">{i + 1}</span><p>{tr(L, k)}</p></li>
            ))}
          </ol>
        </section>

        <section className="section" id="pricing">
          <div className="pricing">
            <div>
              <p className="kicker">{COPY.priceKicker[L]}</p>
              <h2 className="section-title">{COPY.priceTitle[L]}</h2>
              <p className="value-compare">{tr(L, 'compare', vars)}</p>
            </div>
            <div className="price-card">
              <div className="price-top"><span className="price-amt">₹{CONFIG.price}</span><span className="price-per">{COPY.per[L]}</span></div>
              <p className="price-note">{COPY.priceNote[L]}</p>
              <WhatYouGet lang={L} />
              <button className="btn btn-brand btn-lg btn-block" onClick={() => go('start')}>{tr(L, 'ctaStart')} <Icon name="arrow" /></button>
            </div>
          </div>
        </section>

        <section className="section faq" id="faq">
          <p className="kicker">{COPY.navFaq[L]}</p>
          <h2 className="section-title">{tr(L, 'faqTitle')}</h2>
          <div className="faq-list">
            {(['1', '2', '3', '4'] as const).map((n) => (
              <details key={n}>
                <summary>{tr(L, `faq${n}q`)}<Icon name="plus" size={20} /></summary>
                <p>{tr(L, `faq${n}a`, vars)}</p>
              </details>
            ))}
          </div>
        </section>

        {docs.length > 0 && (
          <section className="section mydocs">
            <h2 className="section-title" style={{ fontSize: 28 }}>{tr(L, 'myBiodatas')}</h2>
            <ul>
              {docs.map((d) => (
                <li key={d.id}>
                  <span>{personName(d) || tr(L, 'untitled')} {getUnlock(d.id) && <em className="badge">{tr(L, 'paidBadge')}</em>}</span>
                  <span className="mydocs-actions">
                    <button className="btn btn-small btn-quiet" onClick={() => go(`preview/${d.id}`)}>{tr(L, 'open')}</button>
                    <button className="icon-btn" onClick={() => { deleteDoc(d.id); setDocs(listDocs()); }} aria-label={tr(L, 'remove')}><Icon name="trash" size={18} /></button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="cta-band">
          <h2>{COPY.final[L]}</h2>
          <button className="btn btn-brand btn-lg" onClick={() => go('start')}>{tr(L, 'ctaStart')} <Icon name="arrow" /></button>
        </section>

        <footer className="footer">
          <div className="footer-left">
            <a className="brand" href="#/"><span className="brand-mark" aria-hidden>ब</span><span className="brand-name">Biodata <b>Wallah</b></span></a>
            <BusinessLine lang={L} />
            <span className="muted small">© {new Date().getFullYear()} Biodata Wallah</span>
          </div>
          <nav>
            {help && <a className="btn btn-small btn-quiet" href={help} target="_blank" rel="noreferrer"><Icon name="chat" size={16} />{tr(L, 'help')}</a>}
            <button className="linkish" onClick={() => onLegal('privacy')}>{tr(L, 'privacy')}</button>
            <button className="linkish" onClick={() => onLegal('terms')}>{tr(L, 'terms')}</button>
            <button className="linkish" onClick={() => { if (confirm(tr(L, 'deleteAllQ'))) { deleteEverything(); setDocs([]); alert(tr(L, 'deleted')); } }}>{tr(L, 'deleteAll')}</button>
          </nav>
        </footer>
      </div>
    </div>
  );
}
