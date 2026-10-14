import type { Community, Purpose } from '../types';

export type Layout = 'arch' | 'modern' | 'editorial' | 'tiles' | 'mandala' | 'royal' | 'floral' | 'heritage' | 'resume' | 'resumeSide';
export type FontSet = 'display' | 'sans';

export interface Palette { id: string; name: string; accent: string; accent2: string; paper: string; ink: string; soft: string; deep: string }

/** Contemporary Indian wedding palettes: jewel tones and earthy pastels with gold. */
export const PALETTES: Record<string, Palette> = {
  sage: { id: 'sage', name: 'Sage', accent: '#4f6b52', accent2: '#b8955a', paper: '#fbfaf5', ink: '#24302a', soft: '#e7ece2', deep: '#3b5240' },
  terracotta: { id: 'terracotta', name: 'Terracotta', accent: '#a3502f', accent2: '#c99a5b', paper: '#fdf8f3', ink: '#3a2219', soft: '#f3e2d6', deep: '#7c3a20' },
  rose: { id: 'rose', name: 'Dusty rose', accent: '#9c5468', accent2: '#c6a06a', paper: '#fdf8f8', ink: '#3a2128', soft: '#f3e3e6', deep: '#7a3c4e' },
  maroon: { id: 'maroon', name: 'Maroon & gold', accent: '#7a1f2e', accent2: '#c2a160', paper: '#fdf9f2', ink: '#2e1a17', soft: '#f3e6d6', deep: '#5c1522' },
  emerald: { id: 'emerald', name: 'Emerald & gold', accent: '#145a45', accent2: '#c6a352', paper: '#fbfbf6', ink: '#14281f', soft: '#dfece5', deep: '#0d3f30' },
  navy: { id: 'navy', name: 'Navy & gold', accent: '#1f2e4d', accent2: '#c2a160', paper: '#fbfaf6', ink: '#161d2c', soft: '#e3e8f1', deep: '#141f37' },
  plum: { id: 'plum', name: 'Plum', accent: '#5b2c5e', accent2: '#c9a15c', paper: '#fcf9fb', ink: '#26152a', soft: '#ece0ee', deep: '#401d42' },
  marigold: { id: 'marigold', name: 'Marigold', accent: '#b4621a', accent2: '#8a3d12', paper: '#fffaf1', ink: '#33200f', soft: '#fbe7c9', deep: '#8a4a10' },
  ink: { id: 'ink', name: 'Charcoal', accent: '#2a2d32', accent2: '#a88f63', paper: '#ffffff', ink: '#1c1e21', soft: '#eef0f2', deep: '#1c1e21' },
  ocean: { id: 'ocean', name: 'Ocean', accent: '#24577f', accent2: '#7fa6c6', paper: '#ffffff', ink: '#14222f', soft: '#e4eef6', deep: '#1a425f' },
};

export const COLOR_CHOICES = ['sage', 'terracotta', 'rose', 'maroon', 'emerald', 'navy', 'plum'];

export interface TemplateDef {
  id: string;
  name: string;
  nameHi: string;
  layout: Layout;
  palette: string;
  font: FontSet;
  purposes: Purpose[];
}

const T = (id: string, name: string, nameHi: string, layout: Layout, palette: string, purposes: Purpose[], font: FontSet = 'display'): TemplateDef =>
  ({ id, name, nameHi, layout, palette, font, purposes });

const M: Purpose[] = ['marriage'];
const MG: Purpose[] = ['marriage', 'general'];
const J: Purpose[] = ['job'];
const JG: Purpose[] = ['job', 'general'];

export const TEMPLATES: TemplateDef[] = [
  T('mehrab-sage', 'Mehrab Sage', 'मेहराब सेज', 'arch', 'sage', M),
  T('mehrab-rose', 'Mehrab Rose', 'मेहराब गुलाबी', 'arch', 'rose', M),
  T('mehrab-terracotta', 'Mehrab Terracotta', 'मेहराब टेराकोटा', 'arch', 'terracotta', M),
  T('aadhunik-maroon', 'Aadhunik', 'आधुनिक', 'modern', 'maroon', MG),
  T('aadhunik-navy', 'Aadhunik Navy', 'आधुनिक नीला', 'modern', 'navy', MG),
  T('aadhunik-sage', 'Aadhunik Sage', 'आधुनिक सेज', 'modern', 'sage', MG),
  T('patrika-emerald', 'Patrika', 'पत्रिका', 'editorial', 'emerald', MG),
  T('patrika-plum', 'Patrika Plum', 'पत्रिका जामुनी', 'editorial', 'plum', MG),
  T('patrika-terracotta', 'Patrika Terracotta', 'पत्रिका टेराकोटा', 'editorial', 'terracotta', MG),
  T('saaf-rose', 'Saaf', 'साफ़', 'tiles', 'rose', MG, 'sans'),
  T('saaf-sage', 'Saaf Sage', 'साफ़ सेज', 'tiles', 'sage', MG, 'sans'),
  T('saaf-navy', 'Saaf Navy', 'साफ़ नीला', 'tiles', 'navy', MG, 'sans'),
  T('mandala-maroon', 'Mandala', 'मंडल', 'mandala', 'maroon', M),
  T('mandala-marigold', 'Mandala Marigold', 'मंडल गेंदा', 'mandala', 'marigold', M),
  T('mandala-emerald', 'Mandala Emerald', 'मंडल हरा', 'mandala', 'emerald', M),
  T('rajsi-emerald', 'Rajsi', 'राजसी', 'royal', 'emerald', M),
  T('rajsi-maroon', 'Rajsi Maroon', 'राजसी लाल', 'royal', 'maroon', M),
  T('rajsi-navy', 'Rajsi Navy', 'राजसी नीला', 'royal', 'navy', M),
  T('gulmohar-rose', 'Gulmohar', 'गुलमोहर', 'floral', 'rose', M),
  T('gulmohar-sage', 'Gulmohar Sage', 'गुलमोहर सेज', 'floral', 'sage', M),
  T('gulmohar-plum', 'Gulmohar Plum', 'गुलमोहर जामुनी', 'floral', 'plum', M),
  T('virasat-maroon', 'Virasat', 'विरासत', 'heritage', 'maroon', M),
  T('virasat-marigold', 'Virasat Marigold', 'विरासत केसरिया', 'heritage', 'marigold', M),
  T('career-ocean', 'Career', 'करियर', 'resumeSide', 'ocean', JG, 'sans'),
  T('career-ink', 'Career Charcoal', 'करियर चारकोल', 'resumeSide', 'ink', J, 'sans'),
  T('career-emerald', 'Career Emerald', 'करियर हरा', 'resumeSide', 'emerald', J, 'sans'),
  T('clean-ink', 'Clean', 'क्लीन', 'resume', 'ink', JG, 'sans'),
  T('clean-ocean', 'Clean Blue', 'क्लीन नीला', 'resume', 'ocean', JG, 'sans'),
  T('clean-navy', 'Sarkari', 'सरकारी', 'resume', 'navy', JG, 'sans'),
  T('clean-maroon', 'Clean Maroon', 'क्लीन लाल', 'resume', 'maroon', ['general', 'job'], 'sans'),
];

export const templateById = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];

const RECOMMENDED: Record<Community, string> = {
  hindu: 'mehrab-rose',
  jain: 'mandala-marigold',
  muslim: 'patrika-emerald',
  sikh: 'rajsi-navy',
  christian: 'aadhunik-navy',
  other: 'aadhunik-maroon',
};

export function recommendedTemplate(purpose: Purpose, community: Community): string {
  if (purpose === 'job') return 'career-ocean';
  if (purpose === 'general') return 'saaf-navy';
  return RECOMMENDED[community];
}

/** The short list shown first: the recommendation plus three different looks. */
export function suggestions(purpose: Purpose, community: Community): TemplateDef[] {
  const rec = templateById(recommendedTemplate(purpose, community));
  const picks: TemplateDef[] = [rec];
  const seen = new Set([rec.layout]);
  for (const t of TEMPLATES) {
    if (picks.length >= 4) break;
    if (t.purposes.includes(purpose) && !seen.has(t.layout)) { picks.push(t); seen.add(t.layout); }
  }
  return picks;
}
