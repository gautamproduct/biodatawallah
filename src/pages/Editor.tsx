import { useRef, useState } from 'react';
import { FieldRow, MicButton } from '../components/FieldRow';
import { TopBar } from '../components/Header';
import { Scaled } from '../components/Scaled';
import { readPhoto } from '../export';
import { go } from '../nav';
import { uid } from '../presets';
import { Biodata, PAGE_H, PAGE_W, personName, sectionTitle } from '../templates/Biodata';
import { COLOR_CHOICES, PALETTES, suggestions, TEMPLATES, templateById } from '../templates/catalog';
import type { Doc, Field, Section, SectionKind } from '../types';
import { tr } from '../ui';
import { TRAITS, traitLabel, writeFor } from '../writer';

const WRITABLE = ['about', 'expectations', 'objective', 'declaration'];

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function Editor({ doc, step, onChange }: { doc: Doc; step: number; onChange: (d: Doc) => void }) {
  const L = doc.lang;
  const total = doc.sections.length + 2; // + photo + design
  const s = Math.min(step, total - 1);
  const goStep = (n: number) => (n >= total ? go(`preview/${doc.id}`) : go(`edit/${doc.id}/${Math.max(0, n)}`));

  let body;
  if (s < doc.sections.length) {
    body = <SectionStep key={doc.sections[s].id} doc={doc} index={s} onChange={onChange} onGoStep={goStep} />;
  } else if (s === doc.sections.length) {
    body = <PhotoStep doc={doc} onChange={onChange} />;
  } else {
    body = <DesignStep doc={doc} onChange={onChange} />;
  }

  const stepTitle = s < doc.sections.length ? sectionTitle(doc, doc.sections[s]) : s === doc.sections.length ? tr(L, 'photoStep') : tr(L, 'designStep');

  return (
    <div className="page editor">
      <TopBar>
        <span className="saved">✓ {tr(L, 'saved')}</span>
        <button className="btn btn-small" onClick={() => go(`preview/${doc.id}`)}>👁 {tr(L, 'seePreview')}</button>
      </TopBar>
      <div className="editor-grid">
        <div className="editor-form">
          <div className="progress" aria-hidden><div style={{ width: `${((s + 1) / total) * 100}%` }} /></div>
          <div className="step-meta">{tr(L, 'step')} {s + 1} {tr(L, 'of')} {total}</div>
          <nav className="step-dots" aria-label="Steps">
            {Array.from({ length: total }, (_, i) => (
              <button key={i} className={i === s ? 'on' : ''} onClick={() => goStep(i)} aria-label={`${tr(L, 'step')} ${i + 1}`} aria-current={i === s} />
            ))}
          </nav>
          <h1 className="step-title">{stepTitle}</h1>
          {body}
          <div className="step-nav">
            <button className="btn btn-ghost" disabled={s === 0} onClick={() => goStep(s - 1)}>← {tr(L, 'back')}</button>
            <button className="btn btn-primary" onClick={() => goStep(s + 1)}>
              {s === total - 1 ? `${tr(L, 'seePreview')} →` : `${tr(L, 'next')} →`}
            </button>
          </div>
        </div>
        <aside className="editor-preview" aria-label="Live preview">
          <div className="sticky">
            <Scaled width={PAGE_W} height={PAGE_H}><Biodata doc={doc} watermark /></Scaled>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionStep({ doc, index, onChange, onGoStep }: { doc: Doc; index: number; onChange: (d: Doc) => void; onGoStep: (n: number) => void }) {
  const L = doc.lang;
  const sec = doc.sections[index];
  const [menu, setMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(sectionTitle(doc, sec));
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [addingSec, setAddingSec] = useState(false);
  const [secTitle, setSecTitle] = useState('');
  const [secKind, setSecKind] = useState<SectionKind>('fields');

  const setSec = (next: Section) => onChange({ ...doc, sections: doc.sections.map((x) => (x.id === sec.id ? next : x)) });
  const setField = (f: Field) => setSec({ ...sec, fields: sec.fields.map((x) => (x.id === f.id ? f : x)) });

  const write = (variantBump: boolean) => {
    const d = variantBump ? { ...doc, writerVariant: doc.writerVariant + 1 } : doc;
    const text = sec.key ? writeFor(d, sec.key) : null;
    if (text === null) return;
    onChange({ ...d, sections: d.sections.map((x) => (x.id === sec.id ? { ...x, body: text } : x)) });
  };

  const name = personName(doc).split(/\s+/)[0] || (doc.gender === 'female' ? tr(L, 'girl') : tr(L, 'boy'));

  return (
    <div className="section-step">
      <div className="section-tools">
        {renaming ? (
          <form className="rename" onSubmit={(e) => { e.preventDefault(); setSec({ ...sec, title: title.trim() || undefined }); setRenaming(false); }}>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} aria-label={tr(L, 'sectionTitleEdit')} />
            <button className="btn btn-small" type="submit">{tr(L, 'ok')}</button>
          </form>
        ) : <span />}
        <div className="menu-wrap">
          <button className="btn btn-small btn-ghost" onClick={() => setMenu(!menu)} aria-expanded={menu}>⋯ {tr(L, 'more')}</button>
          {menu && (
            <div className="menu menu-right" onMouseLeave={() => setMenu(false)}>
              <button onClick={() => { setRenaming(true); setMenu(false); }}>✎ {tr(L, 'rename')}</button>
              <button onClick={() => { setSec({ ...sec, hidden: !sec.hidden }); setMenu(false); }}>{sec.hidden ? '👁️ ' + tr(L, 'showSection') : '🙈 ' + tr(L, 'hideSection')}</button>
              {index > 0 && <button onClick={() => { onChange({ ...doc, sections: move(doc.sections, index, -1) }); onGoStep(index - 1); setMenu(false); }}>↑ {tr(L, 'moveUp')}</button>}
              {index < doc.sections.length - 1 && <button onClick={() => { onChange({ ...doc, sections: move(doc.sections, index, 1) }); onGoStep(index + 1); setMenu(false); }}>↓ {tr(L, 'moveDown')}</button>}
              <button className="danger" onClick={() => {
                if (!confirm(tr(L, 'deleteSectionQ'))) return;
                onChange({ ...doc, sections: doc.sections.filter((x) => x.id !== sec.id) });
                setMenu(false);
                onGoStep(Math.min(index, doc.sections.length - 2));
              }}>🗑 {tr(L, 'remove')}</button>
            </div>
          )}
        </div>
      </div>

      {sec.hidden && <div className="notice">{tr(L, 'sectionHidden')}</div>}

      {sec.kind === 'fields' && (
        <>
          {sec.fields.map((f, i) => (
            <FieldRow
              key={f.id}
              field={f}
              lang={L}
              first={i === 0}
              last={i === sec.fields.length - 1}
              onChange={setField}
              onMove={(dir) => setSec({ ...sec, fields: move(sec.fields, i, dir) })}
              onDelete={() => setSec({ ...sec, fields: sec.fields.filter((x) => x.id !== f.id) })}
            />
          ))}
          {adding ? (
            <form className="add-form" onSubmit={(e) => {
              e.preventDefault();
              if (!newLabel.trim()) return;
              setSec({ ...sec, fields: [...sec.fields, { id: uid(), key: null, label: newLabel.trim(), value: newValue, hidden: false }] });
              setNewLabel(''); setNewValue(''); setAdding(false);
            }}>
              <input autoFocus placeholder={tr(L, 'newFieldLabel')} value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
              <input placeholder="…" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
              <div className="row-btns">
                <button className="btn btn-primary btn-small" type="submit">{tr(L, 'add')}</button>
                <button className="btn btn-ghost btn-small" type="button" onClick={() => setAdding(false)}>{tr(L, 'cancel')}</button>
              </div>
            </form>
          ) : (
            <button className="btn btn-dashed" onClick={() => setAdding(true)}>{tr(L, 'addField')}</button>
          )}
          <p className="hint">{tr(L, 'typingTip')}</p>
        </>
      )}

      {sec.kind !== 'fields' && (
        <>
          {sec.key === 'about' && (
            <div className="writer-box">
              <div className="writer-q">{tr(L, 'traitsQ', { name })}</div>
              <div className="chips">
                {TRAITS.map((t) => {
                  const on = doc.traits.includes(t.key);
                  return (
                    <button key={t.key} className={`chip chip-small ${on ? 'on' : ''}`} aria-pressed={on}
                      onClick={() => onChange({ ...doc, traits: on ? doc.traits.filter((k) => k !== t.key) : [...doc.traits, t.key].slice(-4) })}>
                      {traitLabel(t, L, doc.gender)}
                    </button>
                  );
                })}
              </div>
              <label className="writer-q" htmlFor="hobbies">{tr(L, 'hobbiesQ')}</label>
              <div className="field-input">
                <input id="hobbies" value={doc.hobbies} placeholder={tr(L, 'hobbiesPh')} onChange={(e) => onChange({ ...doc, hobbies: e.target.value })} />
                <MicButton lang={L} onText={(t) => onChange({ ...doc, hobbies: doc.hobbies ? `${doc.hobbies}, ${t}` : t })} />
              </div>
            </div>
          )}
          {sec.key && WRITABLE.includes(sec.key) && (
            <div className="row-btns">
              <button className="btn btn-accent" onClick={() => write(false)}>{tr(L, 'writeForMe')}</button>
              {sec.body && <button className="btn btn-ghost" onClick={() => write(true)}>{tr(L, 'writeAgain')}</button>}
            </div>
          )}
          {sec.key && WRITABLE.includes(sec.key) && sec.body && <p className="hint">{tr(L, 'writerNote')}</p>}
          <div className="field-input">
            <textarea
              rows={sec.kind === 'list' ? 6 : 7}
              value={sec.body}
              placeholder={sec.kind === 'list' ? tr(L, 'listHint') : ''}
              onChange={(e) => setSec({ ...sec, body: e.target.value })}
              aria-label={sectionTitle(doc, sec)}
            />
            <MicButton lang={L} onText={(t) => setSec({ ...sec, body: sec.body ? `${sec.body}${sec.kind === 'list' ? '\n' : ' '}${t}` : t })} />
          </div>
          {sec.kind === 'list' && <p className="hint">{tr(L, 'listHint')}</p>}
        </>
      )}

      {addingSec ? (
        <form className="add-form" onSubmit={(e) => {
          e.preventDefault();
          if (!secTitle.trim()) return;
          const ns: Section = { id: uid(), key: null, title: secTitle.trim(), kind: secKind, fields: [], body: '', hidden: false };
          const sections = doc.sections.slice();
          sections.splice(index + 1, 0, ns);
          onChange({ ...doc, sections });
          setAddingSec(false); setSecTitle('');
          onGoStep(index + 1);
        }}>
          <input autoFocus placeholder={tr(L, 'newSectionTitle')} value={secTitle} onChange={(e) => setSecTitle(e.target.value)} />
          <div className="chips">
            {(['fields', 'text', 'list'] as SectionKind[]).map((k) => (
              <button type="button" key={k} className={`chip chip-small ${secKind === k ? 'on' : ''}`} onClick={() => setSecKind(k)}>
                {tr(L, k === 'fields' ? 'sectionTypeFields' : k === 'text' ? 'sectionTypeText' : 'sectionTypeList')}
              </button>
            ))}
          </div>
          <div className="row-btns">
            <button className="btn btn-primary btn-small" type="submit">{tr(L, 'add')}</button>
            <button className="btn btn-ghost btn-small" type="button" onClick={() => setAddingSec(false)}>{tr(L, 'cancel')}</button>
          </div>
        </form>
      ) : (
        <button className="btn btn-dashed subtle" onClick={() => setAddingSec(true)}>{tr(L, 'addSection')}</button>
      )}
    </div>
  );
}

function PhotoStep({ doc, onChange }: { doc: Doc; onChange: (d: Doc) => void }) {
  const L = doc.lang;
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="photo-step">
      <p className="notice good">🛡️ {tr(L, 'photoSafe')}</p>
      <div className="photo-box">
        {doc.photo ? <img src={doc.photo} alt="" /> : <div className="photo-empty">📷</div>}
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const photo = await readPhoto(f);
        onChange({ ...doc, photo, showPhoto: true });
        e.target.value = '';
      }} />
      <div className="row-btns">
        <button className="btn btn-primary" onClick={() => input.current?.click()}>{doc.photo ? tr(L, 'photoChange') : tr(L, 'photoAdd')}</button>
        {doc.photo && <button className="btn btn-ghost" onClick={() => onChange({ ...doc, photo: null })}>{tr(L, 'photoRemove')}</button>}
      </div>
      {doc.photo && (
        <label className="consent">
          <input type="checkbox" checked={doc.showPhoto} onChange={(e) => onChange({ ...doc, showPhoto: e.target.checked })} />
          <span>{tr(L, 'photoShow')}</span>
        </label>
      )}
      <p className="hint">{tr(L, 'photoTip')}</p>
    </div>
  );
}

function DesignStep({ doc, onChange }: { doc: Doc; onChange: (d: Doc) => void }) {
  const L = doc.lang;
  const [all, setAll] = useState(false);
  const picks = suggestions(doc.purpose, doc.community);
  const rest = TEMPLATES.filter((t) => !picks.some((p) => p.id === t.id) && t.purposes.includes(doc.purpose));
  const others = TEMPLATES.filter((t) => !t.purposes.includes(doc.purpose));
  const list = all ? [...picks, ...rest, ...others] : picks;
  const current = templateById(doc.template);

  return (
    <div className="design-step">
      <p className="hint">{tr(L, 'designHint')}</p>
      <div className="design-grid">
        {list.map((t, i) => (
          <button key={t.id} className={`design ${doc.template === t.id ? 'on' : ''}`} onClick={() => onChange({ ...doc, template: t.id, color: null })} aria-pressed={doc.template === t.id}>
            <Scaled width={PAGE_W} height={PAGE_H}><Biodata doc={{ ...doc, template: t.id, color: null }} /></Scaled>
            <span className="design-name">{L === 'en' ? t.name : t.nameHi}{i === 0 && !all && <em className="badge">{tr(L, 'recommended')}</em>}</span>
          </button>
        ))}
      </div>
      <button className="btn btn-ghost btn-block" onClick={() => setAll(!all)}>{all ? tr(L, 'fewerDesigns') : `${tr(L, 'allDesigns')} (${TEMPLATES.length})`}</button>

      <div className="writer-q">{tr(L, 'colour')}</div>
      <div className="swatches">
        {COLOR_CHOICES.map((c) => {
          const on = (doc.color ?? current.palette) === c;
          return <button key={c} className={`swatch ${on ? 'on' : ''}`} style={{ background: PALETTES[c].accent }} aria-label={PALETTES[c].name} aria-pressed={on} onClick={() => onChange({ ...doc, color: c })} />;
        })}
      </div>

      <div className="field">
        <div className="field-head"><label htmlFor="topline">{tr(L, 'topLine')}</label></div>
        <div className="field-input"><input id="topline" value={doc.topLine} onChange={(e) => onChange({ ...doc, topLine: e.target.value })} /></div>
      </div>
      <div className="field">
        <div className="field-head"><label htmlFor="heading">{tr(L, 'headingLabel')}</label></div>
        <div className="field-input"><input id="heading" value={doc.heading} onChange={(e) => onChange({ ...doc, heading: e.target.value })} /></div>
      </div>
    </div>
  );
}
