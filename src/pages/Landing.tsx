import { useMemo, useState } from 'react';
import { go } from '../nav';
import { LangSwitch, TopBar } from '../components/Header';
import { helpLink } from '../components/Legal';
import { Scaled } from '../components/Scaled';
import { CONFIG } from '../config';
import { Biodata, PAGE_H, PAGE_W, personName } from '../templates/Biodata';
import { sampleDoc } from '../samples';
import { deleteDoc, deleteEverything, getUnlock, listDocs } from '../store';
import type { Lang, Purpose } from '../types';
import { tr } from '../ui';

export function Landing({ lang, onLang, onLegal }: { lang: Lang; onLang: (l: Lang) => void; onLegal: (k: 'privacy' | 'terms') => void }) {
  const [docs, setDocs] = useState(listDocs);
  const vars = { price: CONFIG.price, days: CONFIG.editDays };
  const samples = useMemo(() => [
    sampleDoc('hi', 'shubh-laal'),
    sampleDoc('mr', 'shahi-neela'),
    sampleDoc('en', 'aadhunik'),
    sampleDoc('en', 'resume-blue', 'job'),
  ], []);
  const help = helpLink('Namaste, I need help with my biodata.');
  const purposes: { p: Purpose; icon: string; title: 'forMarriage' | 'forJob' | 'forGeneral'; sub: 'forMarriageSub' | 'forJobSub' | 'forGeneralSub' }[] = [
    { p: 'marriage', icon: '💍', title: 'forMarriage', sub: 'forMarriageSub' },
    { p: 'job', icon: '💼', title: 'forJob', sub: 'forJobSub' },
    { p: 'general', icon: '📄', title: 'forGeneral', sub: 'forGeneralSub' },
  ];

  return (
    <div className="page landing">
      <TopBar><LangSwitch lang={lang} onLang={onLang} /></TopBar>

      <section className="hero">
        <h1>{tr(lang, 'tagline')}</h1>
        <p className="hero-sub">{tr(lang, 'sub')}</p>
        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg" onClick={() => go('start')}>{tr(lang, 'ctaStart')}</button>
          {docs[0] && (
            <button className="btn btn-ghost btn-lg" onClick={() => go(`edit/${docs[0].id}/0`)}>{tr(lang, 'continueDraft')}</button>
          )}
        </div>
        <p className="price-note">✓ {tr(lang, 'priceNote', vars)}</p>
      </section>

      <section className="purposes">
        {purposes.map((x) => (
          <button key={x.p} className="purpose-card" onClick={() => go(`start/${x.p}`)}>
            <span className="purpose-icon" aria-hidden>{x.icon}</span>
            <strong>{tr(lang, x.title)}</strong>
            <span>{tr(lang, x.sub)}</span>
          </button>
        ))}
      </section>

      <section className="pledge" aria-labelledby="pledge-h">
        <h2 id="pledge-h">🛡️ {tr(lang, 'pledgeTitle')}</h2>
        <ul>
          <li>{tr(lang, 'pledge1')}</li>
          <li>{tr(lang, 'pledge2')}</li>
          <li>{tr(lang, 'pledge3')}</li>
          <li>{tr(lang, 'pledge4')}</li>
        </ul>
      </section>

      <section className="samples">
        <h2>{tr(lang, 'samples')}</h2>
        <div className="sample-grid">
          {samples.map((d) => (
            <button key={d.id} className="sample" onClick={() => go(`start/${d.purpose}`)} aria-label={d.heading}>
              <Scaled width={PAGE_W} height={PAGE_H}><Biodata doc={d} /></Scaled>
            </button>
          ))}
        </div>
      </section>

      <section className="how">
        <h2>{tr(lang, 'howTitle')}</h2>
        <ol>
          <li><span>1</span>{tr(lang, 'how1')}</li>
          <li><span>2</span>{tr(lang, 'how2')}</li>
          <li><span>3</span>{tr(lang, 'how3')}</li>
        </ol>
        <button className="btn btn-primary btn-lg" onClick={() => go('start')}>{tr(lang, 'ctaStart')}</button>
      </section>

      <section className="faq">
        <h2>{tr(lang, 'faqTitle')}</h2>
        {(['1', '2', '3', '4'] as const).map((n) => (
          <details key={n}>
            <summary>{tr(lang, `faq${n}q`)}</summary>
            <p>{tr(lang, `faq${n}a`, vars)}</p>
          </details>
        ))}
      </section>

      {docs.length > 0 && (
        <section className="mydocs">
          <h2>{tr(lang, 'myBiodatas')}</h2>
          <ul>
            {docs.map((d) => (
              <li key={d.id}>
                <span>{personName(d) || tr(lang, 'untitled')} {getUnlock(d.id) && <em className="badge">{tr(lang, 'paidBadge')}</em>}</span>
                <span className="mydocs-actions">
                  <button className="btn btn-small" onClick={() => go(`preview/${d.id}`)}>{tr(lang, 'open')}</button>
                  <button className="btn btn-small btn-ghost" onClick={() => { deleteDoc(d.id); setDocs(listDocs()); }} aria-label={tr(lang, 'remove')}>🗑</button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="footer">
        {help && <a className="btn btn-whatsapp" href={help} target="_blank" rel="noreferrer">💬 {tr(lang, 'help')}</a>}
        <nav>
          <button className="linkish" onClick={() => onLegal('privacy')}>{tr(lang, 'privacy')}</button>
          <button className="linkish" onClick={() => onLegal('terms')}>{tr(lang, 'terms')}</button>
          <button className="linkish" onClick={() => { if (confirm(tr(lang, 'deleteAllQ'))) { deleteEverything(); setDocs([]); alert(tr(lang, 'deleted')); } }}>{tr(lang, 'deleteAll')}</button>
        </nav>
        <p className="muted">© {new Date().getFullYear()} Biodata Wallah · biodatawallah.com</p>
      </footer>
    </div>
  );
}
