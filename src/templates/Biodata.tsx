import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ageFromDob, displayValue, fieldLabel, SECTION_TITLES } from '../fields';
import type { Doc, Lang, Section } from '../types';
import { PALETTES, templateById } from './catalog';

export const PAGE_W = 794;
export const PAGE_H = 1123;

const AGE_WORD: Record<Lang, string> = { en: 'yrs', hi: 'वर्ष', mr: 'वर्षे' };
const PREVIEW_WORD: Record<Lang, string> = { en: 'PREVIEW', hi: 'नमूना', mr: 'नमुना' };

interface Row { id: string; label: string; value: string }

function rowsOf(doc: Doc, s: Section, skipName = true): Row[] {
  return s.fields
    .filter((f) => !f.hidden && f.value.trim() && !(skipName && f.key === 'fullName'))
    .map((f) => {
      let value = displayValue(f.key, f.value, doc.lang);
      if (f.key === 'dob' && doc.purpose === 'marriage') {
        const age = ageFromDob(f.value);
        if (age !== null) value += ` (${age} ${AGE_WORD[doc.lang]})`;
      }
      return { id: f.id, label: fieldLabel(f.key, f.label, doc.lang), value };
    });
}

export function sectionTitle(doc: Doc, s: Section) {
  return s.title || (s.key && SECTION_TITLES[s.key]?.[doc.lang]) || '';
}

function hasContent(doc: Doc, s: Section) {
  if (s.hidden) return false;
  if (s.kind === 'fields') return rowsOf(doc, s).length > 0;
  return s.body.trim().length > 0;
}

export function personName(doc: Doc) {
  for (const s of doc.sections) for (const f of s.fields) if (f.key === 'fullName' && !f.hidden) return f.value.trim();
  return '';
}

function SectionBlock({ doc, s, variant }: { doc: Doc; s: Section; variant: 'table' | 'grid' | 'stack' }) {
  const title = sectionTitle(doc, s);
  let body: ReactNode;
  if (s.kind === 'fields') {
    const rows = rowsOf(doc, s);
    body = (
      <div className={`bd-rows bd-rows-${variant}`}>
        {rows.map((r) => (
          <div className="bd-row" key={r.id}>
            <span className="bd-label">{r.label}</span>
            <span className="bd-colon">:</span>
            <span className="bd-value">{r.value}</span>
          </div>
        ))}
      </div>
    );
  } else if (s.kind === 'list') {
    const lines = s.body.split('\n').map((l) => l.trim()).filter(Boolean);
    body = <ul className="bd-list">{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>;
  } else {
    body = <p className="bd-text">{s.body}</p>;
  }
  return (
    <section className="bd-section">
      {title && <h3 className="bd-stitle"><span>{title}</span></h3>}
      {body}
    </section>
  );
}

function Photo({ doc, shape }: { doc: Doc; shape: 'rect' | 'circle' | 'oval' }) {
  if (!doc.photo || !doc.showPhoto) return null;
  return <div className={`bd-photo bd-photo-${shape}`}><img src={doc.photo} alt="" /></div>;
}

interface Props { doc: Doc; watermark?: boolean; showPhoto?: boolean }

/** One A4 biodata page (794 × 1123 CSS px). Text shrinks until everything fits on the page. */
export const Biodata = forwardRef<HTMLDivElement, Props>(function Biodata({ doc: rawDoc, watermark = false, showPhoto }, ref) {
  const doc = showPhoto === undefined ? rawDoc : { ...rawDoc, showPhoto: showPhoto && rawDoc.showPhoto };
  const tpl = templateById(doc.template);
  const pal = PALETTES[doc.color ?? tpl.palette] ?? PALETTES[tpl.palette];
  const inner = useRef<HTMLDivElement>(null);
  const outer = useRef<HTMLDivElement | null>(null);
  const [, setFontsTick] = useState(0);
  // Re-measure once web fonts finish loading (text width changes).
  useEffect(() => { document.fonts.ready.then(() => setFontsTick((t) => t + 1)); }, []);

  // Shrink the base font until the content fits one page.
  useLayoutEffect(() => {
    const page = outer.current;
    const content = inner.current;
    if (!page || !content) return;
    const fits = () => content.scrollHeight <= content.clientHeight + 1;
    const shrinkTo = (min: number) => {
      let size = 15.5;
      page.style.setProperty('--fs', `${size}px`);
      while (!fits() && size > min) {
        size -= 0.5;
        page.style.setProperty('--fs', `${size}px`);
      }
    };
    // First try one column with comfortable text; long biodatas switch to two columns of details.
    page.classList.remove('bd-dense');
    shrinkTo(13.5);
    if (!fits()) {
      page.classList.add('bd-dense');
      shrinkTo(9.5);
    } else {
      // Short biodatas: grow the text so the page looks full, not empty.
      let size = parseFloat(page.style.getPropertyValue('--fs'));
      while (fits() && size < 21) {
        size += 0.5;
        page.style.setProperty('--fs', `${size}px`);
      }
      if (!fits()) page.style.setProperty('--fs', `${size - 0.5}px`);
    }
  });

  const style = {
    '--accent': pal.accent, '--accent2': pal.accent2, '--paper': pal.paper, '--ink': pal.ink, '--soft': pal.soft,
  } as CSSProperties;

  const name = personName(doc);
  const visible = doc.sections.filter((s) => hasContent(doc, s));
  const header = (
    <header className="bd-header">
      {doc.topLine && <div className="bd-topline">{doc.topLine}</div>}
      {doc.heading && <div className="bd-heading">{doc.heading}</div>}
      {name && <h1 className="bd-name">{name}</h1>}
    </header>
  );

  let body: ReactNode;
  const L = tpl.layout;
  if (L === 'sidebar' || L === 'resumeSide') {
    const sideKeys = L === 'sidebar' ? ['contact', 'kundli'] : ['personal', 'skills', 'hobbies'];
    const side = visible.filter((s) => s.key && sideKeys.includes(s.key));
    const main = visible.filter((s) => !side.includes(s));
    body = (
      <div className="bd-split">
        <aside className="bd-side">
          <Photo doc={doc} shape="circle" />
          {name && <h1 className="bd-name">{name}</h1>}
          {doc.heading && L === 'sidebar' && <div className="bd-heading">{doc.heading}</div>}
          {side.map((s) => <SectionBlock key={s.id} doc={doc} s={s} variant="stack" />)}
        </aside>
        <main className="bd-main">
          {doc.topLine && <div className="bd-topline">{doc.topLine}</div>}
          {main.map((s) => <SectionBlock key={s.id} doc={doc} s={s} variant="table" />)}
        </main>
      </div>
    );
  } else if (L === 'royal' || L === 'floral' || L === 'elegant') {
    body = (
      <>
        {header}
        <Photo doc={doc} shape={L === 'elegant' ? 'oval' : 'circle'} />
        {visible.map((s) => <SectionBlock key={s.id} doc={doc} s={s} variant={L === 'royal' ? 'grid' : 'table'} />)}
      </>
    );
  } else {
    // classic, simple, minimal, resume: header on the left, photo top right.
    body = (
      <>
        <div className="bd-headrow">
          {header}
          <Photo doc={doc} shape="rect" />
        </div>
        {visible.map((s) => <SectionBlock key={s.id} doc={doc} s={s} variant="table" />)}
      </>
    );
  }

  return (
    <div
      ref={(el) => { outer.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }}
      className={`bd-page bd-${L} bd-font-${tpl.font} lang-${doc.lang}`}
      style={style}
    >
      {L === 'classic' && <div className="bd-frame" aria-hidden />}
      {L === 'floral' && <div className="bd-corners" aria-hidden />}
      <div className="bd-content" ref={inner}>{body}</div>
      {watermark && (
        <div className="bd-watermark" aria-hidden>
          {Array.from({ length: 14 }, (_, i) => <span key={i}>{PREVIEW_WORD[doc.lang]} · biodatawallah.com</span>)}
        </div>
      )}
      {!watermark && <div className="bd-credit">biodatawallah.com</div>}
    </div>
  );
});

/** The 1080 × 1350 card that looks good inside a WhatsApp chat. */
export const WhatsAppCard = forwardRef<HTMLDivElement, Props>(function WhatsAppCard({ doc, watermark = false, showPhoto = true }, ref) {
  const tpl = templateById(doc.template);
  const pal = PALETTES[doc.color ?? tpl.palette] ?? PALETTES[tpl.palette];
  const style = { '--accent': pal.accent, '--accent2': pal.accent2, '--paper': pal.paper, '--ink': pal.ink, '--soft': pal.soft } as CSSProperties;
  const keys = doc.purpose === 'job'
    ? ['education', 'phone', 'email']
    : ['dob', 'height', 'education', 'occupation', 'workCity', 'nativePlace'];
  const all = doc.sections.flatMap((s) => (s.hidden ? [] : s.fields));
  const facts = keys
    .map((k) => all.find((f) => f.key === k && !f.hidden && f.value.trim()))
    .filter((f): f is NonNullable<typeof f> => !!f)
    .map((f) => {
      let value = displayValue(f.key, f.value, doc.lang);
      if (f.key === 'dob') { const a = ageFromDob(f.value); if (a !== null) value = `${a} ${AGE_WORD[doc.lang]}`; }
      const label = f.key === 'dob' ? ({ en: 'Age', hi: 'आयु', mr: 'वय' } as const)[doc.lang] : fieldLabel(f.key, f.label, doc.lang);
      return { id: f.id, label, value };
    });
  if (doc.purpose === 'job') {
    const edu = doc.sections.find((s) => s.key === 'education')?.body.split('\n')[0];
    if (edu) facts.unshift({ id: 'edu', label: ({ en: 'Education', hi: 'शिक्षा', mr: 'शिक्षण' } as const)[doc.lang], value: edu });
  }
  const photo = showPhoto && doc.showPhoto && doc.photo;
  const footer = ({ en: 'Full biodata PDF attached', hi: 'पूरा बायोडाटा PDF साथ में', mr: 'संपूर्ण बायोडाटा PDF सोबत' } as const)[doc.lang];
  return (
    <div ref={ref} className={`wa-card bd-font-${tpl.font} lang-${doc.lang}`} style={style}>
      <div className="wa-inner">
        {doc.topLine && <div className="wa-topline">{doc.topLine}</div>}
        {photo ? <div className="wa-photo"><img src={doc.photo!} alt="" /></div> : <div className="wa-monogram">{personName(doc).slice(0, 1) || '★'}</div>}
        <h1 className="wa-name">{personName(doc)}</h1>
        <div className="wa-facts">
          {facts.slice(0, 6).map((f) => (
            <div className="wa-fact" key={f.id}><span>{f.label}</span><strong>{f.value}</strong></div>
          ))}
        </div>
        <div className="wa-foot">{footer}</div>
      </div>
      {watermark && (
        <div className="bd-watermark" aria-hidden>
          {Array.from({ length: 14 }, (_, i) => <span key={i}>{PREVIEW_WORD[doc.lang]} · biodatawallah.com</span>)}
        </div>
      )}
    </div>
  );
});
