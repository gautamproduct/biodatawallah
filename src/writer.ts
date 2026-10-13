// Writes "About me", partner expectations, career objective and declaration in Hindi, Marathi or English.
// Runs entirely in the browser: nothing the family types is sent anywhere.
import { displayValue } from './fields';
import type { Doc, Gender, Lang } from './types';

interface Trait { key: string; en: string; hi: string; mr: Record<Gender, string> }

export const TRAITS: Trait[] = [
  { key: 'cultured', en: 'cultured', hi: 'संस्कारी', mr: { female: 'संस्कारी', male: 'संस्कारी' } },
  { key: 'hardworking', en: 'hardworking', hi: 'मेहनती', mr: { female: 'मेहनती', male: 'मेहनती' } },
  { key: 'understanding', en: 'understanding', hi: 'समझदार', mr: { female: 'समजूतदार', male: 'समजूतदार' } },
  { key: 'cheerful', en: 'cheerful', hi: 'हँसमुख', mr: { female: 'हसतमुख', male: 'हसतमुख' } },
  { key: 'familyoriented', en: 'family-oriented', hi: 'परिवार से जुड़ी हुई', mr: { female: 'कुटुंबवत्सल', male: 'कुटुंबवत्सल' } },
  { key: 'religious', en: 'spiritual', hi: 'धार्मिक', mr: { female: 'धार्मिक', male: 'धार्मिक' } },
  { key: 'simple', en: 'simple and down-to-earth', hi: 'सरल स्वभाव की', mr: { female: 'साध्या स्वभावाची', male: 'साध्या स्वभावाचा' } },
  { key: 'ambitious', en: 'ambitious', hi: 'महत्वाकांक्षी', mr: { female: 'महत्त्वाकांक्षी', male: 'महत्त्वाकांक्षी' } },
  { key: 'independent', en: 'independent', hi: 'आत्मनिर्भर', mr: { female: 'स्वावलंबी', male: 'स्वावलंबी' } },
  { key: 'caring', en: 'caring', hi: 'स्नेही', mr: { female: 'प्रेमळ', male: 'प्रेमळ' } },
  { key: 'honest', en: 'honest', hi: 'ईमानदार', mr: { female: 'प्रामाणिक', male: 'प्रामाणिक' } },
  { key: 'modern', en: 'modern in outlook with traditional values', hi: 'आधुनिक सोच और पारंपरिक मूल्यों वाली', mr: { female: 'आधुनिक विचारांची पण परंपरा जपणारी', male: 'आधुनिक विचारांचा पण परंपरा जपणारा' } },
];

export function traitLabel(t: Trait, lang: Lang, gender: Gender) {
  if (lang === 'en') return t.en;
  if (lang === 'mr') return t.mr[gender];
  return hiGender(t.hi, gender);
}

// Hindi adjectives that end in "की"/"हुई"/"वाली" switch for a son.
function hiGender(s: string, g: Gender) {
  if (g === 'female') return s;
  return s.replace(/ की$/, ' के').replace(/जुड़ी हुई$/, 'जुड़े हुए').replace(/वाली$/, 'वाले');
}

function joinList(items: string[], lang: Lang) {
  const and = lang === 'en' ? 'and' : lang === 'hi' ? 'और' : 'आणि';
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ` ${and} ` + items[items.length - 1];
}

function val(doc: Doc, key: string) {
  for (const s of doc.sections) for (const f of s.fields) if (f.key === key && f.value) return displayValue(f.key, f.value, doc.lang);
  return '';
}

function firstName(doc: Doc) {
  const full = val(doc, 'fullName');
  return full.split(/\s+/)[0] || (doc.lang === 'en' ? (doc.gender === 'female' ? 'She' : 'He') : '');
}

export function writeAbout(doc: Doc): string {
  const { lang, gender } = doc;
  const name = firstName(doc);
  const chosen = TRAITS.filter((t) => doc.traits.includes(t.key));
  const traits = (chosen.length ? chosen : TRAITS.filter((t) => ['cultured', 'understanding', 'familyoriented'].includes(t.key)))
    .slice(0, 4).map((t) => traitLabel(t, lang, gender));
  const edu = val(doc, 'education');
  const occ = val(doc, 'occupation');
  const company = val(doc, 'company');
  const city = val(doc, 'workCity');
  const hobbies = doc.hobbies.trim();
  const v = doc.writerVariant % 3;
  const f = gender === 'female';
  const out: string[] = [];

  if (lang === 'en') {
    const noun = doc.purpose === 'marriage' ? (f ? 'girl' : 'boy') : 'person';
    const pro = f ? 'She' : 'He';
    const her = f ? 'her' : 'his';
    out.push([
      `${name} is a ${joinList(traits, lang)} ${noun}.`,
      `${name} is known in the family as a ${joinList(traits, lang)} ${noun}.`,
      `A ${joinList(traits, lang)} ${noun}, ${name} brings warmth to everyone around ${f ? 'her' : 'him'}.`,
    ][v]);
    if (edu) out.push(`${pro} has completed ${edu}.`);
    if (occ) out.push(`${pro} is currently working as ${occ}${company ? ` at ${company}` : ''}${city ? ` in ${city}` : ''}.`);
    if (hobbies) out.push(`In ${her} free time, ${f ? 'she' : 'he'} enjoys ${hobbies}.`);
    if (doc.purpose === 'marriage') out.push([
      `${pro} values family, respects elders and believes in building a happy home together.`,
      `${pro} gives great importance to family values and mutual respect.`,
      `${pro} is looking for a life partner who values understanding, respect and family.`,
    ][v]);
    return out.join(' ');
  }

  if (lang === 'hi') {
    const noun = doc.purpose === 'marriage' ? (f ? 'लड़की' : 'लड़का') : 'व्यक्ति';
    out.push([
      `${name} एक ${joinList(traits, lang)} ${noun} है।`,
      `परिवार में ${name} को एक ${joinList(traits, lang)} ${noun} के रूप में जाना जाता है।`,
      `${name} ${joinList(traits, lang)} ${f ? 'है और सबका ख्याल रखती है' : 'है और सबका ख्याल रखता है'}।`,
    ][v]);
    if (edu) out.push(`${name} ने ${edu} की पढ़ाई पूरी की है।`);
    if (occ) out.push(`वर्तमान में ${city ? `${city} में ` : ''}${company ? `${company} में ` : ''}${occ} के रूप में कार्यरत हैं।`);
    if (hobbies) out.push(`उन्हें ${hobbies} का शौक है।`);
    if (doc.purpose === 'marriage') out.push([
      `${f ? 'वह परिवार को बहुत महत्व देती हैं और बड़ों का आदर करती हैं।' : 'वह परिवार को बहुत महत्व देते हैं और बड़ों का आदर करते हैं।'}`,
      'उनके लिए पारिवारिक मूल्य और आपसी सम्मान सबसे महत्वपूर्ण हैं।',
      `${f ? 'वह एक समझदार और सम्मान देने वाले जीवनसाथी की तलाश में हैं।' : 'वह एक समझदार और सम्मान देने वाली जीवनसाथी की तलाश में हैं।'}`,
    ][v]);
    return out.join(' ');
  }

  // Marathi
  const noun = doc.purpose === 'marriage' ? (f ? 'मुलगी' : 'मुलगा') : 'व्यक्ती';
  const ha = f ? 'ही' : 'हा';
  out.push([
    `${name} ${ha} एक ${joinList(traits, lang)} ${noun} आहे.`,
    `कुटुंबात ${name} एक ${joinList(traits, lang)} ${noun} म्हणून ${f ? 'ओळखली जाते' : 'ओळखला जातो'}.`,
    `${name} ${ha} ${joinList(traits, lang)} असून ${f ? 'सर्वांची काळजी घेते' : 'सर्वांची काळजी घेतो'}.`,
  ][v]);
  if (edu) out.push(`${f ? 'तिने' : 'त्याने'} ${edu} पूर्ण केले आहे.`);
  if (occ) out.push(`सध्या ${f ? 'ती' : 'तो'} ${city ? `${city} येथे ` : ''}${company ? `${company} मध्ये ` : ''}${occ} म्हणून कार्यरत आहे.`);
  if (hobbies) out.push(`${f ? 'तिला' : 'त्याला'} ${hobbies} यांची आवड आहे.`);
  if (doc.purpose === 'marriage') out.push([
    `${f ? 'ती कुटुंबाला खूप महत्त्व देते आणि मोठ्यांचा आदर करते.' : 'तो कुटुंबाला खूप महत्त्व देतो आणि मोठ्यांचा आदर करतो.'}`,
    `${f ? 'तिच्यासाठी' : 'त्याच्यासाठी'} कौटुंबिक मूल्ये आणि परस्पर आदर सर्वात महत्त्वाचे आहेत.`,
    `${f ? 'तिला समजूतदार आणि आदर करणारा जोडीदार हवा आहे.' : 'त्याला समजूतदार आणि आदर करणारी जोडीदार हवी आहे.'}`,
  ][v]);
  return out.join(' ');
}

export function writeExpectations(doc: Doc): string {
  const f = doc.gender === 'female';
  const v = doc.writerVariant % 2;
  if (doc.lang === 'en') return [
    `Looking for a well-educated, understanding and family-oriented ${f ? 'groom' : 'bride'} from a cultured family.`,
    `We are looking for a ${f ? 'groom' : 'bride'} who is educated, respects family values and has a positive outlook on life.`,
  ][v];
  if (doc.lang === 'hi') return [
    `संस्कारी परिवार से शिक्षित, समझदार और पारिवारिक मूल्यों को महत्व देने ${f ? 'वाला वर' : 'वाली वधू'}।`,
    `हमें ऐसे ${f ? 'वर' : 'वधू'} की तलाश है जो शिक्षित हो, पारिवारिक मूल्यों का सम्मान करे और जीवन के प्रति सकारात्मक सोच रखे।`,
  ][v];
  return [
    f
      ? 'सुसंस्कृत कुटुंबातील, सुशिक्षित, समजूतदार आणि कौटुंबिक मूल्ये जपणारा वर अपेक्षित.'
      : 'सुसंस्कृत कुटुंबातील, सुशिक्षित, समजूतदार आणि कौटुंबिक मूल्ये जपणारी वधू अपेक्षित.',
    f
      ? 'सुशिक्षित, कुटुंबाचा आदर करणारा आणि सकारात्मक विचारांचा वर अपेक्षित आहे.'
      : 'सुशिक्षित, कुटुंबाचा आदर करणारी आणि सकारात्मक विचारांची वधू अपेक्षित आहे.',
  ][v];
}

export function writeObjective(doc: Doc): string {
  const skills = doc.sections.find((s) => s.key === 'skills')?.body.split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 3) ?? [];
  const sk = skills.length ? joinList(skills, doc.lang) : '';
  const v = doc.writerVariant % 2;
  if (doc.lang === 'en') return [
    `To work in a reputed organisation where I can use my ${sk ? `skills in ${sk}` : 'skills and knowledge'}, keep learning, and grow along with the organisation.`,
    `Seeking a challenging role where my ${sk ? `experience in ${sk}` : 'hard work and dedication'} can add value to the team.`,
  ][v];
  if (doc.lang === 'hi') return [
    `एक प्रतिष्ठित संस्थान में कार्य करना, जहाँ मैं अपने ${sk ? `${sk} के कौशल` : 'कौशल और ज्ञान'} का उपयोग कर सकूँ और संस्थान के साथ आगे बढ़ सकूँ।`,
    `ऐसी भूमिका की तलाश, जहाँ मेरी ${sk ? `${sk} की योग्यता` : 'मेहनत और लगन'} टीम के लिए उपयोगी हो।`,
  ][v];
  return [
    `एका नामांकित संस्थेत काम करणे, जिथे मी माझ्या ${sk ? `${sk} या कौशल्यांचा` : 'कौशल्यांचा आणि ज्ञानाचा'} उपयोग करू शकेन आणि संस्थेसोबत प्रगती करू शकेन.`,
    `अशी भूमिका हवी आहे जिथे माझी ${sk ? `${sk} मधील पात्रता` : 'मेहनत आणि निष्ठा'} टीमसाठी उपयुक्त ठरेल.`,
  ][v];
}

export function writeDeclaration(doc: Doc): string {
  const f = doc.gender === 'female';
  if (doc.lang === 'en') return 'I hereby declare that all the information given above is true and correct to the best of my knowledge.';
  if (doc.lang === 'hi') return `मैं घोषणा ${f ? 'करती' : 'करता'} हूँ कि ऊपर दी गई सभी जानकारी मेरी जानकारी के अनुसार सत्य एवं सही है।`;
  return `मी जाहीर ${f ? 'करते' : 'करतो'} की वरील सर्व माहिती माझ्या माहितीनुसार खरी व बरोबर आहे.`;
}

export function writeFor(doc: Doc, sectionKey: string): string | null {
  switch (sectionKey) {
    case 'about': return writeAbout(doc);
    case 'expectations': return writeExpectations(doc);
    case 'objective': return writeObjective(doc);
    case 'declaration': return writeDeclaration(doc);
    default: return null;
  }
}
