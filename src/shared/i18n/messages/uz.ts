// Source dictionary. Every other language must match this shape exactly
// (checked with `satisfies Messages`), so a missing translation fails typecheck.
// Values are plain strings; `{name}` placeholders are filled by `format()`.
const uz = {
  meta: {
    title: "RootY Team — Veb-ilovalar xavfsizligi",
    description:
      "Veb-ilovalar xavfsizligini amaliyotda o‘rganing: interaktiv darslar, laboratoriyalar, testlar va topshiriqlar.",
  },
  nav: {
    home: "Bosh sahifa",
    learn: "Darslar",
    labs: "Laboratoriyalar",
    ctf: "CTF",
    login: "Kirish",
    start: "Boshlash",
    menu: "Menyu",
    skip: "Asosiy mazmunga o‘tish",
    logout: "Chiqish",
    admin: "Admin panel",
  },
  theme: {
    label: "Mavzu",
    light: "Yorug‘",
    dark: "Qorong‘i",
  },
  language: {
    label: "Til",
  },
  home: {
    kicker: "Haqiqiy dunyo uchun haqiqiy ko‘nikmalar",
    // Three headline lines; the middle one carries the gradient.
    title1: "Kiberxavfsizlikni",
    title2: "amaliy tarzda",
    title3: "o‘rganing",
    lead: "Nazariyadan ko‘ra ko‘proq amaliyot. Interaktiv darslar, xavfsiz laboratoriyalar va testlar bilan veb-xavfsizlik sohasida o‘z yo‘lingizni boshlang.",
    start: "Kursni boshlash",
    how: "Metod bilan tanishish",
    features: {
      labs: { title: "Amaliy laboratoriyalar", text: "Xavfsiz muhit, real ssenariylar" },
      teacher: { title: "O‘qituvchi nazorati", text: "Topshiriqlar tekshirib boriladi" },
      langs: { title: "To‘rt tilda", text: "O‘zbek, qoraqalpoq, rus, ingliz" },
    },
    methodStamp: "Metod",
    methodTitle: "Har bir dars besh qadamdan iborat",
    methodLead:
      "Avval nima uchun muhimligini tushunasiz, keyin o‘z qo‘lingiz bilan sinab ko‘rasiz va bilimingizni mustahkamlaysiz.",
    steps: {
      theory: {
        title: "Tushuncha",
        text: "Mavzu hayotiy o‘xshatish va sodda tilda tushuntiriladi.",
      },
      interactive: {
        title: "Jonli misol",
        text: "Brauzerdagi interaktiv vizualizatsiya bilan jarayonni ko‘rasiz.",
      },
      lab: {
        title: "Laboratoriya",
        text: "Xavfsiz muhitda zaiflikni topasiz va uni tuzatasiz.",
      },
      test: {
        title: "Test",
        text: "Qisqa savollar bilan tushunganingizni tekshirasiz.",
      },
      task: {
        title: "Topshiriq",
        text: "Mustaqil vazifa — o‘qituvchi natijangizni ko‘radi.",
      },
    },
    lab: {
      stamp: "Laboratoriya",
      title1: "Zaiflikni toping,",
      title2: "keyin yoping.",
      lead: "Nazariya yetarli emas. Har bir mavzuda siz hujumni xavfsiz muhitda o‘zingiz bajarasiz, keyin kodni tuzatib, himoya ishlayotganini tekshirasiz.",
      p1: "Har bir laboratoriya izolyatsiya qilingan muhitda ishlaydi",
      p2: "Avval hujum, keyin tuzatish va qayta tekshiruv",
      p3: "Faqat o‘quv maqsadida — haqiqiy saytlarga tegilmaydi",
      cta: "Jonli misolni ochish",
      ready: "Laboratoriya tayyor: lab.rooty.local",
      vuln: "Barcha yozuvlar qaytdi — SQL injection",
      fix: "Tuzatish: parametrli so‘rov (prepared statement)",
      ok: "Zaiflik yopildi. Laboratoriya topshirildi.",
    },
    lessonsStamp: "Darslar",
    latestTitle: "Yo‘lni HTTP’dan boshlang",
    allLessons: "Barcha darslar",
    soonTitle: "Yangi darslar yo‘lda",
    soonText: "Keyingi mavzular tayyorlanmoqda.",
    cta: {
      title1: "Kiberxavfsizlik yo‘lingizni",
      title2: "bugun boshlang.",
      text: "Kirish uchun login va parolni o‘qituvchingiz beradi. Hisobingiz bo‘lsa — darslar sizni kutmoqda.",
      button: "Darsni boshlash",
    },
  },
  learn: {
    title: "Darslar",
    lead: "Yo‘nalishni tanlang. Har bir yo‘nalishdagi darslar ketma-ket o‘tiladi: har bir dars oldingisiga tayanadi.",
    tracks: "Yo‘nalishlar: {n}",
    allTracks: "Barcha yo‘nalishlar",
    soon: "Tez kunda",
    lessons: "Darslar soni: {n}",
    empty: "Hozircha darslar yo‘q. Tez orada qo‘shiladi.",
    open: "Darsni ochish",
  },
  level: {
    beginner: "Boshlang‘ich",
    intermediate: "O‘rta",
    advanced: "Yuqori",
  },
  lesson: {
    contents: "Mundarija",
    goals: "Bu darsdan keyin siz:",
    terms: "Yangi so‘zlar",
    steps: "O‘zingiz bajaring",
    output: "Ekranda chiqadi",
    summary: "Esda tuting",
    previous: "Oldingi dars",
    next: "Keyingi dars",
    check: "Tekshirish",
    correct: "To‘g‘ri!",
    wrong: "Noto‘g‘ri. Yana urinib ko‘ring.",
    retry: "Qaytadan",
    selfCheck: "O‘zingizni tekshiring",
  },
  callout: {
    info: "Eslatma",
    tip: "Maslahat",
    warn: "Diqqat",
  },
  soon: {
    title: "Tez orada",
    text: "Bu bo‘lim tayyorlanmoqda.",
  },
  footer: {
    sections: "Bo‘limlar",
    ethicsTitle: "Etika",
    tagline: "Veb-ilovalar xavfsizligini amaliyot orqali o‘rgatamiz.",
    ethics: "Barcha mashqlar faqat o‘quv maqsadida va ruxsat berilgan muhitda bajariladi.",
    status: "Barcha tizimlar ishlayapti",
    session: "Sessiya",
  },
  auth: {
    title: "Tizimga kirish",
    lead: "Login va parolni o‘qituvchingiz beradi.",
    login: "Login",
    password: "Parol",
    submit: "Kirish",
    pending: "Tekshirilmoqda…",
    show: "Parolni ko‘rsatish",
    invalid: "Login yoki parol noto‘g‘ri.",
    tooMany: "Urinishlar juda ko‘p. 15 daqiqadan keyin qayta urinib ko‘ring.",
    inactive: "Hisobingiz o‘chirilgan. O‘qituvchingizga murojaat qiling.",
    unavailable: "Server bilan bog‘lanib bo‘lmadi. Birozdan keyin urinib ko‘ring.",
    noAccount: "Hisobingiz yo‘qmi? Uni o‘qituvchingiz ochib beradi.",
    signedInAs: "Siz tizimdasiz:",
  },
  progress: {
    complete: "Darsni yakunladim",
    completed: "Dars yakunlandi",
    saving: "Saqlanmoqda…",
    signIn: "Natijangiz saqlanishi uchun tizimga kiring.",
    tracked: "Natijangiz saqlanmoqda.",
  },
  notFound: {
    title: "Sahifa topilmadi",
    text: "Bu manzil mavjud emas yoki ko‘chirilgan.",
    home: "Bosh sahifaga qaytish",
  },
};

export type Messages = typeof uz;
export default uz;
