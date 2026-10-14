import { useCallback, useEffect, useRef, useState } from 'react';
import { LegalModal } from './components/Legal';
import { go } from './nav';
import { Editor } from './pages/Editor';
import { Landing } from './pages/Landing';
import { Preview } from './pages/Preview';
import { newDoc } from './presets';
import type { Purpose } from './types';
import { getUiLang, listDocs, saveDoc, setUiLang } from './store';
import type { Doc, Lang } from './types';

function parseHash() {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return { page: parts[0] ?? '', id: parts[1] ?? '', step: Number(parts[2] ?? 0) || 0 };
}


export default function App() {
  const [route, setRoute] = useState(parseHash);
  const [uiLang, setLang] = useState<Lang>(getUiLang);
  const [doc, setDoc] = useState<Doc | null>(null);
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null);
  const saveTimer = useRef<number>(0);

  useEffect(() => {
    const onHash = () => { setRoute(parseHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Load the biodata named in the URL.
  useEffect(() => {
    if (route.page !== 'edit' && route.page !== 'preview') return;
    if (doc?.id === route.id) return;
    const found = listDocs().find((d) => d.id === route.id) ?? null;
    if (found) setDoc(found);
    else go('');
  }, [route.page, route.id, doc?.id]);

  const update = useCallback((next: Doc) => {
    const stamped = { ...next, updatedAt: Date.now() };
    setDoc(stamped);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => saveDoc(stamped), 300);
  }, []);

  const changeLang = (l: Lang) => { setLang(l); setUiLang(l); };

  // "start/<purpose>" makes a new biodata straight away — no setup questions.
  const creating = useRef('');
  useEffect(() => {
    if (route.page !== 'start') return;
    const key = `${route.id}-${window.location.hash}`;
    if (creating.current === key) return; // React dev mode runs effects twice
    creating.current = key;
    const purpose: Purpose = route.id === 'job' || route.id === 'general' ? route.id : 'marriage';
    const d = newDoc(purpose, uiLang, purpose === 'marriage' ? 'hindu' : 'other', 'female');
    saveDoc(d);
    setDoc(d);
    window.location.replace(`#/edit/${d.id}`);
    setTimeout(() => { creating.current = ''; }, 0);
  }, [route.page, route.id, uiLang]);

  useEffect(() => {
    document.documentElement.lang = doc && (route.page === 'edit' || route.page === 'preview') ? doc.lang : uiLang;
  }, [uiLang, doc, route.page]);

  let page;
  if (route.page === 'edit' && doc && doc.id === route.id) {
    page = <Editor doc={doc} onChange={update} />;
  } else if (route.page === 'preview' && doc && doc.id === route.id) {
    page = <Preview doc={doc} onChange={update} onLegal={setLegal} />;
  } else if (route.page === 'edit' || route.page === 'preview' || route.page === 'start') {
    page = <div className="loading" />;
  } else {
    page = <Landing lang={uiLang} onLang={changeLang} onLegal={setLegal} />;
  }

  return (
    <>
      {page}
      {legal && <LegalModal kind={legal} lang={doc && (route.page === 'edit' || route.page === 'preview') ? doc.lang : uiLang} onClose={() => setLegal(null)} />}
    </>
  );
}
