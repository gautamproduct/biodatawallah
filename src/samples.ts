// Example biodatas for the home page and the design gallery.
// All people are fictional; portraits are illustrations, not photos of real people.
import { newDoc } from './presets';
import type { Community, Doc, Gender, Lang, Purpose } from './types';
import { writeAbout, writeDeclaration, writeExpectations, writeObjective } from './writer';

// Real-looking AI portraits dropped into src/assets/samples (girl-1.jpg … boy-4.jpg) replace the illustrations.
const PHOTO_FILES = import.meta.glob('./assets/samples/*.{jpg,jpeg,png,webp,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
function samplePhoto(kind: 'girl' | 'boy', n: number): string | null {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'svg']) {
    const url = PHOTO_FILES[`./assets/samples/${kind}-${n}.${ext}`];
    if (url) return url;
  }
  return null;
}

interface Look { bg1: string; bg2: string; skin: string; hair: string; outfit: string; trim: string }
type Style = 'long' | 'bun' | 'dupatta' | 'quiff' | 'beard';
type Wear = 'saree' | 'suit' | 'nehru' | 'blazer' | 'shirt';

/** A plain, blank photo area for examples. */
function placeholder(l: Look): string {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="${l.bg1}"/></svg>`);
}

interface Persona {
  lang: Lang; community: Community; gender: Gender; look: Look; n: number; style: Style; wear: Wear; bindi?: boolean;
  values: Record<string, string>; traits: string[]; hobbies: string;
}

const PERSONAS: Persona[] = [
  {
    lang: 'hi', community: 'hindu', gender: 'female', n: 1, style: 'long', wear: 'saree', bindi: true,
    look: { bg1: '#f1dfd3', bg2: '#d9b3a3', skin: '#c98f6e', hair: '#2a1b17', outfit: '#9c3d54', trim: '#d4a64a' },
    values: {
      fullName: 'प्रिया रमेश शर्मा', dob: '1999-03-12', birthTime: '06:45', birthPlace: 'इंदौर', height: "5'4", bloodGroup: 'B+', diet: 'veg',
      maritalStatus: 'never', religion: 'हिंदू', motherTongue: 'हिंदी', education: 'एमबीए (फ़ाइनेंस)', occupation: 'बैंक अधिकारी',
      company: 'राष्ट्रीयकृत बैंक', workCity: 'भोपाल', fatherName: 'श्री रमेश शर्मा', fatherOcc: 'सेवानिवृत्त शिक्षक', motherName: 'श्रीमती सुनीता शर्मा',
      motherOcc: 'गृहिणी', brothers: '1 बड़े भाई, विवाहित', familyType: 'joint', nativePlace: 'उज्जैन', rashi: 'kanya', nakshatra: 'hasta',
      gotra: 'भारद्वाज', manglik: 'no', contactName: 'श्री रमेश शर्मा', contactRelation: 'पिता', phone: '98XXXXXX10',
    },
    traits: ['cultured', 'understanding', 'familyoriented', 'cheerful'], hobbies: 'संगीत और खाना बनाने',
  },
  {
    lang: 'mr', community: 'hindu', gender: 'male', n: 1, style: 'quiff', wear: 'nehru',
    look: { bg1: '#dfe7e0', bg2: '#a9bfae', skin: '#b97c5a', hair: '#1f1714', outfit: '#3f5a46', trim: '#c9a35a' },
    values: {
      fullName: 'रोहन सुनील देशमुख', dob: '1996-08-21', birthTime: '10:20', birthPlace: 'पुणे', height: "5'10", bloodGroup: 'O+', diet: 'veg',
      maritalStatus: 'never', religion: 'हिंदू', motherTongue: 'मराठी', education: 'बी.ई. (कॉम्प्युटर)', occupation: 'सॉफ्टवेअर इंजिनिअर',
      company: 'आयटी कंपनी', workCity: 'पुणे', fatherName: 'श्री. सुनील देशमुख', fatherOcc: 'व्यावसायिक', motherName: 'सौ. मीना देशमुख',
      motherOcc: 'शिक्षिका', sisters: '1 लहान बहीण', familyType: 'nuclear', nativePlace: 'सातारा', mosal: 'कुलकर्णी, कोल्हापूर',
      rashi: 'simha', nakshatra: 'magha', gotra: 'काश्यप', manglik: 'no', kuldevta: 'तुळजाभवानी', contactName: 'श्री. सुनील देशमुख',
      contactRelation: 'वडील', phone: '97XXXXXX22',
    },
    traits: ['hardworking', 'understanding', 'familyoriented', 'honest'], hobbies: 'क्रिकेट आणि प्रवास',
  },
  {
    lang: 'en', community: 'jain', gender: 'male', n: 2, style: 'quiff', wear: 'blazer',
    look: { bg1: '#e6e2f0', bg2: '#b6aecb', skin: '#c48b68', hair: '#221815', outfit: '#1f2e4d', trim: '#c2a160' },
    values: {
      fullName: 'Rahul Anil Mehta', dob: '1996-11-02', birthTime: '18:10', birthPlace: 'Ahmedabad', height: "5'10", diet: 'jainfood',
      maritalStatus: 'never', religion: 'Jain', jainSect: 'derasar', motherTongue: 'Gujarati', education: 'B.Com, CA', occupation: 'Chartered Accountant',
      company: 'Own practice', workCity: 'Ahmedabad', fatherName: 'Shri Anil Mehta', fatherOcc: 'Textile business', motherName: 'Smt. Kalpana Mehta',
      motherOcc: 'Homemaker', sisters: '1 elder, married', familyType: 'joint', nativePlace: 'Palitana', mosal: 'Shah family, Surat',
      contactName: 'Shri Anil Mehta', contactRelation: 'Father', phone: '99XXXXXX45',
    },
    traits: ['cheerful', 'familyoriented', 'ambitious', 'honest'], hobbies: 'cricket and travelling',
  },
  {
    lang: 'en', community: 'muslim', gender: 'female', n: 2, style: 'dupatta', wear: 'suit',
    look: { bg1: '#e3eee8', bg2: '#a8c7b8', skin: '#c99272', hair: '#24170f', outfit: '#145a45', trim: '#e3c27a' },
    values: {
      fullName: 'Sana Imran Qureshi', dob: '1998-06-05', birthPlace: 'Lucknow', height: "5'3", maritalStatus: 'never', religion: 'Islam',
      maslak: 'Sunni Hanafi', motherTongue: 'Urdu', education: 'MBA (HR)', occupation: 'HR Manager', company: 'Private firm', workCity: 'Lucknow',
      fatherName: 'Janab Imran Qureshi', fatherOcc: 'Government officer (retd.)', motherName: 'Mrs. Farah Qureshi', motherOcc: 'Teacher',
      brothers: '1 younger, studying', familyType: 'nuclear', nativePlace: 'Lucknow', contactName: 'Janab Imran Qureshi', contactRelation: 'Father', phone: '96XXXXXX37',
    },
    traits: ['understanding', 'independent', 'caring', 'modern'], hobbies: 'reading and calligraphy',
  },
  {
    lang: 'hi', community: 'hindu', gender: 'male', n: 3, style: 'beard', wear: 'nehru',
    look: { bg1: '#f0e3d2', bg2: '#d5b48c', skin: '#b47a58', hair: '#1c1411', outfit: '#7a1f2e', trim: '#c2a160' },
    values: {
      fullName: 'अंकित विजय वर्मा', dob: '1995-01-18', birthTime: '04:30', birthPlace: 'जयपुर', height: "5'9", bloodGroup: 'A+', diet: 'veg',
      maritalStatus: 'never', religion: 'हिंदू', motherTongue: 'हिंदी', education: 'एम.टेक', occupation: 'सहायक प्रोफ़ेसर', company: 'सरकारी इंजीनियरिंग कॉलेज',
      workCity: 'जयपुर', fatherName: 'श्री विजय वर्मा', fatherOcc: 'व्यापारी', motherName: 'श्रीमती आशा वर्मा', motherOcc: 'गृहिणी',
      sisters: '1 छोटी बहन', familyType: 'joint', nativePlace: 'अलवर', rashi: 'makar', nakshatra: 'shravana', gotra: 'कश्यप', manglik: 'partial',
      contactName: 'श्री विजय वर्मा', contactRelation: 'पिता', phone: '94XXXXXX58',
    },
    traits: ['cultured', 'hardworking', 'religious', 'caring'], hobbies: 'योग और पढ़ने',
  },
  {
    lang: 'mr', community: 'hindu', gender: 'female', n: 3, style: 'bun', wear: 'saree', bindi: true,
    look: { bg1: '#f6e3e6', bg2: '#dcaab4', skin: '#cf9877', hair: '#2b1c18', outfit: '#5b2c5e', trim: '#d8b06a' },
    values: {
      fullName: 'स्नेहा विजय कुलकर्णी', dob: '1998-08-21', birthTime: '10:20', birthPlace: 'नाशिक', height: "5'3", bloodGroup: 'O+', diet: 'veg',
      maritalStatus: 'never', religion: 'हिंदू', motherTongue: 'मराठी', education: 'एम.एस्सी. (बायोटेक)', occupation: 'संशोधक',
      company: 'फार्मा कंपनी', workCity: 'मुंबई', fatherName: 'श्री. विजय कुलकर्णी', fatherOcc: 'बँक अधिकारी (निवृत्त)', motherName: 'सौ. मीना कुलकर्णी',
      motherOcc: 'गृहिणी', brothers: '1 मोठा भाऊ', familyType: 'nuclear', nativePlace: 'नाशिक', mosal: 'जोशी, पुणे',
      rashi: 'tula', nakshatra: 'swati', gotra: 'वसिष्ठ', manglik: 'no', kuldevta: 'खंडोबा', contactName: 'श्री. विजय कुलकर्णी', contactRelation: 'वडील', phone: '98XXXXXX61',
    },
    traits: ['cultured', 'cheerful', 'independent', 'familyoriented'], hobbies: 'वाचन आणि गायन',
  },
];

const JOB_PERSONAS = [
  {
    gender: 'male' as Gender, n: 4, style: 'quiff' as Style, wear: 'shirt' as Wear,
    look: { bg1: '#dfe7f0', bg2: '#a7bbd0', skin: '#b87d5b', hair: '#1d1512', outfit: '#24577f', trim: '#f2f2f2' },
    v: { fullName: 'Amit Kumar Verma', fatherName: 'Shri Suresh Verma', dob: '2001-05-15', maritalStatus: 'never', languages: 'Hindi, English', phone: '98XXXXXX31', email: 'amit.verma@email.com', address: 'Lucknow, Uttar Pradesh' },
    body: {
      education: 'B.Tech (Electrical), AKTU — 2023, 74%\n12th (UP Board) — 2019, 82%\n10th (UP Board) — 2017, 86%',
      experience: 'Junior Engineer, Power solutions company — 2023 to present\nInternship, State electricity board — 2 months',
      skills: 'AutoCAD\nMS Excel\nSite supervision\nTeam work', hobbies: 'Cricket\nReading',
    },
  },
  {
    gender: 'female' as Gender, n: 4, style: 'bun' as Style, wear: 'blazer' as Wear,
    look: { bg1: '#ece6f3', bg2: '#bfb1d4', skin: '#c99272', hair: '#24170f', outfit: '#2a2d32', trim: '#ffffff' },
    v: { fullName: 'Neha Ramesh Patil', fatherName: 'Shri Ramesh Patil', dob: '2000-09-09', maritalStatus: 'never', languages: 'Marathi, Hindi, English', phone: '97XXXXXX84', email: 'neha.patil@email.com', address: 'Nagpur, Maharashtra' },
    body: {
      education: 'B.Com, RTMNU — 2021, 81%\nTally & GST certificate — 2022\n12th (HSC) — 2018, 85%',
      experience: 'Accounts Executive, Trading company — 2022 to present\nArticle assistant, CA firm — 1 year',
      skills: 'Tally Prime\nGST filing\nMS Excel\nCustomer handling', hobbies: 'Drawing\nYoga',
    },
  },
];

let counter = 0;

/**
 * A filled example biodata. `pick` chooses the person (alternating girls and boys);
 * without it, the first person for that language is used.
 */
export function sampleDoc(lang: Lang, template: string, purpose: Purpose = 'marriage', pick?: number): Doc {
  if (purpose === 'job' || purpose === 'general') {
    const p = JOB_PERSONAS[(pick ?? 0) % JOB_PERSONAS.length];
    const d = newDoc(purpose, 'en', 'other', p.gender);
    d.id = `sample-${template}-${counter++}`;
    d.template = template;
    for (const s of d.sections) for (const f of s.fields) if (f.key && f.key in p.v) f.value = p.v[f.key as keyof typeof p.v];
    for (const s of d.sections) if (s.key && s.key in p.body) s.body = p.body[s.key as keyof typeof p.body];
    const obj = d.sections.find((s) => s.key === 'objective'); if (obj) obj.body = writeObjective(d);
    const dec = d.sections.find((s) => s.key === 'declaration'); if (dec) dec.body = writeDeclaration(d);
    d.photo = samplePhoto(p.gender === 'female' ? 'girl' : 'boy', p.n) ?? placeholder(p.look);
    return d;
  }
  const pool = pick === undefined ? PERSONAS.filter((x) => x.lang === lang) : PERSONAS;
  const p = pool[(pick ?? 0) % pool.length] ?? PERSONAS[0];
  const d = newDoc('marriage', p.lang, p.community, p.gender);
  d.id = `sample-${template}-${counter++}`;
  d.template = template;
  for (const s of d.sections) for (const f of s.fields) if (f.key && p.values[f.key]) f.value = p.values[f.key];
  d.traits = p.traits;
  d.hobbies = p.hobbies;
  const about = d.sections.find((s) => s.key === 'about'); if (about) about.body = writeAbout(d);
  const exp = d.sections.find((s) => s.key === 'expectations'); if (exp) exp.body = writeExpectations(d);
  d.photo = samplePhoto(p.gender === 'female' ? 'girl' : 'boy', p.n) ?? placeholder(p.look);
  return d;
}
