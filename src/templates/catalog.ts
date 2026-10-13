import type { Community, Purpose } from '../types';

export type Layout = 'classic' | 'royal' | 'simple' | 'sidebar' | 'floral' | 'elegant' | 'resume' | 'resumeSide' | 'minimal';
export type FontSet = 'sans' | 'serif' | 'classic';

export interface Palette { id: string; name: string; accent: string; accent2: string; paper: string; ink: string; soft: string }

export const PALETTES: Record<string, Palette> = {
  maroon: { id: 'maroon', name: 'Maroon', accent: '#7a1f2b', accent2: '#c8a24a', paper: '#fffaf0', ink: '#2b1a12', soft: '#f6e7d0' },
  royal: { id: 'royal', name: 'Royal blue', accent: '#1f3a7a', accent2: '#c8a24a', paper: '#fbfaf5', ink: '#16203a', soft: '#e3e9f6' },
  emerald: { id: 'emerald', name: 'Emerald', accent: '#0f5c46', accent2: '#c9a54b', paper: '#fbfbf4', ink: '#132a22', soft: '#dfeee6' },
  saffron: { id: 'saffron', name: 'Saffron', accent: '#b4530a', accent2: '#7a2e0b', paper: '#fffaf2', ink: '#2e1a0b', soft: '#fbe6cf' },
  rose: { id: 'rose', name: 'Rose', accent: '#a8325e', accent2: '#d9a441', paper: '#fff8f9', ink: '#2e1520', soft: '#f8dfe7' },
  navy: { id: 'navy', name: 'Navy', accent: '#1d2b44', accent2: '#5b7bb3', paper: '#ffffff', ink: '#18202e', soft: '#e7ecf4' },
  teal: { id: 'teal', name: 'Teal', accent: '#0e6b73', accent2: '#e0a33b', paper: '#fbfdfd', ink: '#10282b', soft: '#dcefef' },
  purple: { id: 'purple', name: 'Purple', accent: '#5b2a86', accent2: '#d1a640', paper: '#fcfaff', ink: '#221433', soft: '#ebe1f5' },
  charcoal: { id: 'charcoal', name: 'Charcoal', accent: '#2f3437', accent2: '#8a8f94', paper: '#ffffff', ink: '#1d2023', soft: '#eceeef' },
};

export const COLOR_CHOICES = ['maroon', 'royal', 'emerald', 'saffron', 'rose', 'navy'];

export interface TemplateDef {
  id: string;
  name: string;
  nameHi: string;
  layout: Layout;
  palette: string;
  font: FontSet;
  purposes: Purpose[];
}

const T = (id: string, name: string, nameHi: string, layout: Layout, palette: string, font: FontSet, purposes: Purpose[]): TemplateDef =>
  ({ id, name, nameHi, layout, palette, font, purposes });

const M: Purpose[] = ['marriage'];
const MG: Purpose[] = ['marriage', 'general'];
const J: Purpose[] = ['job'];
const JG: Purpose[] = ['job', 'general'];

export const TEMPLATES: TemplateDef[] = [
  T('shubh-laal', 'Shubh Laal', 'शुभ लाल', 'classic', 'maroon', 'serif', M),
  T('shahi-neela', 'Shahi Neela', 'शाही नीला', 'royal', 'royal', 'classic', M),
  T('kesariya', 'Kesariya', 'केसरिया', 'classic', 'saffron', 'serif', M),
  T('gulabi', 'Gulabi Phool', 'गुलाबी फूल', 'floral', 'rose', 'serif', M),
  T('hara-moti', 'Hara Moti', 'हरा मोती', 'elegant', 'emerald', 'classic', M),
  T('saral-laal', 'Saral Laal', 'सरल लाल', 'simple', 'maroon', 'sans', MG),
  T('aadhunik', 'Aadhunik', 'आधुनिक', 'sidebar', 'navy', 'sans', MG),
  T('rajwadi', 'Rajwadi', 'राजवाड़ी', 'royal', 'maroon', 'classic', M),
  T('chandni', 'Chandni', 'चाँदनी', 'elegant', 'navy', 'classic', M),
  T('mor-pankh', 'Mor Pankh', 'मोर पंख', 'floral', 'teal', 'serif', M),
  T('jamuni', 'Jamuni', 'जामुनी', 'royal', 'purple', 'classic', M),
  T('saral-neela', 'Saral Neela', 'सरल नीला', 'simple', 'royal', 'sans', MG),
  T('sidebar-laal', 'Shaan', 'शान', 'sidebar', 'maroon', 'sans', MG),
  T('sidebar-hara', 'Hariyali', 'हरियाली', 'sidebar', 'emerald', 'sans', MG),
  T('peetambar', 'Peetambar', 'पीतांबर', 'classic', 'royal', 'serif', M),
  T('kamal', 'Kamal', 'कमल', 'floral', 'saffron', 'serif', M),
  T('noor', 'Noor', 'नूर', 'elegant', 'teal', 'classic', M),
  T('minimal-kala', 'Saadgi', 'सादगी', 'minimal', 'charcoal', 'sans', MG),
  T('minimal-gulabi', 'Komal', 'कोमल', 'minimal', 'rose', 'sans', M),
  T('sidebar-kesari', 'Ujala', 'उजाला', 'sidebar', 'saffron', 'sans', M),
  T('resume-classic', 'Classic Resume', 'क्लासिक', 'resume', 'navy', 'sans', JG),
  T('resume-blue', 'Professional', 'प्रोफेशनल', 'resumeSide', 'royal', 'sans', JG),
  T('resume-teal', 'Fresh', 'फ्रेश', 'resumeSide', 'teal', 'sans', J),
  T('resume-charcoal', 'Corporate', 'कॉर्पोरेट', 'resume', 'charcoal', 'sans', J),
  T('resume-maroon', 'Sarkari Form', 'सरकारी फॉर्म', 'simple', 'charcoal', 'sans', JG),
  T('resume-minimal', 'Clean', 'क्लीन', 'minimal', 'navy', 'sans', JG),
  T('resume-emerald', 'Growth', 'ग्रोथ', 'resumeSide', 'emerald', 'sans', J),
  T('general-floral', 'Phulwari', 'फुलवारी', 'floral', 'purple', 'sans', ['general']),
  T('general-elegant', 'Gauravshali', 'गौरवशाली', 'elegant', 'maroon', 'classic', ['general']),
  T('general-royal', 'Pratishtha', 'प्रतिष्ठा', 'royal', 'navy', 'classic', ['general']),
];

export const templateById = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];

const RECOMMENDED: Record<Community, string> = {
  hindu: 'shubh-laal',
  jain: 'kesariya',
  muslim: 'hara-moti',
  sikh: 'shahi-neela',
  christian: 'chandni',
  other: 'saral-laal',
};

export function recommendedTemplate(purpose: Purpose, community: Community): string {
  if (purpose === 'job') return 'resume-classic';
  if (purpose === 'general') return 'saral-neela';
  return RECOMMENDED[community];
}

/** The short list shown first: the recommendation plus three close alternatives. */
export function suggestions(purpose: Purpose, community: Community): TemplateDef[] {
  const rec = recommendedTemplate(purpose, community);
  const pool = TEMPLATES.filter((t) => t.purposes.includes(purpose) && t.id !== rec);
  const picks: TemplateDef[] = [templateById(rec)];
  const seen = new Set([templateById(rec).layout]);
  for (const t of pool) {
    if (picks.length >= 4) break;
    if (!seen.has(t.layout)) { picks.push(t); seen.add(t.layout); }
  }
  return picks;
}
