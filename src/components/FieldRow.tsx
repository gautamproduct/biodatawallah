import { useState } from 'react';
import { FIELDS, fieldLabel } from '../fields';
import type { Field, Lang } from '../types';
import { tr } from '../ui';
import { listen, voiceSupported } from '../voice';

export function MicButton({ lang, onText }: { lang: Lang; onText: (t: string) => void }) {
  const [on, setOn] = useState(false);
  if (!voiceSupported()) return null;
  return (
    <button
      type="button"
      className={`icon-btn mic ${on ? 'live' : ''}`}
      aria-label="Speak"
      title="Speak"
      onClick={() => { setOn(true); listen(lang, onText, () => setOn(false)); }}
    >🎤</button>
  );
}

interface Props {
  field: Field;
  lang: Lang;
  first: boolean;
  last: boolean;
  onChange: (f: Field) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}

export function FieldRow({ field, lang, first, last, onChange, onMove, onDelete }: Props) {
  const def = field.key ? FIELDS[field.key] : undefined;
  const label = fieldLabel(field.key, field.label, lang) || '—';
  const [menu, setMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draftLabel, setDraftLabel] = useState(label);
  const id = `f-${field.id}`;
  const set = (value: string) => onChange({ ...field, value });
  const type = def?.type ?? (field.value.length > 60 ? 'textarea' : 'text');

  let input;
  if (type === 'select' && def?.options) {
    input = (
      <select id={id} value={field.value} onChange={(e) => set(e.target.value)}>
        <option value="">{tr(lang, 'select')}</option>
        {def.options.map((o) => <option key={o.value} value={o.value}>{o.label[lang]}</option>)}
      </select>
    );
  } else if (type === 'textarea') {
    input = <textarea id={id} rows={2} value={field.value} onChange={(e) => set(e.target.value)} />;
  } else {
    input = (
      <input
        id={id}
        type={type === 'tel' ? 'tel' : type === 'date' ? 'date' : type === 'time' ? 'time' : 'text'}
        inputMode={type === 'tel' ? 'tel' : undefined}
        value={field.value}
        placeholder={def?.placeholder?.[lang] ?? ''}
        onChange={(e) => set(e.target.value)}
      />
    );
  }
  const voice = type === 'text' || type === 'textarea';

  return (
    <div className={`field ${field.hidden ? 'is-hidden' : ''}`}>
      <div className="field-head">
        {renaming ? (
          <form className="rename" onSubmit={(e) => { e.preventDefault(); onChange({ ...field, label: draftLabel.trim() || undefined }); setRenaming(false); }}>
            <input autoFocus value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} aria-label={tr(lang, 'rename')} />
            <button className="btn btn-small" type="submit">{tr(lang, 'ok')}</button>
          </form>
        ) : (
          <label htmlFor={id}>{label}</label>
        )}
        <div className="field-tools">
          <button
            type="button"
            className="icon-btn"
            aria-label={field.hidden ? tr(lang, 'showOnBio') : tr(lang, 'hideOnBio')}
            title={field.hidden ? tr(lang, 'showOnBio') : tr(lang, 'hideOnBio')}
            onClick={() => onChange({ ...field, hidden: !field.hidden })}
          >{field.hidden ? '🙈' : '👁️'}</button>
          <div className="menu-wrap">
            <button type="button" className="icon-btn" aria-label={tr(lang, 'more')} aria-expanded={menu} onClick={() => setMenu(!menu)}>⋯</button>
            {menu && (
              <div className="menu" onMouseLeave={() => setMenu(false)}>
                <button onClick={() => { setRenaming(true); setDraftLabel(label); setMenu(false); }}>✎ {tr(lang, 'rename')}</button>
                {!first && <button onClick={() => { onMove(-1); setMenu(false); }}>↑ {tr(lang, 'moveUp')}</button>}
                {!last && <button onClick={() => { onMove(1); setMenu(false); }}>↓ {tr(lang, 'moveDown')}</button>}
                <button className="danger" onClick={() => { onDelete(); setMenu(false); }}>🗑 {tr(lang, 'remove')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="field-input">
        {input}
        {voice && <MicButton lang={lang} onText={(t) => set(field.value ? `${field.value} ${t}` : t)} />}
      </div>
      {field.hidden && <div className="hint">{def?.sensitive ? tr(lang, 'sensitiveNote') : tr(lang, 'hiddenTag')}</div>}
    </div>
  );
}
