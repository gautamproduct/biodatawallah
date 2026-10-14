import { Icon } from '../components/Icon';
import { useRef, useState } from 'react';
import { refreshAuto, reshape } from '../autotext';
import { FieldRow, MicButton } from '../components/FieldRow';
import { TopBar } from '../components/Header';
import { Scaled } from '../components/Scaled';
import { readPhoto } from '../export';
import { go } from '../nav';
import { COMMUNITIES, uid } from '../presets';
import { Biodata, PAGE_H, PAGE_W, sectionTitle } from '../templates/Biodata';
import { COLOR_CHOICES, PALETTES, suggestions, TEMPLATES, templateById } from '../templates/catalog';
import type { Community, Doc, Field, Purpose, Section, SectionKind } from '../types';
import { tr } from '../ui';
import { TRAITS, traitLabel } from '../writer';

/** The only questions shown up front. Everything else is optional and folded away. */
const ESSENTIAL: Record<Purpose, string[]> = {
  marriage: ['fullName', 'dob', 'height', 'education', 'occupation', 'workCity', 'fatherName', 'fatherOcc', 'motherName', 'phone'],
  job: ['fullName', 'fatherName', 'dob', 'phone', 'email', 'address'],
  general: ['fullName', 'fatherName', 'dob', 'phone', 'address'],
};
/** List sections that belong in "Basic details" for job and general biodata. */
const ESSENTIAL_LISTS: Record<Purpose, string[]> = { marriage: [], job: ['education', 'skills'], general: ['education'] };

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function Editor({ doc, onChange: rawChange }: { doc: Doc; onChange: (d: Doc) => void }) {
  const L = doc.lang;
  const onChange = (d: Doc) => rawChange(refreshAuto(d));
  const essentials = ESSENTIAL[doc.purpose];

  const setField = (f: Field) => onChange({
    ...doc,
    sections: doc.sections.map((s) => ({ ...s, fields: s.fields.map((x) => (x.id === f.id ? f : x)) })),
  });
  const setSection = (sec: Section) => onChange({ ...doc, sections: doc.sections.map((s) => (s.id === sec.id ? sec : s)) });

  // Basic details, in the order of ESSENTIAL.
  const all = doc.sections.flatMap((s) => s.fields);
  const basic = essentials.map((k) => all.find((f) => f.key === k)).filter((f): f is Field => !!f);
  const basicLists = doc.sections.filter((s) => s.key && ESSENTIAL_LISTS[doc.purpose].includes(s.key));

  const optionalSections = doc.sections.filter((s) => !basicLists.includes(s));

  return (
    <div className="page editor">
      <TopBar>
        <span className="saved"><Icon name="check" size={16} />{tr(L, 'saved')}</span>
      </TopBar>
      <div className="editor-grid">
        <div className="editor-form">
          <h1 className="builder-title">{doc.heading}</h1>

          <div className="quick-chips">
            <div className="chips chips-row">
              {(['female', 'male'] as const).map((g) => (
                <button key={g} className={`chip chip-small ${doc.gender === g ? 'on' : ''}`} aria-pressed={doc.gender === g}
                  onClick={() => onChange(reshape(doc, doc.community, g))}>
                  {g === 'female' ? tr(L, 'girl') : tr(L, 'boy')}
                </button>
              ))}
            </div>
            {doc.purpose === 'marriage' && (
              <label className="inline-select">
                <span>{tr(L, 'qCommunity')}</span>
                <select value={doc.community} onChange={(e) => onChange(reshape(doc, e.target.value as Community, doc.gender))}>
                  {COMMUNITIES.map((c) => <option key={c.value} value={c.value}>{c.label[L]}</option>)}
                </select>
              </label>
            )}
          </div>

          <section className="card card-open">
            <h2 className="card-title">{tr(L, 'basicTitle')}</h2>
            <PhotoInline doc={doc} onChange={onChange} />
            {basic.map((f) => (
              <FieldRow key={f.id} field={f} lang={L} first last onChange={setField} onMove={() => {}} onDelete={() => setField({ ...f, value: '', hidden: true })} />
            ))}
            {basicLists.map((s) => <TextOrList key={s.id} doc={doc} sec={s} onSection={setSection} />)}
          </section>

          <p className="optional-head">{tr(L, 'optionalHead')}</p>

          {optionalSections.map((s) => (
            <OptionalCard key={s.id} doc={doc} sec={s} essentials={essentials} onChange={onChange} onSection={setSection} onField={setField} />
          ))}

          <DesignCard doc={doc} onChange={onChange} />
          <AddSection doc={doc} onChange={onChange} />
          <p className="hint center">{tr(L, 'typingTip')}</p>

          <div className="builder-bar">
            <button className="btn btn-primary btn-lg btn-block" onClick={() => go(`preview/${doc.id}`)}>{tr(L, 'previewCta')} <Icon name="arrow" /></button>
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

function filledCount(sec: Section, essentials: string[]) {
  if (sec.kind !== 'fields') return sec.body.trim() ? 1 : 0;
  return sec.fields.filter((f) => !(f.key && essentials.includes(f.key)) && f.value.trim()).length;
}

function OptionalCard({ doc, sec, essentials, onChange, onSection, onField }: {
  doc: Doc; sec: Section; essentials: string[];
  onChange: (d: Doc) => void; onSection: (s: Section) => void; onField: (f: Field) => void;
}) {
  const L = doc.lang;
  const rest = sec.fields.filter((f) => !(f.key && essentials.includes(f.key)));
  const isAuto = sec.kind === 'text' && !!sec.key && doc.auto?.[sec.key] === sec.body && !!sec.body;
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(sectionTitle(doc, sec));
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  if (sec.kind === 'fields' && rest.length === 0 && sec.key) return null;
  const count = filledCount(sec, essentials);
  const index = doc.sections.findIndex((s) => s.id === sec.id);

  return (
    <section className={`card ${open ? 'card-open' : ''} ${sec.hidden ? 'card-hidden' : ''}`}>
      <div className="card-head">
        {renaming ? (
          <form className="rename" onSubmit={(e) => { e.preventDefault(); onSection({ ...sec, title: title.trim() || undefined }); setRenaming(false); }}>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} aria-label={tr(L, 'sectionTitleEdit')} />
            <button className="btn btn-small" type="submit">{tr(L, 'ok')}</button>
          </form>
        ) : (
          <button className="card-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
            <span className="card-plus" aria-hidden><Icon name={open ? 'minus' : 'plus'} size={16} /></span>
            <span className="card-name">{sectionTitle(doc, sec)}</span>
            {isAuto && <span className="tag good"><Icon name="sparkle" size={14} />{tr(L, 'autoWritten')}</span>}
            {!isAuto && count > 0 && <span className="tag"><Icon name="check" size={14} />{count}</span>}
            {sec.hidden && <span className="tag"><Icon name="eyeOff" size={14} /></span>}
          </button>
        )}
        <div className="menu-wrap">
          <button className="icon-btn subtle" onClick={() => setMenu(!menu)} aria-label={tr(L, 'more')} aria-expanded={menu}><Icon name="more" className="dots" /></button>
          {menu && (
            <div className="menu" onMouseLeave={() => setMenu(false)}>
              <button onClick={() => { onSection({ ...sec, hidden: !sec.hidden }); setMenu(false); }}>{sec.hidden ? <><Icon name="eye" size={18} />{tr(L, 'showSection')}</> : <><Icon name="eyeOff" size={18} />{tr(L, 'hideSection')}</>}</button>
              <button onClick={() => { setRenaming(true); setMenu(false); }}><Icon name="edit" size={18} />{tr(L, 'rename')}</button>
              {index > 0 && <button onClick={() => { onChange({ ...doc, sections: move(doc.sections, index, -1) }); setMenu(false); }}><Icon name="up" size={18} />{tr(L, 'moveUp')}</button>}
              {index < doc.sections.length - 1 && <button onClick={() => { onChange({ ...doc, sections: move(doc.sections, index, 1) }); setMenu(false); }}><Icon name="down" size={18} />{tr(L, 'moveDown')}</button>}
              <button className="danger" onClick={() => { if (confirm(tr(L, 'deleteSectionQ'))) onChange({ ...doc, sections: doc.sections.filter((x) => x.id !== sec.id) }); setMenu(false); }}><Icon name="trash" size={18} />{tr(L, 'remove')}</button>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="card-body">
          {sec.kind === 'fields' && (
            <>
              {rest.map((f, i) => (
                <FieldRow
                  key={f.id} field={f} lang={L} first={i === 0} last={i === rest.length - 1}
                  onChange={onField}
                  onMove={(dir) => {
                    const ids = rest.map((x) => x.id);
                    const a = sec.fields.findIndex((x) => x.id === ids[i]);
                    const b = sec.fields.findIndex((x) => x.id === ids[i + dir]);
                    if (a < 0 || b < 0) return;
                    const next = sec.fields.slice();
                    [next[a], next[b]] = [next[b], next[a]];
                    onSection({ ...sec, fields: next });
                  }}
                  onDelete={() => onSection({ ...sec, fields: sec.fields.filter((x) => x.id !== f.id) })}
                />
              ))}
              {adding ? (
                <form className="add-form" onSubmit={(e) => {
                  e.preventDefault();
                  if (!newLabel.trim()) return;
                  onSection({ ...sec, fields: [...sec.fields, { id: uid(), key: null, label: newLabel.trim(), value: newValue, hidden: false }] });
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
            </>
          )}
          {sec.kind !== 'fields' && <TextOrList doc={doc} sec={sec} onSection={onSection} onDoc={onChange} />}
        </div>
      )}
    </section>
  );
}

function TextOrList({ doc, sec, onSection, onDoc }: { doc: Doc; sec: Section; onSection: (s: Section) => void; onDoc?: (d: Doc) => void }) {
  const L = doc.lang;
  const [words, setWords] = useState(false);
  const auto = !!sec.key && ['about', 'expectations', 'objective', 'declaration'].includes(sec.key);
  const rewrite = () => {
    if (!onDoc || !sec.key) return;
    // Clearing the body lets refreshAuto write a fresh variant.
    onDoc({ ...doc, writerVariant: doc.writerVariant + 1, sections: doc.sections.map((s) => (s.id === sec.id ? { ...s, body: '' } : s)) });
  };
  return (
    <div className="text-block">
      {sec.kind === 'list' && <label className="field-label">{sectionTitle(doc, sec)}</label>}
      <div className="field-input">
        <textarea
          rows={sec.kind === 'list' ? 4 : 5}
          value={sec.body}
          placeholder={sec.kind === 'list' ? tr(L, 'listHint') : ''}
          onChange={(e) => onSection({ ...sec, body: e.target.value })}
          aria-label={sectionTitle(doc, sec)}
        />
        <MicButton lang={L} onText={(t) => onSection({ ...sec, body: sec.body ? `${sec.body}${sec.kind === 'list' ? '\n' : ' '}${t}` : t })} />
      </div>
      {sec.kind === 'list' && <p className="hint">{tr(L, 'listHint')}</p>}
      {auto && onDoc && (
        <div className="row-btns">
          <button className="btn btn-small btn-ghost" onClick={rewrite}><Icon name="undo" size={16} />{tr(L, 'writeAgain')}</button>
          {sec.key === 'about' && <button className="btn btn-small btn-ghost" onClick={() => setWords(!words)}><Icon name="sparkle" size={16} />{tr(L, 'changeWords')}</button>}
        </div>
      )}
      {sec.key === 'about' && words && onDoc && (
        <div className="writer-box">
          <div className="chips">
            {TRAITS.map((t) => {
              const on = doc.traits.includes(t.key);
              return (
                <button key={t.key} className={`chip chip-small ${on ? 'on' : ''}`} aria-pressed={on}
                  onClick={() => onDoc({ ...doc, traits: on ? doc.traits.filter((k) => k !== t.key) : [...doc.traits, t.key].slice(-4), sections: doc.sections.map((s) => (s.id === sec.id && doc.auto?.about === s.body ? { ...s, body: '' } : s)) })}>
                  {traitLabel(t, L, doc.gender)}
                </button>
              );
            })}
          </div>
          <div className="field-input">
            <input value={doc.hobbies} placeholder={tr(L, 'hobbiesPh')} aria-label={tr(L, 'hobbiesQ')}
              onChange={(e) => onDoc({ ...doc, hobbies: e.target.value, sections: doc.sections.map((s) => (s.id === sec.id && doc.auto?.about === s.body ? { ...s, body: '' } : s)) })} />
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoInline({ doc, onChange }: { doc: Doc; onChange: (d: Doc) => void }) {
  const L = doc.lang;
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="photo-inline">
      <button className="photo-thumb" onClick={() => input.current?.click()} aria-label={doc.photo ? tr(L, 'photoChange') : tr(L, 'photoAdd')}>
        {doc.photo ? <img src={doc.photo} alt="" /> : <Icon name="camera" size={26} />}
      </button>
      <div>
        <button className="btn btn-small btn-quiet" onClick={() => input.current?.click()}>{doc.photo ? tr(L, 'photoChange') : tr(L, 'photoAdd')}</button>
        {doc.photo && <button className="linkish" onClick={() => onChange({ ...doc, photo: null })}>{tr(L, 'photoRemove')}</button>}
        <p className="hint">{tr(L, 'photoSafe')}</p>
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        onChange({ ...doc, photo: await readPhoto(f), showPhoto: true });
        e.target.value = '';
      }} />
    </div>
  );
}

function DesignCard({ doc, onChange }: { doc: Doc; onChange: (d: Doc) => void }) {
  const L = doc.lang;
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState(false);
  const current = templateById(doc.template);
  const picks = suggestions(doc.purpose, doc.community);
  if (!picks.some((p) => p.id === current.id)) picks[picks.length - 1] = current;
  const list = all ? TEMPLATES : picks;
  return (
    <section className={`card ${open ? 'card-open' : ''}`}>
      <div className="card-head">
        <button className="card-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span className="card-plus" aria-hidden><Icon name={open ? 'minus' : 'plus'} size={16} /></span>
          <span className="card-name">{tr(L, 'designStep')}</span>
          <span className="tag">{L === 'en' ? current.name : current.nameHi}</span>
        </button>
      </div>
      {open && (
        <div className="card-body">
          <div className="design-grid">
            {list.map((t) => (
              <button key={t.id} className={`design ${doc.template === t.id ? 'on' : ''}`} onClick={() => onChange({ ...doc, template: t.id, color: null })} aria-pressed={doc.template === t.id}>
                <Scaled width={PAGE_W} height={PAGE_H}><Biodata doc={{ ...doc, template: t.id, color: null }} /></Scaled>
                <span className="design-name">{L === 'en' ? t.name : t.nameHi}</span>
              </button>
            ))}
          </div>
          <button className="linkish" onClick={() => setAll(!all)}>{all ? tr(L, 'fewerDesigns') : `${tr(L, 'allDesigns')} (${TEMPLATES.length})`}</button>
          <div className="swatches">
            {COLOR_CHOICES.map((c) => {
              const on = (doc.color ?? current.palette) === c;
              return <button key={c} className={`swatch ${on ? 'on' : ''}`} style={{ background: PALETTES[c].accent }} aria-label={PALETTES[c].name} aria-pressed={on} onClick={() => onChange({ ...doc, color: c })} />;
            })}
          </div>
          <label className="field-label" htmlFor="topline">{tr(L, 'topLine')}</label>
          <div className="field-input"><input id="topline" value={doc.topLine} onChange={(e) => onChange({ ...doc, topLine: e.target.value })} /></div>
          <label className="field-label" htmlFor="heading">{tr(L, 'headingLabel')}</label>
          <div className="field-input"><input id="heading" value={doc.heading} onChange={(e) => onChange({ ...doc, heading: e.target.value })} /></div>
        </div>
      )}
    </section>
  );
}

function AddSection({ doc, onChange }: { doc: Doc; onChange: (d: Doc) => void }) {
  const L = doc.lang;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<SectionKind>('fields');
  if (!open) return <button className="btn btn-dashed subtle" onClick={() => setOpen(true)}>{tr(L, 'addSection')}</button>;
  return (
    <form className="add-form" onSubmit={(e) => {
      e.preventDefault();
      if (!title.trim()) return;
      const s: Section = { id: uid(), key: null, title: title.trim(), kind, fields: [], body: '', hidden: false };
      onChange({ ...doc, sections: [...doc.sections, s] });
      setOpen(false); setTitle('');
    }}>
      <input autoFocus placeholder={tr(L, 'newSectionTitle')} value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="chips">
        {(['fields', 'text', 'list'] as SectionKind[]).map((k) => (
          <button type="button" key={k} className={`chip chip-small ${kind === k ? 'on' : ''}`} onClick={() => setKind(k)}>
            {tr(L, k === 'fields' ? 'sectionTypeFields' : k === 'text' ? 'sectionTypeText' : 'sectionTypeList')}
          </button>
        ))}
      </div>
      <div className="row-btns">
        <button className="btn btn-primary btn-small" type="submit">{tr(L, 'add')}</button>
        <button className="btn btn-ghost btn-small" type="button" onClick={() => setOpen(false)}>{tr(L, 'cancel')}</button>
      </div>
    </form>
  );
}
