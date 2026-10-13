import { useCallback, useEffect, useRef, useState } from 'react';
import { LegalModal } from './components/Legal';
import { go } from './nav';
import { Editor } from './pages/Editor';
import { Landing } from './pages/Landing';
import { Preview } from './pages/Preview';
import { Start } from './pages/Start';
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

  useEffect(() => {
    document.documentElement.lang = doc && (route.page === 'edit' || route.page === 'preview') ? doc.lang : uiLang;
  }, [uiLang, doc, route.page]);

  let page;
  if (route.page === 'start') {
    page = <Start lang={uiLang} initialPurpose={route.id} onLang={changeLang} onCreate={(d) => { saveDoc(d); setDoc(d); go(`edit/${d.id}/0`); }} />;
  } else if (route.page === 'edit' && doc && doc.id === route.id) {
    page = <Editor doc={doc} step={route.step} onChange={update} />;
  } else if (route.page === 'preview' && doc && doc.id === route.id) {
    page = <Preview doc={doc} onChange={update} onLegal={setLegal} />;
  } else if (route.page === 'edit' || route.page === 'preview') {
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
