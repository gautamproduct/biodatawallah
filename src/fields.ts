import type { FieldType, Lang, T3 } from './types';

export interface Option { value: string; label: T3 }

export interface FieldDef {
  label: T3;
  type: FieldType;
  options?: Option[];
  /** Hidden on the biodata by default (caste, income, address). The user can switch it on. */
  sensitive?: boolean;
  placeholder?: T3;
}

const o = (value: string, en: string, hi: string, mr: string): Option => ({ value, label: { en, hi, mr } });
const t = (en: string, hi: string, mr: string): T3 => ({ en, hi, mr });

const heights: Option[] = [];
for (let inches = 48; inches <= 84; inches++) {
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  const cm = Math.round(inches * 2.54);
  heights.push(o(`${ft}'${inch}`, `${ft}' ${inch}" (${cm} cm)`, `${ft} फुट ${inch} इंच`, `${ft} फूट ${inch} इंच`));
}

const rashis: Option[] = [
  o('mesh', 'Mesh (Aries)', 'मेष', 'मेष'),
  o('vrishabh', 'Vrishabh (Taurus)', 'वृषभ', 'वृषभ'),
  o('mithun', 'Mithun (Gemini)', 'मिथुन', 'मिथुन'),
  o('kark', 'Kark (Cancer)', 'कर्क', 'कर्क'),
  o('simha', 'Simha (Leo)', 'सिंह', 'सिंह'),
  o('kanya', 'Kanya (Virgo)', 'कन्या', 'कन्या'),
  o('tula', 'Tula (Libra)', 'तुला', 'तूळ'),
  o('vrishchik', 'Vrishchik (Scorpio)', 'वृश्चिक', 'वृश्चिक'),
  o('dhanu', 'Dhanu (Sagittarius)', 'धनु', 'धनु'),
  o('makar', 'Makar (Capricorn)', 'मकर', 'मकर'),
  o('kumbh', 'Kumbh (Aquarius)', 'कुंभ', 'कुंभ'),
  o('meen', 'Meen (Pisces)', 'मीन', 'मीन'),
];

const nakshatraNames: [string, string, string][] = [
  ['Ashwini', 'अश्विनी', 'अश्विनी'], ['Bharani', 'भरणी', 'भरणी'], ['Krittika', 'कृत्तिका', 'कृत्तिका'],
  ['Rohini', 'रोहिणी', 'रोहिणी'], ['Mrigashira', 'मृगशिरा', 'मृग'], ['Ardra', 'आर्द्रा', 'आर्द्रा'],
  ['Punarvasu', 'पुनर्वसु', 'पुनर्वसू'], ['Pushya', 'पुष्य', 'पुष्य'], ['Ashlesha', 'आश्लेषा', 'आश्लेषा'],
  ['Magha', 'मघा', 'मघा'], ['Purva Phalguni', 'पूर्वा फाल्गुनी', 'पूर्वा फाल्गुनी'], ['Uttara Phalguni', 'उत्तरा फाल्गुनी', 'उत्तरा फाल्गुनी'],
  ['Hasta', 'हस्त', 'हस्त'], ['Chitra', 'चित्रा', 'चित्रा'], ['Swati', 'स्वाति', 'स्वाती'],
  ['Vishakha', 'विशाखा', 'विशाखा'], ['Anuradha', 'अनुराधा', 'अनुराधा'], ['Jyeshtha', 'ज्येष्ठा', 'ज्येष्ठा'],
  ['Mula', 'मूल', 'मूळ'], ['Purva Ashadha', 'पूर्वाषाढ़ा', 'पूर्वाषाढा'], ['Uttara Ashadha', 'उत्तराषाढ़ा', 'उत्तराषाढा'],
  ['Shravana', 'श्रवण', 'श्रवण'], ['Dhanishta', 'धनिष्ठा', 'धनिष्ठा'], ['Shatabhisha', 'शतभिषा', 'शततारका'],
  ['Purva Bhadrapada', 'पूर्वा भाद्रपद', 'पूर्वा भाद्रपदा'], ['Uttara Bhadrapada', 'उत्तरा भाद्रपद', 'उत्तरा भाद्रपदा'], ['Revati', 'रेवती', 'रेवती'],
];
const nakshatras = nakshatraNames.map(([en, hi, mr]) => o(en.toLowerCase().replace(/ /g, '-'), en, hi, mr));

const yesNo = [o('no', 'No', 'नहीं', 'नाही'), o('yes', 'Yes', 'हाँ', 'होय'), o('partial', 'Anshik (partial)', 'आंशिक', 'सौम्य'), o('unknown', "Don't know", 'पता नहीं', 'माहिती नाही')];

export const FIELDS: Record<string, FieldDef> = {
  fullName: { label: t('Full name', 'पूरा नाम', 'संपूर्ण नाव'), type: 'text', placeholder: t('e.g. Priya Ramesh Sharma', 'जैसे: प्रिया रमेश शर्मा', 'उदा. प्रिया रमेश देशपांडे') },
  dob: { label: t('Date of birth', 'जन्म तिथि', 'जन्म तारीख'), type: 'date' },
  birthTime: { label: t('Birth time', 'जन्म समय', 'जन्म वेळ'), type: 'time' },
  birthPlace: { label: t('Birth place', 'जन्म स्थान', 'जन्म ठिकाण'), type: 'text' },
  height: { label: t('Height', 'ऊँचाई', 'उंची'), type: 'select', options: heights },
  weight: { label: t('Weight', 'वज़न', 'वजन'), type: 'text', placeholder: t('e.g. 55 kg', 'जैसे: 55 किलो', 'उदा. 55 किलो') },
  bloodGroup: {
    label: t('Blood group', 'ब्लड ग्रुप', 'रक्तगट'), type: 'select',
    options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => o(g, g, g, g)),
  },
  diet: {
    label: t('Diet', 'भोजन', 'आहार'), type: 'select',
    options: [
      o('veg', 'Vegetarian', 'शाकाहारी', 'शाकाहारी'),
      o('jainfood', 'Jain food (no root vegetables)', 'जैन भोजन (कंदमूल रहित)', 'जैन आहार (कंदमुळे वर्ज्य)'),
      o('eggetarian', 'Eggetarian', 'अंडा ले सकते हैं', 'अंडी चालतात'),
      o('nonveg', 'Non-vegetarian', 'मांसाहारी', 'मांसाहारी'),
      o('vegan', 'Vegan', 'वीगन', 'व्हीगन'),
    ],
  },
  maritalStatus: {
    label: t('Marital status', 'वैवाहिक स्थिति', 'वैवाहिक स्थिती'), type: 'select',
    options: [
      o('never', 'Never married', 'अविवाहित', 'अविवाहित'),
      o('married', 'Married', 'विवाहित', 'विवाहित'),
      o('divorced', 'Divorced', 'तलाकशुदा', 'घटस्फोटित'),
      o('widowed', 'Widowed', 'विधुर / विधवा', 'विधुर / विधवा'),
      o('awaiting', 'Awaiting divorce', 'तलाक प्रक्रिया में', 'घटस्फोट प्रक्रियेत'),
    ],
  },
  gender: {
    label: t('Gender', 'लिंग', 'लिंग'), type: 'select',
    options: [o('female', 'Female', 'महिला', 'स्त्री'), o('male', 'Male', 'पुरुष', 'पुरुष'), o('other', 'Other', 'अन्य', 'इतर')],
  },
  religion: { label: t('Religion', 'धर्म', 'धर्म'), type: 'text' },
  caste: { label: t('Caste', 'जाति', 'जात'), type: 'text', sensitive: true },
  subCaste: { label: t('Sub-caste', 'उपजाति', 'पोटजात'), type: 'text', sensitive: true },
  motherTongue: { label: t('Mother tongue', 'मातृभाषा', 'मातृभाषा'), type: 'text' },
  maslak: { label: t('Maslak / Sect', 'मसलक / फ़िरक़ा', 'मसलक / पंथ'), type: 'text', placeholder: t('e.g. Sunni Hanafi', 'जैसे: सुन्नी हनफ़ी', 'उदा. सुन्नी हनफी') },
  jainSect: {
    label: t('Sect', 'संप्रदाय', 'संप्रदाय'), type: 'select',
    options: [
      o('derasar', 'Shwetambar Murtipujak (Derasar)', 'श्वेतांबर मूर्तिपूजक (देरासर)', 'श्वेतांबर मूर्तिपूजक (देरासर)'),
      o('sthanakvasi', 'Sthanakvasi', 'स्थानकवासी', 'स्थानकवासी'),
      o('terapanthi', 'Terapanthi', 'तेरापंथी', 'तेरापंथी'),
      o('digambar', 'Digambar', 'दिगंबर', 'दिगंबर'),
    ],
  },
  nationality: { label: t('Nationality', 'राष्ट्रीयता', 'राष्ट्रीयत्व'), type: 'text' },
  languages: { label: t('Languages known', 'भाषाएँ', 'भाषा'), type: 'text', placeholder: t('e.g. Hindi, English, Marathi', 'जैसे: हिंदी, अंग्रेज़ी', 'उदा. मराठी, हिंदी, इंग्रजी') },

  education: { label: t('Education', 'शिक्षा', 'शिक्षण'), type: 'text', placeholder: t('e.g. B.Com, MBA (Finance)', 'जैसे: बी.कॉम, एमबीए', 'उदा. बी.कॉम, एमबीए') },
  college: { label: t('College / University', 'कॉलेज / विश्वविद्यालय', 'महाविद्यालय / विद्यापीठ'), type: 'text' },
  occupation: { label: t('Occupation', 'व्यवसाय', 'व्यवसाय'), type: 'text', placeholder: t('e.g. Software Engineer', 'जैसे: सॉफ्टवेयर इंजीनियर', 'उदा. सॉफ्टवेअर इंजिनिअर') },
  company: { label: t('Company / Business', 'कंपनी / व्यापार', 'कंपनी / व्यवसाय'), type: 'text' },
  workCity: { label: t('Work location', 'कार्यस्थल', 'कामाचे ठिकाण'), type: 'text' },
  income: { label: t('Annual income', 'वार्षिक आय', 'वार्षिक उत्पन्न'), type: 'text', sensitive: true },

  fatherName: { label: t("Father's name", 'पिता का नाम', 'वडिलांचे नाव'), type: 'text' },
  fatherOcc: { label: t("Father's occupation", 'पिता का व्यवसाय', 'वडिलांचा व्यवसाय'), type: 'text' },
  motherName: { label: t("Mother's name", 'माता का नाम', 'आईचे नाव'), type: 'text' },
  motherOcc: { label: t("Mother's occupation", 'माता का व्यवसाय', 'आईचा व्यवसाय'), type: 'text', placeholder: t('e.g. Homemaker', 'जैसे: गृहिणी', 'उदा. गृहिणी') },
  brothers: { label: t('Brothers', 'भाई', 'भाऊ'), type: 'text', placeholder: t('e.g. 1 elder, married', 'जैसे: 1 बड़े, विवाहित', 'उदा. 1 मोठा, विवाहित') },
  sisters: { label: t('Sisters', 'बहन', 'बहीण'), type: 'text' },
  familyType: {
    label: t('Family type', 'परिवार का प्रकार', 'कुटुंब प्रकार'), type: 'select',
    options: [o('joint', 'Joint family', 'संयुक्त परिवार', 'एकत्र कुटुंब'), o('nuclear', 'Nuclear family', 'एकल परिवार', 'विभक्त कुटुंब')],
  },
  nativePlace: { label: t('Native place', 'मूल निवास', 'मूळ गाव'), type: 'text' },
  mosal: { label: t("Maternal family (Mama's side)", 'ननिहाल (मामा पक्ष)', 'आजोळ (मामा)'), type: 'text' },
  address: { label: t('Address', 'पता', 'पत्ता'), type: 'textarea', sensitive: true },

  rashi: { label: t('Rashi (Moon sign)', 'राशि', 'रास'), type: 'select', options: rashis },
  nakshatra: { label: t('Nakshatra', 'नक्षत्र', 'नक्षत्र'), type: 'select', options: nakshatras },
  gotra: { label: t('Gotra', 'गोत्र', 'गोत्र'), type: 'text' },
  manglik: { label: t('Manglik', 'मांगलिक', 'मंगळ'), type: 'select', options: yesNo },
  gan: {
    label: t('Gan', 'गण', 'गण'), type: 'select',
    options: [o('dev', 'Dev', 'देव', 'देव'), o('manushya', 'Manushya', 'मनुष्य', 'मनुष्य'), o('rakshas', 'Rakshas', 'राक्षस', 'राक्षस')],
  },
  nadi: {
    label: t('Nadi', 'नाड़ी', 'नाडी'), type: 'select',
    options: [o('adi', 'Adi', 'आदि', 'आद्य'), o('madhya', 'Madhya', 'मध्य', 'मध्य'), o('antya', 'Antya', 'अंत्य', 'अंत्य')],
  },
  kuldevta: { label: t('Kuldevta / Kuldevi', 'कुलदेवता / कुलदेवी', 'कुलदैवत'), type: 'text' },

  contactName: { label: t('Contact person', 'संपर्क व्यक्ति', 'संपर्क व्यक्ती'), type: 'text' },
  contactRelation: { label: t('Relation', 'संबंध', 'नाते'), type: 'text', placeholder: t('e.g. Father', 'जैसे: पिता', 'उदा. वडील') },
  phone: { label: t('Mobile', 'मोबाइल', 'मोबाईल'), type: 'tel' },
  phone2: { label: t('Alternate mobile', 'दूसरा मोबाइल', 'दुसरा मोबाईल'), type: 'tel' },
  email: { label: t('Email', 'ईमेल', 'ईमेल'), type: 'text' },
};

export const SECTION_TITLES: Record<string, T3> = {
  personal: t('Personal details', 'व्यक्तिगत जानकारी', 'वैयक्तिक माहिती'),
  career: t('Education & career', 'शिक्षा एवं व्यवसाय', 'शिक्षण व व्यवसाय'),
  family: t('Family details', 'पारिवारिक जानकारी', 'कौटुंबिक माहिती'),
  kundli: t('Horoscope details', 'कुंडली विवरण', 'पत्रिका माहिती'),
  about: t('About me', 'मेरे बारे में', 'माझ्याविषयी'),
  expectations: t('Partner expectations', 'जीवनसाथी से अपेक्षाएँ', 'जोडीदाराकडून अपेक्षा'),
  contact: t('Contact details', 'संपर्क', 'संपर्क'),
  objective: t('Career objective', 'करियर उद्देश्य', 'करिअर उद्दिष्ट'),
  education: t('Education', 'शैक्षणिक योग्यता', 'शैक्षणिक पात्रता'),
  experience: t('Work experience', 'कार्य अनुभव', 'कामाचा अनुभव'),
  skills: t('Skills', 'कौशल', 'कौशल्ये'),
  achievements: t('Achievements', 'उपलब्धियाँ', 'उपलब्धी'),
  hobbies: t('Hobbies', 'शौक', 'छंद'),
  declaration: t('Declaration', 'घोषणा', 'घोषणा'),
};

export function fieldLabel(key: string | null, custom: string | undefined, lang: Lang): string {
  if (custom) return custom;
  if (key && FIELDS[key]) return FIELDS[key].label[lang];
  return '';
}

/** What a field's value looks like on the biodata (select keys become words, dates get formatted). */
export function displayValue(key: string | null, value: string, lang: Lang): string {
  if (!value) return '';
  const def = key ? FIELDS[key] : undefined;
  if (def?.type === 'select') {
    const opt = def.options?.find((x) => x.value === value);
    return opt ? opt.label[lang] : value;
  }
  if (def?.type === 'date') {
    const d = new Date(value + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return value;
    const locale = lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : 'mr-IN';
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }
  if (def?.type === 'time') {
    const [h, m] = value.split(':').map(Number);
    if (Number.isNaN(h)) return value;
    const suffix = h < 12 ? 'AM' : 'PM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${String(m).padStart(2, '0')} ${suffix}`;
  }
  return value;
}

export function ageFromDob(dob: string): number | null {
  const d = new Date(dob + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}
