// Example biodatas for the home page and the design gallery.
// All people are fictional; portraits are illustrations, not photos of real people.
import { newDoc } from './presets';
import type { Community, Doc, Gender, Lang, Purpose } from './types';
import { writeAbout, writeDeclaration, writeExpectations, writeObjective } from './writer';

// Real-looking AI portraits dropped into src/assets/samples (girl-1.jpg … boy-4.jpg) replace the illustrations.
const PHOTO_FILES = import.meta.glob('./assets/samples/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
function samplePhoto(kind: 'girl' | 'boy', n: number): string | null {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const url = PHOTO_FILES[`./assets/samples/${kind}-${n}.${ext}`];
    if (url) return url;
  }
  return null;
}

interface Look { bg1: string; bg2: string; skin: string; hair: string; outfit: string; trim: string }
type Style = 'long' | 'bun' | 'dupatta' | 'quiff' | 'beard';
type Wear = 'saree' | 'suit' | 'nehru' | 'blazer' | 'shirt';

/** A modern, faceless editorial portrait (SVG) — clean shapes and soft gradients, no cartoon features. */
function portrait(g: Gender, l: Look, style: Style = g === 'female' ? 'long' : 'quiff', wear: Wear = g === 'female' ? 'saree' : 'nehru', bindi = false): string {
  const defs =
    `<defs>` +
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l.bg1}"/><stop offset="1" stop-color="${l.bg2}"/></linearGradient>` +
    `<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l.skin}" stop-opacity=".88"/><stop offset="1" stop-color="${l.skin}"/></linearGradient>` +
    `<linearGradient id="hr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l.hair}" stop-opacity=".82"/><stop offset="1" stop-color="${l.hair}"/></linearGradient>` +
    `<linearGradient id="ot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l.outfit}" stop-opacity=".85"/><stop offset="1" stop-color="${l.outfit}"/></linearGradient>` +
    `<linearGradient id="tr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${l.trim}"/><stop offset="1" stop-color="${l.trim}" stop-opacity=".7"/></linearGradient>` +
    `<pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#fff" fill-opacity=".35"/></pattern>` +
    `</defs>`;
  const bg = `<rect width="400" height="500" fill="url(#bg)"/><circle cx="200" cy="250" r="170" fill="#fff" fill-opacity=".28"/><circle cx="318" cy="96" r="40" fill="#fff" fill-opacity=".22"/>`;
  const shoulders = `<path d="M62 500 C70 408 126 350 200 344 C274 350 330 408 338 500Z" fill="url(#ot)"/>`;
  const neck = `<path d="M178 262 h44 v74 q-22 16 -44 0z" fill="url(#sk)"/><path d="M178 278 q22 20 44 0 v-14 h-44z" fill="#000" fill-opacity=".1"/>`;
  let wearSvg = '';
  if (wear === 'saree') wearSvg = shoulders + `<path d="M166 344 Q200 386 234 344 L224 330 L176 330Z" fill="url(#sk)"/><path d="M118 368 C176 418 262 446 338 462 L338 500 L250 500 C196 468 146 428 100 388Z" fill="url(#tr)"/><path d="M118 368 C176 418 262 446 338 462 L338 500 L250 500 C196 468 146 428 100 388Z" fill="url(#dots)"/>`;
  if (wear === 'suit') wearSvg = shoulders + `<path d="M170 344 Q200 380 230 344 L222 330 L178 330Z" fill="url(#sk)"/><path d="M200 380 v120" stroke="url(#tr)" stroke-width="6"/>`;
  if (wear === 'nehru') wearSvg = shoulders + `<path d="M172 336 h56 l-6 22 h-44z" fill="url(#tr)"/><path d="M200 360 v140" stroke="#000" stroke-opacity=".12" stroke-width="2"/>` + [384, 414, 444, 474].map((y) => `<circle cx="200" cy="${y}" r="4" fill="url(#tr)"/>`).join('');
  if (wear === 'blazer') wearSvg = shoulders + `<path d="M170 340 L200 400 L230 340 L240 352 L200 500 L160 352Z" fill="#f4f1ec"/><path d="M194 372 h12 l6 128 h-24z" fill="url(#tr)"/><path d="M150 360 L200 500 L176 500 L130 380Z M250 360 L200 500 L224 500 L270 380Z" fill="#000" fill-opacity=".18"/>`;
  if (wear === 'shirt') wearSvg = shoulders + `<path d="M168 338 L200 372 L232 338 L244 352 L214 386 L200 372 L186 386 L156 352Z" fill="#fff" fill-opacity=".92"/><path d="M200 386 v114" stroke="#000" stroke-opacity=".12" stroke-width="2"/>`;
  const face = `<ellipse cx="200" cy="212" rx="${g === 'female' ? 55 : 57}" ry="${g === 'female' ? 69 : 68}" fill="url(#sk)"/><ellipse cx="200" cy="240" rx="40" ry="26" fill="#000" fill-opacity=".03"/>`;
  let back = '';
  let front = '';
  if (style === 'long') {
    back = `<path d="M118 250 C110 146 150 98 200 98 C250 98 292 146 284 250 C280 322 290 372 302 404 L98 404 C110 372 122 322 118 250Z" fill="url(#hr)"/>`;
    front = `<path d="M142 210 C138 140 172 110 206 110 C248 112 268 150 262 214 C250 172 228 150 196 146 C172 152 152 176 142 210Z" fill="url(#hr)"/><path d="M146 196 C132 246 134 296 150 336 L130 336 C118 282 124 222 146 196Z" fill="url(#hr)"/><path d="M226 128 C246 140 258 160 260 186" stroke="#fff" stroke-opacity=".22" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  if (style === 'bun') {
    back = `<circle cx="200" cy="106" r="38" fill="url(#hr)"/><path d="M140 214 C134 150 166 122 200 122 C234 122 266 150 260 214 Z" fill="url(#hr)"/>`;
    front = `<path d="M142 206 C142 150 170 128 202 128 C240 130 260 158 258 206 C246 176 226 158 198 154 C172 158 154 178 142 206Z" fill="url(#hr)"/>`;
  }
  if (style === 'dupatta') {
    back = `<path d="M118 262 C104 158 148 92 200 92 C252 92 296 158 282 262 C292 332 304 382 324 424 L76 424 C96 382 108 332 118 262Z" fill="url(#ot)" fill-opacity=".72"/><path d="M118 262 C104 158 148 92 200 92 C252 92 296 158 282 262 C292 332 304 382 324 424 L76 424 C96 382 108 332 118 262Z" fill="url(#dots)"/>`;
    front = `<path d="M146 176 C156 140 178 126 200 126 C222 126 244 140 254 176 C236 158 218 152 200 152 C182 152 164 158 146 176Z" fill="url(#hr)"/><path d="M134 232 C130 176 160 120 200 118 C240 120 270 176 266 232" stroke="url(#ot)" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M128 250 C124 186 158 126 200 124 C242 126 276 186 272 250" stroke="url(#tr)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  if (style === 'quiff' || style === 'beard') {
    front = `<path d="M144 204 C136 140 170 104 212 106 C254 108 270 148 258 204 C252 176 238 160 220 154 C196 150 166 160 148 196Z" fill="url(#hr)"/><path d="M168 122 C190 104 236 102 254 128" stroke="#fff" stroke-opacity=".2" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (style === 'beard') front += `<path d="M146 218 C148 268 174 292 200 294 C226 292 252 268 254 218 C248 252 228 270 200 272 C172 270 152 252 146 218Z" fill="url(#hr)" fill-opacity=".9"/>`;
  }
  const ears = g === 'male' || style === 'bun'
    ? `<ellipse cx="${g === 'male' ? 143 : 145}" cy="222" rx="8" ry="13" fill="url(#sk)"/><ellipse cx="${g === 'male' ? 257 : 255}" cy="222" rx="8" ry="13" fill="url(#sk)"/>`
    : '';
  const jewels = g === 'female' && style !== 'dupatta'
    ? `<circle cx="146" cy="240" r="4" fill="${l.trim}"/><circle cx="146" cy="254" r="6.5" fill="${l.trim}"/><circle cx="254" cy="240" r="4" fill="${l.trim}"/><circle cx="254" cy="254" r="6.5" fill="${l.trim}"/>`
    : '';
  const dot = bindi ? `<circle cx="200" cy="180" r="4.5" fill="#b3263a"/>` : '';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">${defs}${bg}<g transform="translate(200 520) scale(1.18) translate(-200 -500)">${back}${neck}${wearSvg}${ears}${face}${front}${jewels}${dot}</g></svg>`,
  );
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
    d.photo = samplePhoto(p.gender === 'female' ? 'girl' : 'boy', p.n) ?? portrait(p.gender, p.look, p.style, p.wear);
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
  d.photo = samplePhoto(p.gender === 'female' ? 'girl' : 'boy', p.n) ?? portrait(p.gender, p.look, p.style, p.wear, p.bindi);
  return d;
}
