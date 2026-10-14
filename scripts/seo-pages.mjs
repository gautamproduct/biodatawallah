// Builds static, crawlable landing pages (one per search intent) plus sitemap.xml and robots.txt into dist/.
// Set SITE_URL when the domain changes, e.g. SITE_URL=https://biodatawallah.com npm run build
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = (process.env.SITE_URL || 'https://gautamproduct.github.io/biodatawallah').replace(/\/$/, '');
const DIST = 'dist';
const today = new Date().toISOString().slice(0, 10);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PAGES = [
  {
    slug: 'marriage-biodata-format', lang: 'en', purpose: 'marriage',
    title: 'Marriage Biodata Format (Free Maker) — Hindi, Marathi, English',
    h1: 'Marriage biodata format that families actually use',
    desc: 'The standard marriage biodata format: personal details, education, family, horoscope and partner expectations. Make yours in 5 minutes in Hindi, Marathi or English.',
    intro: [
      'A marriage biodata is a one-page introduction that one family sends to another before a rishta goes ahead. Elders, the pandit and sometimes a marriage bureau will all read it, so it needs to be clear, respectful and complete.',
      'Most biodatas follow the same order. Start with an auspicious line (such as ॥ श्री गणेशाय नमः ॥), then the name and photo, then personal details, education and career, family details, horoscope details, a short “About me”, partner expectations and contact details.',
    ],
    list: ['Personal: full name, date, time and place of birth, height, diet, marital status', 'Education & career: degree, occupation, company, work city', 'Family: father’s and mother’s name and occupation, brothers, sisters, native place, family type', 'Horoscope: rashi, nakshatra, gotra, manglik (verify with your pandit)', 'About me and partner expectations: 3–5 warm, simple sentences', 'Contact: a parent’s name and mobile number'],
    tip: 'Keep it to one page. Leave out caste, income or address if you are not comfortable sharing them yet — you can add them later.',
    faq: [['How long should a marriage biodata be?', 'One A4 page. Families read it on a phone in WhatsApp first, so short and clear beats long.'], ['Should I add a photo?', 'Yes, a recent, clear photo with a plain background. You can also send a version without the photo to families you have not met yet.']],
  },
  {
    slug: 'biodata-for-marriage-for-girl', lang: 'en', purpose: 'marriage',
    title: 'Biodata for Marriage for Girl — Format, Sample & Free Maker',
    h1: 'Biodata for marriage for a girl',
    desc: 'A respectful marriage biodata format for a girl, with sample “About me” lines in Hindi, Marathi and English. Hide any detail you do not want to share.',
    intro: [
      'When parents make a biodata for their daughter, two things matter most: it should present her with dignity, and it should protect her privacy.',
      'Write about her education, work and nature in simple words. Avoid describing complexion or weight unless the family really wants to — many young women prefer to leave these out, and families respect that.',
    ],
    list: ['Sample “About me”: “Priya is a cultured, understanding and family-oriented girl. She has completed an MBA and works as a bank officer in Bhopal.”', 'Add her hobbies in one line (music, cooking, reading)', 'Partner expectations: education, values, location if important', 'Contact: father or mother, not her personal number'],
    tip: 'Biodata Wallah keeps the photo on your phone — it is never uploaded — and lets you download a version without the photo.',
    faq: [['Can I hide caste or income?', 'Yes. Caste, income and address are hidden by default. Tap the eye icon to show any of them.'], ['Can I write it in Hindi or Marathi?', 'Yes. The whole biodata, including the “About me” text we write for you, can be in Hindi, Marathi or English.']],
  },
  {
    slug: 'biodata-for-marriage-for-boy', lang: 'en', purpose: 'marriage',
    title: 'Biodata for Marriage for Boy — Format, Sample & Free Maker',
    h1: 'Biodata for marriage for a boy',
    desc: 'Marriage biodata format for a boy: career details, family background, horoscope and partner expectations. Ready-made sample lines in three languages.',
    intro: [
      'For a son’s biodata, families on the other side usually look first at education, job and family background. Put these near the top and keep them factual.',
      'Mention the work city clearly, since many families decide early on based on location. If he runs a family business, give the business type and city.',
    ],
    list: ['Education & career: degree, current role, company or business, work city', 'Family: parents’ occupations, siblings and whether they are married', 'Horoscope: rashi, nakshatra, gotra, manglik status', 'About me: 3–4 sentences about nature, values and interests', 'Partner expectations: education and values rather than long checklists'],
    tip: 'Use “Write it for me” to get a polished “About me” in Hindi, Marathi or English, then edit it in your own words.',
    faq: [['Should income be on the biodata?', 'It is optional. Many families share it later in conversation. On Biodata Wallah income is hidden by default.'], ['What photo works best?', 'A recent half-length photo in good light with a plain background.']],
  },
  {
    slug: 'marathi-biodata-format', lang: 'mr', purpose: 'marriage',
    title: 'मराठी लग्नाचा बायोडाटा फॉरमॅट — मोफत बनवा | Marathi Biodata Format',
    h1: 'मराठी लग्नाचा बायोडाटा फॉरमॅट',
    desc: 'लग्नासाठी मराठी बायोडाटा: वैयक्तिक माहिती, शिक्षण, कौटुंबिक माहिती, पत्रिका, आजोळ आणि अपेक्षा. 5 मिनिटांत तुमच्या भाषेत बनवा.',
    intro: [
      'मराठी लग्नाच्या बायोडाट्यात साधारणपणे सुरुवातीला “॥ श्री गणेशाय नमः ॥” लिहिले जाते, त्यानंतर नाव, फोटो आणि वैयक्तिक माहिती येते.',
      'मराठी कुटुंबांमध्ये मूळ गाव, आजोळ (मामा), कुलदैवत आणि पत्रिकेतील रास, नक्षत्र, गोत्र, मंगळ ही माहिती महत्त्वाची मानली जाते.',
    ],
    list: ['वैयक्तिक माहिती: संपूर्ण नाव, जन्म तारीख, जन्म वेळ, जन्म ठिकाण, उंची, रक्तगट', 'शिक्षण व व्यवसाय: पदवी, नोकरी/व्यवसाय, कामाचे ठिकाण', 'कौटुंबिक माहिती: वडील, आई, भाऊ, बहीण, मूळ गाव, आजोळ', 'पत्रिका माहिती: रास, नक्षत्र, गोत्र, मंगळ, गण, नाडी, कुलदैवत', 'माझ्याविषयी आणि जोडीदाराकडून अपेक्षा', 'संपर्क: वडिलांचे नाव आणि मोबाईल'],
    tip: '“माझ्यासाठी लिहा” दाबा — आम्ही “माझ्याविषयी” शुद्ध मराठीत लिहून देतो. तुम्ही तो हवा तसा बदलू शकता.',
    faq: [['बायोडाटा बनवणे मोफत आहे का?', 'होय. बनवणे आणि पूर्ण प्रीव्ह्यू पाहणे मोफत आहे. फक्त अंतिम PDF डाउनलोड करताना ₹49.'], ['फोटो सुरक्षित आहे का?', 'फोटो तुमच्या फोनमध्येच राहतो, कुठेही अपलोड होत नाही.']],
  },
  {
    slug: 'hindi-biodata-format', lang: 'hi', purpose: 'marriage',
    title: 'शादी का बायोडाटा हिंदी में — फॉर्मेट और मुफ़्त मेकर | Hindi Marriage Biodata',
    h1: 'शादी का बायोडाटा हिंदी में',
    desc: 'हिंदी में शादी का बायोडाटा फॉर्मेट: व्यक्तिगत जानकारी, शिक्षा, परिवार, कुंडली और अपेक्षाएँ। 5 मिनट में मोबाइल पर बनाएँ।',
    intro: [
      'शादी का बायोडाटा वह पहला परिचय है जो एक परिवार दूसरे परिवार को भेजता है। इसे बड़े-बुज़ुर्ग, पंडित जी और रिश्तेदार सब पढ़ते हैं, इसलिए यह साफ़, सम्मानजनक और पूरा होना चाहिए।',
      'आम तौर पर सबसे ऊपर “॥ श्री गणेशाय नमः ॥”, फिर नाम और फ़ोटो, फिर व्यक्तिगत जानकारी, शिक्षा एवं व्यवसाय, पारिवारिक जानकारी, कुंडली विवरण, मेरे बारे में और जीवनसाथी से अपेक्षाएँ लिखी जाती हैं।',
    ],
    list: ['व्यक्तिगत जानकारी: नाम, जन्म तिथि, जन्म समय, जन्म स्थान, ऊँचाई, भोजन', 'शिक्षा एवं व्यवसाय: डिग्री, नौकरी या व्यापार, कार्यस्थल', 'पारिवारिक जानकारी: पिता, माता, भाई-बहन, मूल निवास, ननिहाल', 'कुंडली विवरण: राशि, नक्षत्र, गोत्र, मांगलिक (पंडित जी से मिलान करें)', 'मेरे बारे में: 3–4 सरल वाक्य', 'संपर्क: पिता या माता का नाम और मोबाइल'],
    tip: 'टाइप करना मुश्किल लगे तो 🎤 दबाकर हिंदी में बोलें — अपने आप लिख जाएगा।',
    faq: [['क्या बनाना मुफ़्त है?', 'हाँ। बनाना और पूरा प्रीव्यू देखना मुफ़्त है। सिर्फ़ फ़ाइनल PDF डाउनलोड पर ₹49।'], ['क्या जाति और आय छुपा सकते हैं?', 'हाँ, ये पहले से छुपी रहती हैं। चाहें तो आँख का निशान दबाकर दिखाएँ।']],
  },
  {
    slug: 'jain-marriage-biodata', lang: 'en', purpose: 'marriage',
    title: 'Jain Marriage Biodata Format — Sect, Mosal & Jain Food | Free Maker',
    h1: 'Jain marriage biodata format',
    desc: 'Jain biodata with the fields Jain families expect: sect (Derasar, Sthanakvasi, Terapanthi, Digambar), native place, mosal and Jain food. Opens with “Jai Jinendra”.',
    intro: [
      'Jain families usually open a biodata with “॥ जय जिनेंद्र ॥” and look for a few details that general templates miss.',
      'Mention the sect, the native place and the mosal (mother’s side family), and say clearly whether the family follows Jain food without root vegetables. Many samaj meets also ask for these details in their booklets.',
    ],
    list: ['Sect: Shwetambar Murtipujak (Derasar), Sthanakvasi, Terapanthi or Digambar', 'Diet: Jain food (no root vegetables) or vegetarian', 'Native place and mosal (mama’s family and town)', 'Education, profession or family business', 'Family details and contact'],
    tip: 'Choose “Jain” when you start — the right fields and the opening line are added for you.',
    faq: [['Is kundli needed in a Jain biodata?', 'It is optional. The horoscope section is included; hide it from the menu if your family does not use it.'], ['Can it be in Gujarati?', 'Gujarati is coming soon. Hindi, Marathi and English work today.']],
  },
  {
    slug: 'muslim-marriage-biodata', lang: 'en', purpose: 'marriage',
    title: 'Muslim Marriage Biodata Format (Nikah) — Free Maker in Hindi & English',
    h1: 'Muslim marriage biodata format for nikah',
    desc: 'A respectful Muslim biodata format with maslak / sect, family background and education. Opens with Bismillah. Share a version without the photo.',
    intro: [
      'A Muslim marriage biodata usually opens with “Bismillah-ir-Rahman-ir-Rahim” and focuses on family background, education, occupation and values.',
      'Add the maslak or sect if it matters to your family, and describe the family in a few lines. Many families prefer to share the photo only after the first conversation — you can download a version without it.',
    ],
    list: ['Personal: name, date of birth, height, marital status', 'Maslak / sect (e.g. Sunni Hanafi, Shia)', 'Education and occupation', 'Family: father’s and mother’s name and occupation, siblings, native place', 'About me and expectations', 'Contact of a parent or elder'],
    tip: 'Choosing “Muslim” removes the horoscope section and adds the maslak field.',
    faq: [['Can I make it in Urdu?', 'Urdu is on our list. Today you can make it in Hindi or English.'], ['Is my data private?', 'Yes — everything stays on your phone. Nothing is uploaded.']],
  },
  {
    slug: 'biodata-format-with-kundli', lang: 'hi', purpose: 'marriage',
    title: 'कुंडली के साथ बायोडाटा फॉर्मेट — राशि, नक्षत्र, गोत्र, मांगलिक',
    h1: 'कुंडली विवरण के साथ बायोडाटा',
    desc: 'बायोडाटा में कुंडली विवरण कैसे लिखें: राशि, नक्षत्र, गोत्र, मांगलिक, गण, नाड़ी। सूची से चुनें, पंडित जी से मिलान करें।',
    intro: [
      'बहुत से परिवार बायोडाटा में ही कुंडली की मुख्य जानकारी देते हैं, ताकि पंडित जी पहले ही गुण मिलान देख सकें।',
      'जन्म तिथि के साथ जन्म समय और जन्म स्थान सही-सही लिखें। राशि, नक्षत्र और गोत्र अपनी पत्रिका से देखकर भरें।',
    ],
    list: ['जन्म तिथि, जन्म समय, जन्म स्थान', 'राशि और नक्षत्र (सूची से चुनें)', 'गोत्र (परिवार से — यह गणना से नहीं निकलता)', 'मांगलिक: हाँ / नहीं / आंशिक', 'गण और नाड़ी (वैकल्पिक)', 'कुलदेवता / कुलदेवी'],
    tip: 'कुंडली की जानकारी हमेशा अपने पंडित जी से मिलान करके ही भेजें।',
    faq: [['क्या कुंडली अपने आप बनती है?', 'अभी नहीं। आप अपनी पत्रिका से सूची में चुनें — इससे गलती की संभावना कम रहती है।'], ['क्या कुंडली वाला भाग हटा सकते हैं?', 'हाँ, “और विकल्प” से भाग छुपाएँ या हटाएँ।']],
  },
  {
    slug: 'biodata-banao', lang: 'hi', purpose: 'marriage',
    title: 'बायोडाटा बनाओ — मोबाइल पर 5 मिनट में | शादी, नौकरी, सामान्य',
    h1: 'बायोडाटा बनाओ — मोबाइल पर, 5 मिनट में',
    desc: 'शादी, नौकरी या सामान्य बायोडाटा बनाओ हिंदी, मराठी या अंग्रेज़ी में। मुफ़्त में बनाओ, पूरा देखो, सिर्फ़ डाउनलोड पर ₹49।',
    intro: [
      'बायोडाटा बनाने के लिए अब दुकान जाने या किसी रिश्तेदार से Word फ़ाइल बनवाने की ज़रूरत नहीं।',
      'आसान सवाल भरिए (या बोलकर लिखिए), “मेरे बारे में” हम लिख देंगे, डिज़ाइन भी अपने आप चुना जाएगा। पूरा बायोडाटा पहले देखिए, परिवार को भेजिए, फिर डाउनलोड कीजिए।',
    ],
    list: ['शादी का बायोडाटा — कुंडली, परिवार, समाज के अनुसार', 'नौकरी का बायोडाटा / रिज़्यूमे — फ्रेशर, प्राइवेट या सरकारी', 'सामान्य बायोडाटा — स्कूल, कॉलेज, फ़ॉर्म', '30 तैयार डिज़ाइन, WhatsApp के लिए फ़ोटो भी'],
    tip: 'आपकी जानकारी और फ़ोटो आपके फ़ोन में ही रहती है — कहीं अपलोड नहीं होती।',
    faq: [['पैसे कब देने होते हैं?', 'सिर्फ़ फ़ाइनल PDF और WhatsApp फ़ोटो डाउनलोड करते समय, एक बार ₹49।'], ['बाद में बदलाव कर सकते हैं?', 'हाँ, 90 दिन तक मुफ़्त बदलाव और दोबारा डाउनलोड।']],
  },
  {
    slug: 'biodata-format-for-job', lang: 'en', purpose: 'job',
    title: 'Biodata Format for Job — Fresher & Experienced | Free Maker',
    h1: 'Biodata format for a job',
    desc: 'Simple biodata format for job applications: career objective, personal details, education, experience, skills and declaration. In English, Hindi or Marathi.',
    intro: [
      'Many employers, especially for government jobs, factories, security, driving and office roles, still ask for a “biodata” rather than a long resume.',
      'A job biodata is short and factual: a one-line objective, personal details including father’s name, education with year and marks, work experience, skills, and a signed declaration.',
    ],
    list: ['Career objective (we can write it for you)', 'Personal details: name, father’s name, date of birth, marital status, languages, phone, address', 'Education: degree / class, board or university, year, percentage', 'Work experience: role, company, years', 'Skills and achievements', 'Declaration with place and date'],
    tip: 'Freshers: put education first and add internships, training or projects under experience.',
    faq: [['Biodata or resume — which one?', 'For government and many local jobs, a biodata. For corporate jobs, a resume. Our “Professional” and “Classic Resume” designs work for both.'], ['Can I make it in Hindi?', 'Yes, every section and the declaration can be in Hindi or Marathi.']],
  },
  {
    slug: 'biodata-for-job-fresher', lang: 'en', purpose: 'job',
    title: 'Biodata for Job Fresher — Simple Format with Sample',
    h1: 'Biodata for a job fresher',
    desc: 'A fresher biodata that gets read: objective, education with marks, training and skills. Sample lines included. Make it on your phone in minutes.',
    intro: [
      'As a fresher, your education and skills are your strongest points. Put them first and keep everything on one page.',
      'List every qualification with the year and percentage. Add internships, apprenticeships, training courses and college projects under “Work experience”.',
    ],
    list: ['Objective: “To start my career in a reputed organisation where I can use my skills and keep learning.”', 'Education: latest first, with year and marks', 'Skills: computer, languages, tools you know', 'Training, internships, certificates', 'Hobbies (optional) and declaration'],
    tip: 'Use the same email and phone number on every application, and check them twice.',
    faq: [['Should a fresher add a photo?', 'If the job form asks for it, yes — a clear passport-style photo.'], ['How many pages?', 'One page is ideal for freshers.']],
  },
  {
    slug: 'how-to-write-about-me-in-biodata', lang: 'en', purpose: 'marriage',
    title: 'How to Write “About Me” in a Marriage Biodata (with Examples)',
    h1: 'How to write “About me” in a biodata',
    desc: 'Simple, respectful “About me” examples for a marriage biodata in English, Hindi and Marathi — and a tool that writes it for you.',
    intro: [
      '“About me” is the part most families find hardest to write. Keep it to 3–5 sentences: who the person is, what they do, what they enjoy and what they value.',
      'Pick 2–4 qualities that are genuinely true (for example: cultured, understanding, cheerful, family-oriented). Avoid long lists and avoid words about complexion.',
    ],
    list: ['English: “Rahul is a cheerful and family-oriented boy. He is a Chartered Accountant with his own practice in Ahmedabad. He enjoys cricket and travelling.”', 'हिंदी: “प्रिया एक संस्कारी और समझदार लड़की है। उन्होंने एमबीए किया है और भोपाल में बैंक अधिकारी हैं।”', 'मराठी: “स्नेहा ही एक संस्कारी आणि हसतमुख मुलगी आहे. ती पुण्यात सॉफ्टवेअर इंजिनिअर आहे.”'],
    tip: 'On Biodata Wallah, tap “Write it for me”, choose a few qualities, and edit the text until it sounds like your family.',
    faq: [['Should it be written by parents or by the person?', 'Either is fine. Third person (“Priya is…”) is the most common in family-made biodatas.'], ['How long should it be?', '3–5 sentences, about 60–90 words.']],
  },
];

const css = `*{box-sizing:border-box}body{margin:0;background:#fff;color:#0e0e12;font:17px/1.65 Inter,'Anek Devanagari','Noto Sans Devanagari',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
.glow{position:absolute;inset:0 0 auto;height:520px;z-index:-1;background:radial-gradient(520px 320px at 80% 10%,rgba(255,122,89,.18),transparent 70%),radial-gradient(480px 300px at 15% 0,rgba(229,51,107,.14),transparent 70%)}
header{max-width:860px;margin:12px auto 0;padding:10px 12px 10px 16px;display:flex;justify-content:space-between;align-items:center;border:1px solid rgba(14,14,18,.06);border-radius:999px;background:rgba(255,255,255,.85);box-shadow:0 6px 24px rgba(14,14,18,.06)}
a.brand{display:inline-flex;gap:9px;align-items:center;color:#0e0e12;text-decoration:none;font-weight:700;letter-spacing:-.02em}
a.brand span{width:30px;height:30px;border-radius:9px;background:linear-gradient(100deg,#e5336b,#ff6a5c 55%,#ff9a4d);color:#fff;display:grid;place-items:center;font-weight:700}
a.brand b{color:#e5336b}
main{max-width:760px;margin:0 auto;padding:36px 20px 56px;position:relative}
h1{font-weight:800;font-size:clamp(32px,6vw,48px);line-height:1.12;letter-spacing:-.035em;margin:0 0 16px}
h2{font-weight:700;font-size:24px;letter-spacing:-.02em;margin:36px 0 12px}
p{color:#3c3c46}
.cta{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(100deg,#e5336b,#ff6a5c 55%,#ff9a4d);color:#fff;padding:14px 26px;border-radius:999px;text-decoration:none;font-weight:700;box-shadow:0 10px 24px rgba(229,51,107,.3);margin:8px 0}
.cta.small{padding:9px 16px;font-size:15px;box-shadow:none;margin:0}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 6px;padding:0;list-style:none}
.chips li{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid #e8e8ee;border-radius:999px;padding:5px 12px;font-size:14px;font-weight:600;box-shadow:0 2px 8px rgba(14,14,18,.05)}
.chips li i{width:18px;height:18px;border-radius:999px;display:inline-block;background:linear-gradient(135deg,#22c55e,#059669)}
ul.list{padding-left:20px}ul.list li{margin:8px 0;color:#3c3c46}
.note{background:#f5f5f7;border-radius:16px;padding:14px 16px;color:#3c3c46}
details{border-bottom:1px solid #e8e8ee}summary{cursor:pointer;font-weight:600;padding:16px 0;list-style:none}summary::-webkit-details-marker{display:none}details p{margin:0 0 16px}
nav.more{display:flex;flex-wrap:wrap;gap:8px}nav.more a{display:inline-block;padding:7px 14px;border-radius:999px;background:#f5f5f7;color:#3c3c46;text-decoration:none;font-size:14.5px;font-weight:500}
footer{color:#73737f;font-size:14px;margin-top:40px;border-top:1px solid #e8e8ee;padding-top:16px}`;

const CTA_SHORT = { en: 'Make biodata', hi: 'बायोडाटा बनाएँ', mr: 'बायोडाटा बनवा' };
const TRUST = { en: ['Data stays private', 'No login', 'See first, pay later', 'Refund guarantee'], hi: ['डेटा सुरक्षित', 'लॉगिन नहीं', 'पहले देखें', 'पैसे वापसी'], mr: ['डेटा सुरक्षित', 'लॉगिन नाही', 'आधी पाहा', 'पैसे परत'] };
const CTA = { en: 'Make biodata — free', hi: 'बायोडाटा बनाएँ — मुफ़्त', mr: 'बायोडाटा बनवा — मोफत' };
const INCLUDE = { en: 'What to include', hi: 'क्या-क्या लिखें', mr: 'काय काय लिहावे' };
const FAQ = { en: 'Common questions', hi: 'अक्सर पूछे जाने वाले सवाल', mr: 'नेहमीचे प्रश्न' };
const MORE = { en: 'More biodata guides', hi: 'और जानकारी', mr: 'आणखी माहिती' };
const PRICE = { en: 'Free to make and preview. ₹49 only when you download · Secure UPI via Razorpay · No hidden charges · Refund if any problem.', hi: 'बनाना और देखना मुफ़्त। सिर्फ़ डाउनलोड पर ₹49 · Razorpay से सुरक्षित UPI · कोई छुपा शुल्क नहीं · दिक्कत पर पैसे वापस।', mr: 'बनवणे आणि पाहणे मोफत. फक्त डाउनलोडसाठी ₹49 · Razorpay द्वारे सुरक्षित UPI · छुपे शुल्क नाहीत · अडचणीत पैसे परत.' };

function page(p) {
  const url = `${SITE}/${p.slug}/`;
  const app = `../#/start/${p.purpose}`;
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  const others = PAGES.filter((x) => x.slug !== p.slug).slice(0, 8);
  return `<!doctype html>
<html lang="${p.lang}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#ffffff">
<meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:url" content="${url}"><meta property="og:type" content="article">
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<style>${css}</style>
</head>
<body><div class="glow"></div>
<header><a class="brand" href="../"><span>ब</span>Biodata <b>Wallah</b></a><a class="cta small" href="${app}">${CTA_SHORT[p.lang]}</a></header>
<main>
<h1>${esc(p.h1)}</h1>
<ul class="chips">${TRUST[p.lang].map((t) => `<li><i></i>${t}</li>`).join('')}</ul>
${p.intro.map((x) => `<p>${esc(x)}</p>`).join('\n')}
<a class="cta" href="${app}">${CTA[p.lang]} →</a>
<p class="note">${PRICE[p.lang]}</p>
<h2>${INCLUDE[p.lang]}</h2>
<ul class="list">${p.list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
<p class="note">${esc(p.tip)}</p>
<h2>${FAQ[p.lang]}</h2>
${p.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
<p><a class="cta" href="${app}">${CTA[p.lang]} →</a></p>
<h2>${MORE[p.lang]}</h2>
<nav class="more">${others.map((x) => `<a href="../${x.slug}/">${esc(x.h1)}</a>`).join('')}</nav>
<footer>© ${new Date().getFullYear()} Biodata Wallah</footer>
</main></body></html>`;
}

for (const p of PAGES) {
  const dir = join(DIST, p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p));
}

// Point the app's canonical and OG URLs at the current site address.
const indexPath = join(DIST, 'index.html');
writeFileSync(indexPath, readFileSync(indexPath, 'utf8').replaceAll('https://biodatawallah.com/', `${SITE}/`));

const urls = ['', ...PAGES.map((p) => `${p.slug}/`)];
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}/${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(join(DIST, '.nojekyll'), '');
writeFileSync(join(DIST, '404.html'), `<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Biodata Wallah</title><meta name="robots" content="noindex"><style>${css}</style></head><body><div class="glow"></div><main style="text-align:center;padding-top:80px"><h1>पेज नहीं मिला</h1><p>Page not found. यह पेज मौजूद नहीं है।</p><a class="cta" href="${SITE}/">होम पर जाएँ · Go home →</a></main></body></html>`);
console.log(`SEO: ${PAGES.length} pages + sitemap for ${SITE}`);
