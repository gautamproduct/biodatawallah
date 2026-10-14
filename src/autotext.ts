import { newDoc } from './presets';
import type { Community, Doc, Gender } from './types';
import { writeFor } from './writer';

const AUTO_KEYS = ['about', 'expectations', 'objective', 'declaration'];

function hasName(doc: Doc) {
  return doc.sections.some((s) => s.fields.some((f) => f.key === 'fullName' && f.value.trim()));
}

/** Keeps auto-written paragraphs up to date until the family edits them by hand. */
export function refreshAuto(doc: Doc): Doc {
  if (!hasName(doc)) return doc;
  const auto = { ...(doc.auto ?? {}) };
  let changed = false;
  const sections = doc.sections.map((s) => {
    if (!s.key || !AUTO_KEYS.includes(s.key)) return s;
    const untouched = s.body === '' || s.body === auto[s.key];
    if (!untouched) return s;
    const text = writeFor(doc, s.key) ?? '';
    if (text === s.body) return s;
    auto[s.key] = text;
    changed = true;
    return { ...s, body: text };
  });
  return changed ? { ...doc, sections, auto } : doc;
}

/** Rebuilds the form for a new community or gender, keeping everything already typed. */
export function reshape(doc: Doc, community: Community, gender: Gender): Doc {
  const fresh = newDoc(doc.purpose, doc.lang, community, gender);
  const values = new Map<string, { value: string; hidden: boolean; label?: string }>();
  for (const s of doc.sections) for (const f of s.fields) if (f.key) values.set(f.key, f);
  const bodies = new Map(doc.sections.filter((s) => s.key).map((s) => [s.key!, s.body]));
  const sections = fresh.sections.map((s) => ({
    ...s,
    body: bodies.get(s.key!) ?? s.body,
    fields: s.fields.map((f) => {
      const old = f.key ? values.get(f.key) : undefined;
      return old && f.key !== 'gender' ? { ...f, value: old.value, hidden: old.hidden, label: old.label } : f;
    }),
  }));
  // Keep custom sections and custom fields.
  for (const s of doc.sections) {
    if (!s.key) sections.push(s);
    else {
      const target = sections.find((x) => x.key === s.key);
      const custom = s.fields.filter((f) => !f.key);
      if (target && custom.length) target.fields = [...target.fields, ...custom];
    }
  }
  const sameTopLine = doc.topLine === newDoc(doc.purpose, doc.lang, doc.community, doc.gender).topLine;
  return {
    ...doc,
    community,
    gender,
    sections,
    topLine: sameTopLine ? fresh.topLine : doc.topLine,
    template: doc.template === newDoc(doc.purpose, doc.lang, doc.community, doc.gender).template ? fresh.template : doc.template,
  };
}
