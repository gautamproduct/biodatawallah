import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ageFromDob, displayValue, fieldLabel, SECTION_TITLES } from '../fields';
import type { Doc, Lang, Section } from '../types';
import { PALETTES, templateById, type Layout } from './catalog';
import { DecoCorner, Divider, FloralCorner, Mandala, SectionIcon } from './Ornaments';

export const PAGE_W = 794;
export const PAGE_H = 1123;

const AGE_WORD: Record<Lang, string> = { en: 'yrs', hi: 'वर्ष', mr: 'वर्षे' };
const PREVIEW_WORD: Record<Lang, string> = { en: 'PREVIEW', hi: 'नमूना', mr: 'नमुना' };

interface Row { id: string; label: string; value: string }

function rowsOf(doc: Doc, s: Section): Row[] {
  return s.fields
    .filter((f) => !f.hidden && f.value.trim() && f.key !== 'fullName')
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

function fieldValue(doc: Doc, key: string) {
  for (const s of doc.sections) {
    if (s.hidden) continue;
    for (const f of s.fields) if (f.key === key && !f.hidden && f.value.trim()) return f;
  }
  return null;
}

/** "27 yrs · 5 ft 4 in · MBA · Bank officer, Bhopal" — the line families read first. */
export function summaryLine(doc: Doc): string {
  const parts: string[] = [];
  const dob = fieldValue(doc, 'dob');
  if (dob && doc.purpose === 'marriage') { const a = ageFromDob(dob.value); if (a !== null) parts.push(`${a} ${AGE_WORD[doc.lang]}`); }
  const h = fieldValue(doc, 'height');
  if (h) parts.push(displayValue('height', h.value, doc.lang).replace(/ \(.*\)$/, ''));
  const edu = fieldValue(doc, 'education');
  if (edu) parts.push(edu.value);
  const occ = fieldValue(doc, 'occupation');
  const city = fieldValue(doc, 'workCity');
  if (occ) parts.push(city ? `${occ.value}, ${city.value}` : occ.value);
  if (doc.purpose !== 'marriage') {
    const ph = fieldValue(doc, 'phone'); if (ph) parts.push(ph.value);
    const em = fieldValue(doc, 'email'); if (em) parts.push(em.value);
  }
  return parts.join('  ·  ');
}

type RowStyle = 'stack' | 'table';

function SectionBlock({ doc, s, rows, icons }: { doc: Doc; s: Section; rows: RowStyle; icons?: boolean }) {
  const title = sectionTitle(doc, s);
  let body: ReactNode;
  if (s.kind === 'fields') {
    body = (
      <div className={`bd-rows bd-rows-${rows}`}>
        {rowsOf(doc, s).map((r) => (
          <div className="bd-row" key={r.id}>
            <span className="bd-label">{r.label}</span>
            {rows === 'table' && <span className="bd-colon">:</span>}
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
    <section className={`bd-section bd-kind-${s.kind}`}>
      {title && (
        <h3 className="bd-stitle">
          {icons && <SectionIcon k={s.key} />}
          <span>{title}</span>
        </h3>
      )}
      {body}
    </section>
  );
}

function Photo({ doc, shape }: { doc: Doc; shape: 'arch' | 'rect' | 'circle' | 'oval' | 'cover' }) {
  if (!doc.photo || !doc.showPhoto) return null;
  return <div className={`bd-photo bd-photo-${shape}`}><img src={doc.photo} alt="" /></div>;
}

function Head({ doc, center = false }: { doc: Doc; center?: boolean }) {
  const name = personName(doc);
  const sum = summaryLine(doc);
  return (
    <header className={`bd-header ${center ? 'is-center' : ''}`}>
      {doc.topLine && <div className="bd-topline">{doc.topLine}</div>}
      {doc.heading && <div className="bd-heading">{doc.heading}</div>}
      {name && <h1 className="bd-name">{name}</h1>}
      {sum && <div className="bd-summary">{sum}</div>}
    </header>
  );
}

const ROW_STYLE: Record<Layout, RowStyle> = {
  arch: 'stack', modern: 'stack', editorial: 'table', tiles: 'stack', mandala: 'stack', royal: 'stack', floral: 'stack', heritage: 'table', resume: 'table', resumeSide: 'table',
};

interface Props { doc: Doc; watermark?: boolean; showPhoto?: boolean }

/** One A4 biodata page (794 × 1123 CSS px). Text scales so the content always fills exactly one page. */
export const Biodata = forwardRef<HTMLDivElement, Props>(function Biodata({ doc: rawDoc, watermark = false, showPhoto }, ref) {
  const doc = showPhoto === undefined ? rawDoc : { ...rawDoc, showPhoto: showPhoto && rawDoc.showPhoto };
  const tpl = templateById(doc.template);
  const pal = PALETTES[doc.color ?? tpl.palette] ?? PALETTES[tpl.palette];
  const outer = useRef<HTMLDivElement | null>(null);
  const [, setFontsTick] = useState(0);
  useEffect(() => { document.fonts.ready.then(() => setFontsTick((t) => t + 1)); }, []);

  useLayoutEffect(() => {
    const page = outer.current;
    if (!page) return;
    const regions = Array.from(page.querySelectorAll<HTMLElement>('[data-fit]'));
    const fits = () => regions.every((r) => r.scrollHeight <= r.clientHeight + 1);
    const setFs = (n: number) => page.style.setProperty('--fs', `${n}px`);
    let size = 15;
    setFs(size);
    page.classList.remove('bd-dense');
    while (!fits() && size > 12.5) { size -= 0.5; setFs(size); }
    if (!fits()) {
      page.classList.add('bd-dense');
      size = 14; setFs(size);
      while (!fits() && size > 9) { size -= 0.5; setFs(size); }
    } else {
      while (fits() && size < 20) { size += 0.5; setFs(size); }
      if (!fits()) setFs(size - 0.5);
    }
  });

  const style = {
    '--accent': pal.accent, '--accent2': pal.accent2, '--paper': pal.paper, '--ink': pal.ink, '--soft': pal.soft, '--deep': pal.deep,
  } as CSSProperties;

  const L = tpl.layout;
  const rows = ROW_STYLE[L];
  const visible = doc.sections.filter((s) => hasContent(doc, s));
  const blocks = (list: Section[], icons = false) => list.map((s) => <SectionBlock key={s.id} doc={doc} s={s} rows={rows} icons={icons} />);
  const name = personName(doc);
  const summary = summaryLine(doc);

  let inner: ReactNode;
  switch (L) {
    case 'arch':
      inner = (
        <>
          <FloralCorner className="orn-tl" />
          <FloralCorner className="orn-br" flip />
          <div className="bd-content" data-fit>
            {doc.topLine && <div className="bd-topline">{doc.topLine}</div>}
            <Photo doc={doc} shape="arch" />
            <Head doc={{ ...doc, topLine: '' }} center />
            <Divider />
            <div className="bd-flow">{blocks(visible)}</div>
          </div>
        </>
      );
      break;
    case 'mandala':
      inner = (
        <div className="bd-content" data-fit>
          {doc.topLine && <div className="bd-topline">{doc.topLine}</div>}
          <div className="bd-mandala-wrap">
            <Mandala className="bd-mandala-art" />
            {doc.photo && doc.showPhoto ? <Photo doc={doc} shape="circle" /> : <div className="bd-monogram">{name.slice(0, 1)}</div>}
          </div>
          <Head doc={{ ...doc, topLine: '' }} center />
          <Divider />
          <div className="bd-flow">{blocks(visible)}</div>
        </div>
      );
      break;
    case 'royal':
      inner = (
        <div className="bd-panel">
          <DecoCorner className="orn-c1" /><DecoCorner className="orn-c2" /><DecoCorner className="orn-c3" /><DecoCorner className="orn-c4" />
          <div className="bd-content" data-fit>
            <Head doc={doc} center />
            <Photo doc={doc} shape="circle" />
            <Divider />
            <div className="bd-flow">{blocks(visible)}</div>
          </div>
        </div>
      );
      break;
    case 'editorial':
      inner = (
        <div className="bd-split">
          <aside className="bd-side">
            {doc.photo && doc.showPhoto ? <Photo doc={doc} shape="cover" /> : <div className="bd-side-fill"><span>{name.slice(0, 1)}</span></div>}
            <div className="bd-side-caption">
              {doc.heading && <div className="bd-heading">{doc.heading}</div>}
              {name && <h1 className="bd-name">{name}</h1>}
            </div>
          </aside>
          <main className="bd-main" data-fit>
            {doc.topLine && <div className="bd-topline">{doc.topLine}</div>}
            {summary && <div className="bd-summary">{summary}</div>}
            {blocks(visible, true)}
          </main>
        </div>
      );
      break;
    case 'tiles':
      inner = (
        <>
          <div className="bd-band">
            <Head doc={doc} />
            <Photo doc={doc} shape="circle" />
          </div>
          <div className="bd-content" data-fit>
            <div className="bd-tilegrid">{blocks(visible, true)}</div>
          </div>
        </>
      );
      break;
    case 'floral':
      inner = (
        <>
          <FloralCorner className="orn-tr" />
          <FloralCorner className="orn-bl" flip />
          <div className="bd-content" data-fit>
            <div className="bd-headrow"><Head doc={doc} /><Photo doc={doc} shape="oval" /></div>
            <div className="bd-flow">{blocks(visible)}</div>
          </div>
        </>
      );
      break;
    case 'heritage':
      inner = (
        <>
          <div className="bd-frame" aria-hidden />
          <DecoCorner className="orn-c1" /><DecoCorner className="orn-c2" /><DecoCorner className="orn-c3" /><DecoCorner className="orn-c4" />
          <div className="bd-content" data-fit>
            <div className="bd-headrow"><Head doc={doc} /><Photo doc={doc} shape="rect" /></div>
            <Divider />
            {blocks(visible)}
          </div>
        </>
      );
      break;
    case 'resumeSide': {
      const sideKeys = ['personal', 'skills', 'hobbies'];
      const side = visible.filter((s) => s.key && sideKeys.includes(s.key));
      const main = visible.filter((s) => !side.includes(s));
      inner = (
        <div className="bd-split">
          <aside className="bd-side" data-fit>
            <Photo doc={doc} shape="circle" />
            {name && <h1 className="bd-name">{name}</h1>}
            {blocks(side)}
          </aside>
          <main className="bd-main" data-fit>
            {doc.heading && <div className="bd-heading">{doc.heading}</div>}
            {blocks(main, true)}
          </main>
        </div>
      );
      break;
    }
    default:
      inner = (
        <div className="bd-content" data-fit>
          <div className="bd-headrow"><Head doc={doc} /><Photo doc={doc} shape="rect" /></div>
          <div className={L === 'modern' ? 'bd-flow' : ''}>{blocks(visible, L === 'resume')}</div>
        </div>
      );
  }

  return (
    <div
      ref={(el) => { outer.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }}
      className={`bd-page bd-${L} bd-font-${tpl.font} lang-${doc.lang}`}
      style={style}
    >
      {inner}
      {watermark && (
        <div className="bd-watermark" aria-hidden>
          {[0, 1, 2].map((i) => <span key={i}>{PREVIEW_WORD[doc.lang]}</span>)}
        </div>
      )}
    </div>
  );
});

/** The 1080 × 1350 card that looks good inside a WhatsApp chat. */
export const WhatsAppCard = forwardRef<HTMLDivElement, Props>(function WhatsAppCard({ doc, watermark = false, showPhoto = true }, ref) {
  const tpl = templateById(doc.template);
  const pal = PALETTES[doc.color ?? tpl.palette] ?? PALETTES[tpl.palette];
  const style = { '--accent': pal.accent, '--accent2': pal.accent2, '--paper': pal.paper, '--ink': pal.ink, '--soft': pal.soft, '--deep': pal.deep } as CSSProperties;
  const keys = doc.purpose === 'marriage'
    ? ['dob', 'height', 'education', 'occupation', 'workCity', 'nativePlace']
    : ['dob', 'phone', 'email', 'address'];
  const facts = keys.map((k) => fieldValue(doc, k)).filter((f): f is NonNullable<typeof f> => !!f).map((f) => {
    let value = displayValue(f.key, f.value, doc.lang);
    if (f.key === 'dob' && doc.purpose === 'marriage') { const a = ageFromDob(f.value); if (a !== null) value = `${a} ${AGE_WORD[doc.lang]}`; }
    const label = f.key === 'dob' && doc.purpose === 'marriage' ? ({ en: 'Age', hi: 'आयु', mr: 'वय' } as const)[doc.lang] : fieldLabel(f.key, f.label, doc.lang);
    return { id: f.id, label, value };
  });
  if (doc.purpose !== 'marriage') {
    const edu = doc.sections.find((s) => s.key === 'education')?.body.split('\n')[0];
    if (edu) facts.unshift({ id: 'edu', label: ({ en: 'Education', hi: 'शिक्षा', mr: 'शिक्षण' } as const)[doc.lang], value: edu });
  }
  const photo = showPhoto && doc.showPhoto && doc.photo;
  const name = personName(doc);
  const footer = ({ en: 'Full biodata PDF attached', hi: 'पूरा बायोडाटा PDF साथ में', mr: 'संपूर्ण बायोडाटा PDF सोबत' } as const)[doc.lang];
  return (
    <div ref={ref} className={`wa-card bd-font-${tpl.font} lang-${doc.lang}`} style={style}>
      <FloralCorner className="wa-orn-tl" />
      <FloralCorner className="wa-orn-br" flip />
      <div className="wa-inner">
        {doc.topLine && <div className="wa-topline">{doc.topLine}</div>}
        {photo ? <div className="wa-photo"><img src={doc.photo!} alt="" /></div> : <div className="wa-monogram">{name.slice(0, 1) || '•'}</div>}
        {doc.heading && <div className="wa-heading">{doc.heading}</div>}
        <h1 className="wa-name">{name}</h1>
        <Divider className="wa-divider" />
        <div className="wa-facts">
          {facts.slice(0, 6).map((f) => (
            <div className="wa-fact" key={f.id}><span>{f.label}</span><strong>{f.value}</strong></div>
          ))}
        </div>
        <div className="wa-foot">{footer}</div>
      </div>
      {watermark && (
        <div className="bd-watermark" aria-hidden>
          {[0, 1, 2].map((i) => <span key={i}>{PREVIEW_WORD[doc.lang]}</span>)}
        </div>
      )}
    </div>
  );
});
