import { useMemo } from 'react';
import { LangSwitch, TopBar } from '../components/Header';
import { Scaled } from '../components/Scaled';
import { TrustBar } from '../components/TrustBar';
import { go } from '../nav';
import { sampleDoc } from '../samples';
import { Biodata, PAGE_H, PAGE_W } from '../templates/Biodata';
import { TEMPLATES } from '../templates/catalog';
import type { Lang } from '../types';

const TITLE: Record<Lang, string> = { en: 'All designs', hi: 'सभी डिज़ाइन', mr: 'सर्व डिझाइन' };

/** Every template filled with example details. Tapping one starts a biodata of that kind. */
export function Gallery({ lang, onLang }: { lang: Lang; onLang: (l: Lang) => void }) {
  const docs = useMemo(() => TEMPLATES.map((t, i) => {
    const purpose = t.purposes.includes('marriage') ? 'marriage' : 'job';
    return { t, d: sampleDoc(lang, t.id, purpose, i) };
  }), [lang]);
  return (
    <div className="page">
      <TopBar><LangSwitch lang={lang} onLang={onLang} /></TopBar>
      <h1 className="section-title" style={{ marginTop: 24 }}>{TITLE[lang]}</h1>
      <div style={{ marginBottom: 20 }}><TrustBar lang={lang} pick={[2, 0, 4]} tone="plain" /></div>
      <div className="gallery-grid">
        {docs.map(({ t, d }) => (
          <button key={t.id} className="gallery-item" onClick={() => go(`start/${d.purpose}`)}>
            <div className="sample"><Scaled width={PAGE_W} height={PAGE_H}><Biodata doc={d} /></Scaled></div>
            <span>{lang === 'en' ? t.name : t.nameHi}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
