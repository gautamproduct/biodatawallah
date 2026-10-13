import type { ReactNode } from 'react';
import type { Lang } from '../types';
import { LANG_NAMES } from '../ui';

export function Brand() {
  return (
    <a className="brand" href="#/">
      <span className="brand-mark" aria-hidden>ब</span>
      <span className="brand-name">Biodata <b>Wallah</b></span>
    </a>
  );
}

export function LangSwitch({ lang, onLang }: { lang: Lang; onLang: (l: Lang) => void }) {
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {(['hi', 'mr', 'en'] as Lang[]).map((l) => (
        <button key={l} className={l === lang ? 'on' : ''} onClick={() => onLang(l)} aria-pressed={l === lang}>{LANG_NAMES[l]}</button>
      ))}
    </div>
  );
}

export function TopBar({ children }: { children?: ReactNode }) {
  return (
    <header className="topbar">
      <Brand />
      <div className="topbar-right">{children}</div>
    </header>
  );
}
