// Example biodatas for the home page gallery. Names are illustrative, not real people.
import { newDoc } from './presets';
import type { Doc, Lang, Purpose } from './types';
import { writeAbout, writeDeclaration, writeExpectations, writeObjective } from './writer';

const AVATAR = (bg: string) =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250"><rect width="200" height="250" fill="${bg}"/><circle cx="100" cy="95" r="44" fill="#fff" opacity=".85"/><path d="M20 250c6-62 42-92 80-92s74 30 80 92z" fill="#fff" opacity=".85"/></svg>`,
  );

const VALUES: Record<Lang, Record<string, string>> = {
  hi: {
    fullName: 'प्रिया रमेश शर्मा', dob: '1999-03-12', birthTime: '06:45', birthPlace: 'इंदौर', height: "5'4", bloodGroup: 'B+', diet: 'veg',
    maritalStatus: 'never', religion: 'हिंदू', motherTongue: 'हिंदी', education: 'बी.कॉम, एमबीए (फ़ाइनेंस)', occupation: 'बैंक अधिकारी',
    company: 'राष्ट्रीयकृत बैंक', workCity: 'भोपाल', fatherName: 'श्री रमेश शर्मा', fatherOcc: 'सेवानिवृत्त शिक्षक', motherName: 'श्रीमती सुनीता शर्मा',
    motherOcc: 'गृहिणी', brothers: '1 बड़े भाई, विवाहित', familyType: 'joint', nativePlace: 'उज्जैन', rashi: 'kanya', nakshatra: 'hasta',
    gotra: 'भारद्वाज', manglik: 'no', contactName: 'श्री रमेश शर्मा', contactRelation: 'पिता', phone: '98XXXXXX10',
  },
  mr: {
    fullName: 'स्नेहा विजय देशपांडे', dob: '1998-08-21', birthTime: '10:20', birthPlace: 'पुणे', height: "5'3", bloodGroup: 'O+', diet: 'veg',
    maritalStatus: 'never', religion: 'हिंदू', motherTongue: 'मराठी', education: 'बी.ई. (कॉम्प्युटर)', occupation: 'सॉफ्टवेअर इंजिनिअर',
    company: 'आयटी कंपनी', workCity: 'पुणे', fatherName: 'श्री. विजय देशपांडे', fatherOcc: 'व्यावसायिक', motherName: 'सौ. मीना देशपांडे',
    motherOcc: 'शिक्षिका', sisters: '1 लहान बहीण', familyType: 'nuclear', nativePlace: 'सातारा', mosal: 'कुलकर्णी, कोल्हापूर',
    rashi: 'simha', nakshatra: 'magha', gotra: 'काश्यप', manglik: 'no', kuldevta: 'तुळजाभवानी', contactName: 'श्री. विजय देशपांडे',
    contactRelation: 'वडील', phone: '97XXXXXX22',
  },
  en: {
    fullName: 'Rahul Anil Mehta', dob: '1996-11-02', birthTime: '18:10', birthPlace: 'Ahmedabad', height: "5'10", diet: 'jainfood',
    maritalStatus: 'never', religion: 'Jain', jainSect: 'derasar', motherTongue: 'Gujarati', education: 'B.Com, CA', occupation: 'Chartered Accountant',
    company: 'Own practice', workCity: 'Ahmedabad', fatherName: 'Shri Anil Mehta', fatherOcc: 'Textile business', motherName: 'Smt. Kalpana Mehta',
    motherOcc: 'Homemaker', sisters: '1 elder, married', familyType: 'joint', nativePlace: 'Palitana', mosal: 'Shah family, Surat',
    contactName: 'Shri Anil Mehta', contactRelation: 'Father', phone: '99XXXXXX45',
  },
};

export function sampleDoc(lang: Lang, template: string, purpose: Purpose = 'marriage'): Doc {
  const community = lang === 'en' ? 'jain' : 'hindu';
  const gender = lang === 'en' ? 'male' : 'female';
  const d = newDoc(purpose, lang, community, gender);
  d.id = `sample-${lang}-${template}`;
  d.template = template;
  if (purpose === 'job') {
    const v: Record<string, string> = { fullName: 'Amit Kumar Verma', fatherName: 'Shri Suresh Verma', dob: '2001-05-15', maritalStatus: 'never', languages: 'Hindi, English', phone: '98XXXXXX31', email: 'amit.verma@email.com', address: 'Lucknow, Uttar Pradesh' };
    for (const s of d.sections) for (const f of s.fields) if (f.key && v[f.key]) f.value = v[f.key];
    const body: Record<string, string> = {
      education: 'B.Tech (Electrical), AKTU — 2023, 74%\n12th (UP Board) — 2019, 82%\n10th (UP Board) — 2017, 86%',
      experience: 'Junior Engineer, Power solutions company — 2023 to present\nInternship, State electricity board — 2 months',
      skills: 'AutoCAD\nMS Excel\nSite supervision\nTeam work',
      hobbies: 'Cricket\nReading',
    };
    for (const s of d.sections) if (s.key && body[s.key]) s.body = body[s.key];
    d.gender = 'male';
    const obj = d.sections.find((s) => s.key === 'objective'); if (obj) obj.body = writeObjective(d);
    const dec = d.sections.find((s) => s.key === 'declaration'); if (dec) dec.body = writeDeclaration(d);
    d.photo = AVATAR('#9aa6b8');
    return d;
  }
  const v = VALUES[lang];
  for (const s of d.sections) for (const f of s.fields) if (f.key && v[f.key]) f.value = v[f.key];
  d.traits = ['cultured', 'understanding', 'familyoriented', 'cheerful'];
  d.hobbies = lang === 'hi' ? 'संगीत और खाना बनाने' : lang === 'mr' ? 'वाचन आणि गायन' : 'cricket and travelling';
  const about = d.sections.find((s) => s.key === 'about'); if (about) about.body = writeAbout(d);
  const exp = d.sections.find((s) => s.key === 'expectations'); if (exp) exp.body = writeExpectations(d);
  d.photo = AVATAR(lang === 'en' ? '#8fa3c0' : '#c79aa6');
  return d;
}
