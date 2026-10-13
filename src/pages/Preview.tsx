import { useEffect, useRef, useState } from 'react';
import { TopBar } from '../components/Header';
import { helpLink } from '../components/Legal';
import { Scaled } from '../components/Scaled';
import { CONFIG } from '../config';
import { nodeToPdfBlob, nodeToPngBlob, safeFileName, saveBlob, shareFiles } from '../export';
import { go } from '../nav';
import { isDemoMode, pay } from '../pay';
import { addUnlock, getUnlock, unlockExpiry } from '../store';
import { Biodata, PAGE_H, PAGE_W, personName, WhatsAppCard } from '../templates/Biodata';
import type { Doc } from '../types';
import { tr } from '../ui';

export function Preview({ doc, onLegal }: { doc: Doc; onChange: (d: Doc) => void; onLegal: (k: 'privacy' | 'terms') => void }) {
  const L = doc.lang;
  const [tab, setTab] = useState<'page' | 'card'>('page');
  const [unlock, setUnlock] = useState(() => getUnlock(doc.id));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [demo, setDemo] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const noPhotoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const wmPageRef = useRef<HTMLDivElement>(null);
  const wmCardRef = useRef<HTMLDivElement>(null);
  const name = personName(doc);
  const base = safeFileName(name);
  const vars = { price: CONFIG.price, days: CONFIG.editDays };
  const help = helpLink(`Namaste, I need help with my biodata (${name || 'no name'}).`);

  async function run(job: () => Promise<void>) {
    setBusy(true); setMsg('');
    try { await job(); } catch (e) { console.error(e); setMsg('⚠️ ' + (e as Error).message); } finally { setBusy(false); }
  }

  const sendToFamily = () => run(async () => {
    const page = await nodeToPngBlob(wmPageRef.current!, 1.2);
    const card = await nodeToPngBlob(wmCardRef.current!, 0.6);
    await shareFiles([
      new File([page], `${base}-preview.png`, { type: 'image/png' }),
      new File([card], `${base}-preview-card.png`, { type: 'image/png' }),
    ], tr(L, 'sendFamilyText'));
  });

  const downloadAll = () => run(async () => {
    const pdf = await nodeToPdfBlob(pageRef.current!);
    saveBlob(pdf, `${base}-biodata.pdf`);
    const card = await nodeToPngBlob(cardRef.current!, 1);
    saveBlob(card, `${base}-whatsapp.png`);
  });

  const onPaid = (paymentId: string) => {
    const u = { docId: doc.id, paymentId, paidAt: Date.now() };
    addUnlock(u);
    setUnlock(u);
    setDemo(false);
    setPendingDownload(true);
  };

  // The clean full-size copies only exist after payment, so download once they have rendered.
  useEffect(() => {
    if (pendingDownload && unlock && pageRef.current && cardRef.current) {
      setPendingDownload(false);
      downloadAll();
    }
  });

  const startPayment = () => {
    if (!name) { setMsg(tr(L, 'needName')); return; }
    if (isDemoMode()) { setDemo(true); return; }
    const phone = doc.sections.flatMap((s) => s.fields).find((f) => f.key === 'phone')?.value;
    pay({ name, description: doc.heading || 'Biodata', phone })
      .then((r) => onPaid(r.paymentId))
      .catch((e: Error) => { if (e.message !== 'dismissed') setMsg(tr(L, 'payFailed')); });
  };

  const shareFinal = () => run(async () => {
    const pdf = await nodeToPdfBlob(pageRef.current!);
    const card = await nodeToPngBlob(cardRef.current!, 1);
    await shareFiles([
      new File([card], `${base}-whatsapp.png`, { type: 'image/png' }),
      new File([pdf], `${base}-biodata.pdf`, { type: 'application/pdf' }),
    ], doc.heading);
  });

  const expiry = unlock ? unlockExpiry(unlock).toLocaleDateString(L === 'en' ? 'en-IN' : `${L}-IN`, { day: 'numeric', month: 'long' }) : '';

  return (
    <div className="page preview">
      <TopBar>
        <button className="btn btn-small btn-ghost" onClick={() => go(`edit/${doc.id}/0`)}>{tr(L, 'edit')}</button>
      </TopBar>

      <div className="preview-grid">
        <div className="preview-doc">
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'page'} className={tab === 'page' ? 'on' : ''} onClick={() => setTab('page')}>📄 {tr(L, 'tabPage')}</button>
            <button role="tab" aria-selected={tab === 'card'} className={tab === 'card' ? 'on' : ''} onClick={() => setTab('card')}>💬 {tr(L, 'tabCard')}</button>
          </div>
          <div className="paper-shadow">
            {tab === 'page'
              ? <Scaled width={PAGE_W} height={PAGE_H}><Biodata doc={doc} watermark={!unlock} /></Scaled>
              : <Scaled width={1080} height={1350}><WhatsAppCard doc={doc} watermark={!unlock} /></Scaled>}
          </div>
        </div>

        <div className="preview-actions">
          {!unlock ? (
            <>
              <h1>{tr(L, 'readyTitle')}</h1>
              <p className="muted">{tr(L, 'readySub')}</p>
              <button className="btn btn-ghost btn-block" onClick={() => go(`edit/${doc.id}/0`)}>{tr(L, 'edit')}</button>
              <button className="btn btn-whatsapp btn-block" disabled={busy} onClick={sendToFamily}>💬 {tr(L, 'sendFamily')}</button>
              <div className="pay-card">
                <button className="btn btn-primary btn-lg btn-block" disabled={busy} onClick={startPayment}>⬇ {tr(L, 'downloadPay', vars)}</button>
                <ul className="trust">
                  <li>✓ {tr(L, 'payTrust1', vars)}</li>
                  <li>✓ {tr(L, 'payTrust2')}</li>
                  <li>✓ {tr(L, 'payTrust3', vars)}</li>
                  <li>✓ {tr(L, 'payTrust4')}</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <h1>✅ {tr(L, 'paidTitle')}</h1>
              <button className="btn btn-primary btn-lg btn-block" disabled={busy} onClick={() => run(async () => saveBlob(await nodeToPdfBlob(pageRef.current!), `${base}-biodata.pdf`))}>⬇ {tr(L, 'downloadPdf')}</button>
              <button className="btn btn-primary btn-block" disabled={busy} onClick={() => run(async () => saveBlob(await nodeToPngBlob(cardRef.current!, 1), `${base}-whatsapp.png`))}>⬇ {tr(L, 'downloadCard')}</button>
              {doc.photo && <button className="btn btn-ghost btn-block" disabled={busy} onClick={() => run(async () => saveBlob(await nodeToPdfBlob(noPhotoRef.current!), `${base}-biodata-no-photo.pdf`))}>⬇ {tr(L, 'downloadNoPhoto')}</button>}
              <button className="btn btn-whatsapp btn-block" disabled={busy} onClick={shareFinal}>💬 {tr(L, 'shareWhatsApp')}</button>
              <button className="btn btn-ghost btn-block" onClick={() => go(`edit/${doc.id}/0`)}>✎ {tr(L, 'editFree', { date: expiry })}</button>
              <button className="btn btn-ghost btn-block" onClick={() => go('start')}>+ {tr(L, 'makeAnother')}</button>
            </>
          )}
          {busy && <p className="working">⏳ {tr(L, 'working')}</p>}
          {msg && <p className="error" role="alert">{msg}</p>}
          <div className="preview-foot">
            {help && <a href={help} target="_blank" rel="noreferrer">💬 {tr(L, 'help')}</a>}
            <button className="linkish" onClick={() => onLegal('privacy')}>{tr(L, 'privacy')}</button>
            <button className="linkish" onClick={() => onLegal('terms')}>{tr(L, 'terms')}</button>
          </div>
        </div>
      </div>

      {/* Full-size copies used to make the files. */}
      <div className="offscreen" aria-hidden>
        <Biodata ref={wmPageRef} doc={doc} watermark />
        <WhatsAppCard ref={wmCardRef} doc={doc} watermark />
        {unlock && (
          <>
            <Biodata ref={pageRef} doc={doc} />
            <Biodata ref={noPhotoRef} doc={doc} showPhoto={false} />
            <WhatsAppCard ref={cardRef} doc={doc} />
          </>
        )}
      </div>

      {demo && (
        <div className="modal-back" onClick={() => setDemo(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>🧪 {tr(L, 'demoTitle')}</h2>
            <p>{tr(L, 'demoBody')}</p>
            <button className="btn btn-primary btn-block" onClick={() => onPaid(`demo_${Date.now()}`)}>{tr(L, 'demoPay')}</button>
            <button className="btn btn-ghost btn-block" onClick={() => setDemo(false)}>{tr(L, 'cancel')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
