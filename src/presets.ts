import { FIELDS } from './fields';
import type { Community, Doc, Field, Gender, Lang, Purpose, Section, SectionKind } from './types';
import { recommendedTemplate } from './templates/catalog';

export const uid = () => Math.random().toString(36).slice(2, 10);

const field = (key: string): Field => ({ id: uid(), key, value: '', hidden: !!FIELDS[key]?.sensitive });
const section = (key: string, kind: SectionKind, keys: string[] = []): Section => ({
  id: uid(), key, kind, fields: keys.map(field), body: '', hidden: false,
});

const COMMUNITY_EXTRA: Record<Community, string[]> = {
  hindu: [],
  jain: ['jainSect'],
  muslim: ['maslak'],
  sikh: [],
  christian: [],
  other: [],
};

const TOP_LINES: Record<Community, Record<Lang, string>> = {
  hindu: { en: '|| Shree Ganeshaya Namah ||', hi: '॥ श्री गणेशाय नमः ॥', mr: '॥ श्री गणेशाय नमः ॥' },
  jain: { en: '|| Jai Jinendra ||', hi: '॥ जय जिनेंद्र ॥', mr: '॥ जय जिनेंद्र ॥' },
  muslim: { en: 'Bismillah-ir-Rahman-ir-Rahim', hi: 'बिस्मिल्लाह-हिर्रहमान-निर्रहीम', mr: 'बिस्मिल्लाह-हिर्रहमान-निर्रहीम' },
  sikh: { en: 'Ik Onkar', hi: 'ੴ इक ओंकार', mr: 'ੴ इक ओंकार' },
  christian: { en: '', hi: '', mr: '' },
  other: { en: '', hi: '', mr: '' },
};

export const HEADINGS: Record<Purpose, Record<Lang, string>> = {
  marriage: { en: 'Marriage Biodata', hi: 'विवाह बायोडाटा', mr: 'लग्नाचा बायोडाटा' },
  job: { en: 'Biodata', hi: 'बायोडाटा', mr: 'बायोडाटा' },
  general: { en: 'Biodata', hi: 'बायोडाटा', mr: 'बायोडाटा' },
};

export function buildSections(purpose: Purpose, community: Community): Section[] {
  if (purpose === 'marriage') {
    const kundli = community === 'hindu' || community === 'jain' || community === 'sikh';
    const list: Section[] = [
      section('personal', 'fields', [
        'fullName', 'dob', 'birthTime', 'birthPlace', 'height', 'weight', 'bloodGroup', 'diet',
        'maritalStatus', 'religion', ...COMMUNITY_EXTRA[community], 'caste', 'subCaste', 'motherTongue',
      ]),
      section('career', 'fields', ['education', 'college', 'occupation', 'company', 'workCity', 'income']),
      section('family', 'fields', [
        'fatherName', 'fatherOcc', 'motherName', 'motherOcc', 'brothers', 'sisters', 'familyType', 'nativePlace', 'mosal', 'address',
      ]),
    ];
    if (kundli) list.push(section('kundli', 'fields', ['rashi', 'nakshatra', 'gotra', 'manglik', 'gan', 'nadi', 'kuldevta']));
    list.push(section('about', 'text'), section('expectations', 'text'), section('contact', 'fields', ['contactName', 'contactRelation', 'phone', 'phone2', 'email']));
    return list;
  }
  if (purpose === 'job') {
    return [
      section('objective', 'text'),
      section('personal', 'fields', ['fullName', 'fatherName', 'dob', 'gender', 'maritalStatus', 'nationality', 'languages', 'phone', 'email', 'address']),
      section('education', 'list'),
      section('experience', 'list'),
      section('skills', 'list'),
      section('achievements', 'list'),
      section('hobbies', 'list'),
      section('declaration', 'text'),
    ];
  }
  return [
    section('personal', 'fields', [
      'fullName', 'fatherName', 'motherName', 'dob', 'gender', 'bloodGroup', 'religion', 'nationality', 'languages', 'phone', 'email', 'address',
    ]),
    section('education', 'list'),
    section('about', 'text'),
    section('hobbies', 'list'),
  ];
}

export function newDoc(purpose: Purpose, lang: Lang, community: Community, gender: Gender): Doc {
  const sections = buildSections(purpose, community);
  // Address is useful (not sensitive) on job and general biodata.
  if (purpose !== 'marriage') {
    for (const s of sections) for (const f of s.fields) if (f.key === 'address') f.hidden = false;
  }
  const gField = sections.flatMap((s) => s.fields).find((f) => f.key === 'gender');
  if (gField) gField.value = gender;
  const nat = sections.flatMap((s) => s.fields).find((f) => f.key === 'nationality');
  if (nat) nat.value = lang === 'en' ? 'Indian' : 'भारतीय';
  return {
    id: uid(),
    version: 1,
    purpose,
    lang,
    community,
    gender,
    topLine: purpose === 'marriage' ? TOP_LINES[community][lang] : '',
    heading: HEADINGS[purpose][lang],
    sections,
    photo: null,
    showPhoto: true,
    template: recommendedTemplate(purpose, community),
    color: null,
    traits: [],
    hobbies: '',
    writerVariant: 0,
    updatedAt: Date.now(),
  };
}

export const COMMUNITIES: { value: Community; label: Record<Lang, string> }[] = [
  { value: 'hindu', label: { en: 'Hindu', hi: 'हिंदू', mr: 'हिंदू' } },
  { value: 'jain', label: { en: 'Jain', hi: 'जैन', mr: 'जैन' } },
  { value: 'muslim', label: { en: 'Muslim', hi: 'मुस्लिम', mr: 'मुस्लिम' } },
  { value: 'sikh', label: { en: 'Sikh', hi: 'सिख', mr: 'शीख' } },
  { value: 'christian', label: { en: 'Christian', hi: 'ईसाई', mr: 'ख्रिश्चन' } },
  { value: 'other', label: { en: 'Other', hi: 'अन्य', mr: 'इतर' } },
];
