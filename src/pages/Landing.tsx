import { useMemo, useState } from 'react';
import { LangSwitch, TopBar } from '../components/Header';
import { Icon } from '../components/Icon';
import { helpLink } from '../components/Legal';
import { BusinessLine, WhatYouGet } from '../components/WhatYouGet';
import { Scaled } from '../components/Scaled';
import { CONFIG } from '../config';
import { go } from '../nav';
import { sampleDoc } from '../samples';
import { deleteDoc, deleteEverything, getUnlock, listDocs } from '../store';
import { Biodata, PAGE_H, PAGE_W, personName, WhatsAppCard } from '../templates/Biodata';
import type { Lang, Purpose } from '../types';
import { tr } from '../ui';

const EYEBROW: Record<Lang, string> = { en: 'Marriage · Job · General biodata', hi: 'शादी · नौकरी · सामान्य बायोडाटा', mr: 'लग्न · नोकरी · सामान्य बायोडाटा' };
const FACTS: Record<Lang, string[]> = {
  en: ['Hindi, Marathi & English', '30 ready designs', 'PDF + WhatsApp photo', 'No login'],
  hi: ['हिंदी, मराठी और अंग्रेज़ी', '30 तैयार डिज़ाइन', 'PDF + WhatsApp फ़ोटो', 'कोई लॉगिन नहीं'],
  mr: ['मराठी, हिंदी आणि इंग्रजी', '30 तयार डिझाइन', 'PDF + WhatsApp फोटो', 'लॉगिन नाही'],
};
const MICRO: Record<Lang, string[]> = {
  en: ['Free to make', `₹${CONFIG.price} only to download`, 'Details stay on your phone'],
  hi: ['बनाना मुफ़्त', `सिर्फ़ डाउनलोड पर ₹${CONFIG.price}`, 'जानकारी आपके फ़ोन में ही'],
  mr: ['बनवणे मोफत', `फक्त डाउनलोडसाठी ₹${CONFIG.price}`, 'माहिती तुमच्या फोनमध्येच'],
};
const SEE_DESIGNS: Record<Lang, string> = { en: 'See designs', hi: 'डिज़ाइन देखें', mr: 'डिझाइन पाहा' };
const FINAL: Record<Lang, string> = { en: 'Ready in 5 minutes. Free until you download.', hi: '5 मिनट में तैयार। डाउनलोड तक मुफ़्त।', mr: '5 मिनिटांत तयार. डाउनलोडपर्यंत मोफत.' };

export function Landing({ lang, onLang, onLegal }: { lang: Lang; onLang: (l: Lang) => void; onLegal: (k: 'privacy' | 'terms') => void }) {
  const [docs, setDocs] = useState(listDocs);
  const vars = { price: CONFIG.price, days: CONFIG.editDays };
  const hero = useMemo(() => sampleDoc(lang === 'en' ? 'hi' : lang, 'mehrab-rose'), [lang]);
  const samples = useMemo(() => [
    sampleDoc('mr', 'mehrab-sage', 'marriage', 1),
    sampleDoc('en', 'patrika-emerald', 'marriage', 3),
    sampleDoc('hi', 'rajsi-maroon', 'marriage', 4),
    sampleDoc('en', 'career-ocean', 'job', 1),
  ], []);
  const help = helpLink('Namaste, I need help with my biodata.');
  const purposes: { p: Purpose; icon: string; title: 'forMarriage' | 'forJob' | 'forGeneral'; sub: 'forMarriageSub' | 'forJobSub' | 'forGeneralSub' }[] = [
    { p: 'marriage', icon: 'ring', title: 'forMarriage', sub: 'forMarriageSub' },
    { p: 'job', icon: 'briefcase', title: 'forJob', sub: 'forJobSub' },
    { p: 'general', icon: 'file', title: 'forGeneral', sub: 'forGeneralSub' },
  ];

  return (
    <div className="landing">
      <div className="page">
        <TopBar>
          <LangSwitch lang={lang} onLang={onLang} />
        </TopBar>

        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">{EYEBROW[lang]}</p>
            <h1>{tr(lang, 'tagline')}</h1>
            <p className="hero-sub">{tr(lang, 'sub')}</p>
            <div className="hero-ctas">
              <button className="btn btn-primary btn-lg" onClick={() => go('start')}>{tr(lang, 'ctaStart')} <Icon name="arrow" /></button>
              {docs[0]
                ? <button className="btn btn-quiet btn-lg" onClick={() => go(`edit/${docs[0].id}`)}>{tr(lang, 'continueDraft')}</button>
                : <a className="btn btn-quiet btn-lg" href="#designs" onClick={(e) => { e.preventDefault(); document.getElementById('designs')?.scrollIntoView({ behavior: 'smooth' }); }}>{SEE_DESIGNS[lang]}</a>}
            </div>
            <ul className="micro">
              {MICRO[lang].map((m) => <li key={m}><Icon name="check" size={16} />{m}</li>)}
            </ul>
          </div>
          <div className="hero-visual" aria-hidden>
            <div className="hero-page"><Scaled width={PAGE_W} height={PAGE_H}><Biodata doc={hero} /></Scaled></div>
            <div className="hero-card"><Scaled width={1080} height={1350}><WhatsAppCard doc={hero} /></Scaled></div>
          </div>
        </section>
      </div>

      <div className="facts">
        <div className="page facts-row">
          {FACTS[lang].map((f) => <span key={f}>{f}</span>)}
        </div>
      </div>

      <div className="page">
        <section className="section">
          <div className="purposes">
            {purposes.map((x) => (
              <button key={x.p} className="purpose" onClick={() => go(`start/${x.p}`)}>
                <span className="purpose-icon"><Icon name={x.icon} size={22} /></span>
                <span className="purpose-text">
                  <strong>{tr(lang, x.title)}</strong>
                  <span>{tr(lang, x.sub)}</span>
                </span>
                <Icon name="arrow" className="purpose-arrow" />
              </button>
            ))}
          </div>
        </section>

        <section className="section" id="designs">
          <div className="section-head">
            <h2 className="section-title">{tr(lang, 'samples')}</h2>
            <button className="btn btn-quiet btn-small" onClick={() => go('gallery')}>{tr(lang, 'allDesigns')} <Icon name="arrow" size={16} /></button>
          </div>
          <div className="sample-grid">
            {samples.map((d) => (
              <button key={d.id} className="sample" onClick={() => go(`start/${d.purpose}`)} aria-label={d.heading}>
                <Scaled width={PAGE_W} height={PAGE_H}><Biodata doc={d} /></Scaled>
              </button>
            ))}
          </div>
        </section>

        <section className="section value">
          <div>
            <h2 className="section-title">{tr(lang, 'getTitle', vars)}</h2>
            <p className="value-compare">{tr(lang, 'compare', vars)}</p>
            <button className="btn btn-primary btn-lg" onClick={() => go('start')}>{tr(lang, 'ctaStart')} <Icon name="arrow" /></button>
          </div>
          <WhatYouGet lang={lang} />
        </section>

        <section className="section">
          <h2 className="section-title">{tr(lang, 'howTitle')}</h2>
          <ol className="steps">
            {(['how1', 'how2', 'how3'] as const).map((k, i) => (
              <li key={k}><span className="step-no">{i + 1}</span><p>{tr(lang, k)}</p></li>
            ))}
          </ol>
        </section>
      </div>

      <section className="privacy-band">
        <div className="page privacy-inner">
          <div>
            <span className="privacy-icon"><Icon name="lock" size={26} /></span>
            <h2>{tr(lang, 'pledgeTitle')}</h2>
          </div>
          <ul>
            {(['pledge1', 'pledge2', 'pledge3', 'pledge4'] as const).map((k) => (
              <li key={k}><Icon name="check" size={18} />{tr(lang, k)}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="page">
        <section className="section faq">
          <h2 className="section-title">{tr(lang, 'faqTitle')}</h2>
          {(['1', '2', '3', '4'] as const).map((n) => (
            <details key={n}>
              <summary>{tr(lang, `faq${n}q`)}<Icon name="plus" size={18} /></summary>
              <p>{tr(lang, `faq${n}a`, vars)}</p>
            </details>
          ))}
        </section>

        {docs.length > 0 && (
          <section className="section mydocs">
            <h2 className="section-title">{tr(lang, 'myBiodatas')}</h2>
            <ul>
              {docs.map((d) => (
                <li key={d.id}>
                  <span>{personName(d) || tr(lang, 'untitled')} {getUnlock(d.id) && <em className="badge">{tr(lang, 'paidBadge')}</em>}</span>
                  <span className="mydocs-actions">
                    <button className="btn btn-small btn-quiet" onClick={() => go(`preview/${d.id}`)}>{tr(lang, 'open')}</button>
                    <button className="icon-btn" onClick={() => { deleteDoc(d.id); setDocs(listDocs()); }} aria-label={tr(lang, 'remove')}><Icon name="trash" size={18} /></button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="final-cta">
          <h2>{FINAL[lang]}</h2>
          <button className="btn btn-primary btn-lg" onClick={() => go('start')}>{tr(lang, 'ctaStart')} <Icon name="arrow" /></button>
        </section>

        <footer className="footer">
          {help && <a className="btn btn-quiet" href={help} target="_blank" rel="noreferrer"><Icon name="chat" />{tr(lang, 'help')}</a>}
          <nav>
            <button className="linkish" onClick={() => onLegal('privacy')}>{tr(lang, 'privacy')}</button>
            <button className="linkish" onClick={() => onLegal('terms')}>{tr(lang, 'terms')}</button>
            <button className="linkish" onClick={() => { if (confirm(tr(lang, 'deleteAllQ'))) { deleteEverything(); setDocs([]); alert(tr(lang, 'deleted')); } }}>{tr(lang, 'deleteAll')}</button>
          </nav>
          <BusinessLine lang={lang} />
          <p className="muted small">© {new Date().getFullYear()} Biodata Wallah</p>
        </footer>
      </div>
    </div>
  );
}
