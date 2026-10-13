// Everything is saved in this browser only (localStorage). Nothing is sent to a server.
import { CONFIG } from './config';
import type { Doc, Lang } from './types';

const DOCS = 'bw.docs.v1';
const UNLOCKS = 'bw.unlocks.v1';
const UI_LANG = 'bw.lang';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function listDocs(): Doc[] {
  return read<Doc[]>(DOCS, []).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveDoc(doc: Doc): boolean {
  const all = read<Doc[]>(DOCS, []).filter((d) => d.id !== doc.id);
  all.push(doc);
  if (write(DOCS, all)) return true;
  // Storage full (usually large photos): keep this one, drop older photos.
  const slim = all.map((d) => (d.id === doc.id ? d : { ...d, photo: null }));
  return write(DOCS, slim);
}

export function deleteDoc(id: string) {
  write(DOCS, read<Doc[]>(DOCS, []).filter((d) => d.id !== id));
}

export interface Unlock { docId: string; paymentId: string; paidAt: number }

export function getUnlock(docId: string): Unlock | null {
  const u = read<Unlock[]>(UNLOCKS, []).find((x) => x.docId === docId);
  if (!u) return null;
  return Date.now() - u.paidAt < CONFIG.editDays * 86400000 ? u : null;
}

export function addUnlock(u: Unlock) {
  write(UNLOCKS, [...read<Unlock[]>(UNLOCKS, []).filter((x) => x.docId !== u.docId), u]);
}

export function unlockExpiry(u: Unlock) {
  return new Date(u.paidAt + CONFIG.editDays * 86400000);
}

export function deleteEverything() {
  try {
    localStorage.removeItem(DOCS);
    localStorage.removeItem(UNLOCKS);
  } catch {
    /* nothing stored */
  }
}

export function getUiLang(): Lang {
  const v = read<string>(UI_LANG, '');
  if (v === 'en' || v === 'hi' || v === 'mr') return v;
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('mr') ? 'mr' : nav.startsWith('hi') ? 'hi' : 'hi';
}

export function setUiLang(l: Lang) {
  write(UI_LANG, l);
}
