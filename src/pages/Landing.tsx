import { useMemo, useState } from 'react';
import { LangSwitch, TopBar } from '../components/Header';
import { Icon } from '../components/Icon';
import { TrustBar } from '../components/TrustBar';
import { helpLink } from '../components/Legal';
import { PayAssure } from '../components/PayTrust';
import { Scaled } from '../components/Scaled';
import { BusinessLine } from '../components/WhatYouGet';
import { CONFIG } from '../config';
import { go } from '../nav';
import { sampleDoc } from '../samples';
import { deleteDoc, deleteEverything, getUnlock, listDocs } from '../store';
import { Biodata, PAGE_H, PAGE_W, personName, WhatsAppCard } from '../templates/Biodata';
import { TEMPLATES } from '../templates/catalog';
import type { Lang, Purpose } from '../types';
import { tr } from '../ui';

type T3 = Record<Lang, string>;
const c = (en: string, hi: string, mr: string): T3 => ({ en, hi, mr });
const P = CONFIG.price;

// Short words for everyone: parents, Gen Z and millennials alike.
const COPY = {
  h1a: c('Biodata in', 'बायोडाटा', 'बायोडाटा'),
  h1b: c('5 minutes', '5 मिनट में', '5 मिनिटांत'),
  sub: c('Marriage, job or any biodata. In Hindi, Marathi or English.', 'शादी, नौकरी या कोई भी बायोडाटा। हिंदी, मराठी या अंग्रेज़ी में।', 'लग्न, नोकरी किंवा कोणताही बायोडाटा. मराठी, हिंदी किंवा इंग्रजीत.'),
  cta: c('Make biodata — free', 'बायोडाटा बनाएँ — मुफ़्त', 'बायोडाटा बनवा — मोफत'),
  checks: [c('Free to make', 'बनाना मुफ़्त', 'बनवणे मोफत'), c(`₹${P} only to download`, `डाउनलोड पर सिर्फ़ ₹${P}`, `डाउनलोडला फक्त ₹${P}`), c('Safe on your phone', 'फ़ोन में सुरक्षित', 'फोनमध्ये सुरक्षित')],
  pick: c('What do you need?', 'आपको कौन-सा चाहिए?', 'तुम्हाला कोणता हवा?'),
  marriage: c('Marriage', 'शादी', 'लग्न'),
  job: c('Job', 'नौकरी', 'नोकरी'),
  general: c('Other', 'अन्य', 'इतर'),
  designs: c('Pick a design', 'डिज़ाइन चुनें', 'डिझाइन निवडा'),
  steps: c('How it works', 'कैसे बनता है', 'कसा बनतो'),
  s1: c('Fill details', 'जानकारी भरें', 'माहिती भरा'),
  s2: c('See your biodata', 'बायोडाटा देखें', 'बायोडाटा पाहा'),
  s3: c(`Pay ₹${P}, download`, `₹${P} देकर डाउनलोड करें`, `₹${P} भरून डाउनलोड करा`),
  priceTitle: c(`Just ₹${P}`, `सिर्फ़ ₹${P}`, `फक्त ₹${P}`),
  priceSub: c('Pay only when you download', 'पैसे सिर्फ़ डाउनलोड के समय', 'पैसे फक्त डाउनलोड करताना'),
  inc: [c('PDF for printing', 'प्रिंट के लिए PDF', 'प्रिंटसाठी PDF'), c('Photo for WhatsApp', 'WhatsApp के लिए फ़ोटो', 'WhatsApp साठी फोटो'), c('Edit free for 90 days', '90 दिन तक मुफ़्त बदलाव', '90 दिवस मोफत बदल')],
  shop: c(`Shop charges ₹100–300. Here ₹${P}.`, `दुकान पर ₹100–300। यहाँ ₹${P}।`, `दुकानात ₹100–300. इथे ₹${P}.`),
  chat1: c('Please send the biodata', 'बेटा, बायोडाटा भेज दो', 'बाळा, बायोडाटा पाठव'),
  chat2: c('Looks lovely!', 'बहुत सुंदर!', 'खूप छान!'),
  family: c('Family', 'परिवार', 'कुटुंब'),
  safe: c('Stays on your phone', 'फ़ोन में ही रहता है', 'फोनमध्येच राहतो'),
};

export function Landing({ lang, onLang, onLegal }: { lang: Lang; onLang: (l: Lang) => void; onLegal: (k: 'privacy' | 'terms') => void }) {
  const L = lang;
  const [docs, setDocs] = useState(listDocs);
  const heroDoc = useMemo(() => sampleDoc(L, 'mehrab-rose', 'marriage', L === 'mr' ? 5 : L === 'en' ? 3 : 0), [L]);
  const strip = useMemo(() => TEMPLATES.slice(0, 14).map((t, i) => sampleDoc(L, t.id, t.purposes.includes('marriage') ? 'marriage' : 'job', i)), [L]);
  const help = helpLink('Namaste, I need help with my biodata.');
  const name = personName(heroDoc).split(' ')[0];
  const purposes: { p: Purpose; icon: string; label: T3 }[] = [
    { p: 'marriage', icon: 'ring', label: COPY.marriage },
    { p: 'job', icon: 'briefcase', label: COPY.job },
    { p: 'general', icon: 'file', label: COPY.general },
  ];

  return (
    <div className="landing">
      <div className="glow" aria-hidden />
      <div className="page">
        <TopBar><LangSwitch lang={L} onLang={onLang} /></TopBar>

        <section className="hero">
          <div>
            <h1>{COPY.h1a[L]}<br /><span className="grad-text">{COPY.h1b[L]}</span></h1>
            <p className="hero-sub">{COPY.sub[L]}</p>
            <div className="hero-ctas">
              <button className="btn btn-brand btn-lg" onClick={() => go('start')}>{COPY.cta[L]} <Icon name="arrow" /></button>
              {docs[0] && <button className="btn btn-quiet btn-lg" onClick={() => go(`edit/${docs[0].id}`)}>{tr(L, 'continueDraft')}</button>}
            </div>
            <TrustBar lang={L} pick={[0, 1, 2]} />
            <PayAssure lang={L} />
          </div>

          <div className="phone-stage" aria-hidden>
            <div className="phone">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="wa-top">
                  <span className="wa-av">{name.slice(0, 1)}</span>
                  <span className="wa-title">{COPY.family[L]}<small>online</small></span>
                </div>
                <div className="wa-chat">
                  <div className="bub in">{COPY.chat1[L]}<time>9:41</time></div>
                  <div className="bub out bub-img">
                    <Scaled width={1080} height={1350}><WhatsAppCard doc={heroDoc} /></Scaled>
                    <time>9:42 ✓✓</time>
                  </div>
                  <div className="bub out">
                    <div className="bub-file"><span className="pdf">PDF</span><span>{name}-biodata.pdf<small>1 page</small></span></div>
                    <time>9:42 ✓✓</time>
                  </div>
                  <div className="bub in">{COPY.chat2[L]}<time>9:43</time></div>
                </div>
              </div>
            </div>
            <span className="float-chip c2"><span className="dot"><Icon name="lock" size={16} /></span>{COPY.safe[L]}</span>
          </div>
        </section>

        <section className="pick">
          <h2 className="pick-title">{COPY.pick[L]}</h2>
          <div className="pick-row">
            {purposes.map((x) => (
              <button key={x.p} className="pick-btn" onClick={() => go(`start/${x.p}`)}>
                <span className="pick-icon"><Icon name={x.icon} size={26} /></span>
                <span>{x.label[L]}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="section" id="designs">
        <div className="page section-head">
          <h2 className="section-title">{COPY.designs[L]}</h2>
          <button className="btn btn-quiet btn-small" onClick={() => go('gallery')}>{tr(L, 'allDesigns')} <Icon name="arrow" size={16} /></button>
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
          <h2 className="section-title">{COPY.steps[L]}</h2>
          <ol className="steps simple">
            {[{ i: 'edit', t: COPY.s1 }, { i: 'eye', t: COPY.s2 }, { i: 'download', t: COPY.s3 }].map((s, n) => (
              <li key={n}><span className="step-ic"><Icon name={s.i} size={26} /></span><span className="step-no">{n + 1}</span><p>{s.t[L]}</p></li>
            ))}
          </ol>
          <div className="center"><PayAssure lang={L} /></div>
        </section>

        <section className="final-simple">
          <TrustBar lang={L} pick={[3, 4, 5]} tone="plain" />
          <button className="btn btn-brand btn-lg" onClick={() => go('start')}>{COPY.cta[L]} <Icon name="arrow" /></button>
          <p className="muted">{COPY.shop[L]}</p>
          <PayAssure lang={L} />
        </section>

        {docs.length > 0 && (
          <section className="section mydocs">
            <h2 className="section-title" style={{ fontSize: 26 }}>{tr(L, 'myBiodatas')}</h2>
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

        <footer className="footer">
          <div className="footer-left">
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
