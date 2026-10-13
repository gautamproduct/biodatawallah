import { useState } from 'react';
import { LangSwitch, TopBar } from '../components/Header';
import { COMMUNITIES, newDoc } from '../presets';
import type { Community, Doc, Gender, Lang, Purpose } from '../types';
import { LANG_NAMES, tr } from '../ui';

const PURPOSES: Purpose[] = ['marriage', 'job', 'general'];
const PURPOSE_KEY = { marriage: 'forMarriage', job: 'forJob', general: 'forGeneral' } as const;

export function Start({ lang, initialPurpose, onLang, onCreate }: {
  lang: Lang; initialPurpose: string; onLang: (l: Lang) => void; onCreate: (d: Doc) => void;
}) {
  const [purpose, setPurpose] = useState<Purpose>(PURPOSES.includes(initialPurpose as Purpose) ? (initialPurpose as Purpose) : 'marriage');
  const [docLang, setDocLang] = useState<Lang>(lang);
  const [community, setCommunity] = useState<Community>('hindu');
  const [gender, setGender] = useState<Gender>('female');
  const [consent, setConsent] = useState(false);
  // The questions follow the biodata language the family picks.
  const L = docLang;

  return (
    <div className="page narrow">
      <TopBar><LangSwitch lang={lang} onLang={(l) => { onLang(l); setDocLang(l); }} /></TopBar>
      <h1 className="page-title">{tr(L, 'startTitle')}</h1>

      <fieldset className="choice">
        <legend>{tr(L, 'qPurpose')}</legend>
        <div className="chips">
          {PURPOSES.map((p) => (
            <button key={p} className={`chip ${purpose === p ? 'on' : ''}`} onClick={() => setPurpose(p)} aria-pressed={purpose === p}>
              {tr(L, PURPOSE_KEY[p])}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="choice">
        <legend>{tr(L, 'qLang')}</legend>
        <div className="chips">
          {(['hi', 'mr', 'en'] as Lang[]).map((l) => (
            <button key={l} className={`chip ${docLang === l ? 'on' : ''}`} onClick={() => setDocLang(l)} aria-pressed={docLang === l}>{LANG_NAMES[l]}</button>
          ))}
        </div>
      </fieldset>

      {purpose === 'marriage' && (
        <fieldset className="choice">
          <legend>{tr(L, 'qCommunity')}</legend>
          <div className="chips">
            {COMMUNITIES.map((c) => (
              <button key={c.value} className={`chip ${community === c.value ? 'on' : ''}`} onClick={() => setCommunity(c.value)} aria-pressed={community === c.value}>
                {c.label[L]}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="choice">
        <legend>{tr(L, 'qGender')}</legend>
        <div className="chips">
          <button className={`chip ${gender === 'female' ? 'on' : ''}`} onClick={() => setGender('female')} aria-pressed={gender === 'female'}>👧 {tr(L, 'girl')}</button>
          <button className={`chip ${gender === 'male' ? 'on' : ''}`} onClick={() => setGender('male')} aria-pressed={gender === 'male'}>👦 {tr(L, 'boy')}</button>
        </div>
      </fieldset>

      <label className="consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{tr(L, 'consent')}</span>
      </label>

      <button className="btn btn-primary btn-lg btn-block" disabled={!consent} onClick={() => onCreate(newDoc(purpose, docLang, purpose === 'marriage' ? community : 'other', gender))}>
        {tr(L, 'begin')} →
      </button>
      <p className="muted center">🛡️ {tr(L, 'pledge1')}</p>
    </div>
  );
}
