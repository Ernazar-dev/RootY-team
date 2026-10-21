import type { Localized } from "@/shared/i18n/config";

// Hands-on labs on /[locale]/labs. A lab with `open: false` is listed as
// "coming soon" and not linked. The slug is the URL (/[locale]/labs/<slug>),
// so never rename it once published.

export interface Lab {
  slug: string;
  /** Position on the labs page; lower comes first. */
  order: number;
  open: boolean;
  title: Localized;
  summary: Localized;
  /** Short topic chips shown on the card. */
  topics: Localized[];
}

export const labsIntro = {
  eyebrow: { uz: "Amaliy laboratoriyalar", kaa: "Ámeliy laboratoriyalar", ru: "Практические лаборатории", en: "Hands-on labs" },
  lead: {
    uz: "O‘qib emas, qilib o‘rganing. Har bir laboratoriya — tarix, interaktiv asbob va o‘zingizni tekshiradigan mashqlar. Hammasi brauzerda, hech narsa o‘rnatish shart emas.",
    kaa: "Oqıp emes, islep úyreniń. Hár bir laboratoriya — tariyx, interaktiv qural hám ózińizdi tekseretuǵın shınıǵıwlar. Hámmesi brauzerde, hesh nárse ornatıw shárt emes.",
    ru: "Учитесь делом, а не чтением. В каждой лаборатории — история, интерактивный инструмент и упражнения для самопроверки. Всё в браузере, ничего устанавливать не нужно.",
    en: "Learn by doing, not just reading. Each lab has the story, an interactive tool and exercises to check yourself. Everything runs in the browser — nothing to install.",
  },
  soon: { uz: "Tez orada", kaa: "Jaqın arada", ru: "Скоро", en: "Coming soon" },
  open: { uz: "Ochiq", kaa: "Ashıq", ru: "Открыто", en: "Open" },
  allLabs: { uz: "Barcha laboratoriyalar", kaa: "Barlıq laboratoriyalar", ru: "Все лаборатории", en: "All labs" },
} satisfies Record<string, Localized>;

const all: Lab[] = [
  {
    slug: "crypto",
    order: 1,
    open: true,
    title: { uz: "Kriptografiya", kaa: "Kriptografiya", ru: "Криптография", en: "Cryptography" },
    summary: {
      uz: "2600 yillik sirlar: Sparta tayoqchasidan Enigma, RSA va AES’gacha. 16 ta shifr va algoritm: animatsiya, asbob va mashqlar bilan.",
      kaa: "2600 jıllıq sırlar: Sparta tayaqshasınan Enigma, RSA hám AES’ke shekem. 16 shifr hám algoritm: animaciya, qural hám shınıǵıwlar menen.",
      ru: "2600 лет секретов: от спартанского жезла до «Энигмы», RSA и AES. 16 шифров и алгоритмов — с анимацией, инструментом и упражнениями.",
      en: "2,600 years of secrets: from the Spartan rod to Enigma, RSA and AES. 16 ciphers and algorithms, each with an animation, a tool and exercises.",
    },
    topics: [
      { uz: "Sezar", kaa: "Sezar", ru: "Цезарь", en: "Caesar" },
      { uz: "AES", kaa: "AES", ru: "AES", en: "AES" },
      { uz: "RSA", kaa: "RSA", ru: "RSA", en: "RSA" },
      { uz: "Enigma", kaa: "Enigma", ru: "Энигма", en: "Enigma" },
      { uz: "Diffie–Hellman", kaa: "Diffie–Hellman", ru: "Диффи — Хеллман", en: "Diffie–Hellman" },
    ],
  },
  {
    slug: "linux",
    order: 2,
    open: false,
    title: { uz: "Linux va terminal", kaa: "Linux hám terminal", ru: "Linux и терминал", en: "Linux and the terminal" },
    summary: {
      uz: "Brauzerdagi terminal: fayllar, ruxsatlar, jurnallar va kichik tergov topshiriqlari.",
      kaa: "Brauzerdegi terminal: fayllar, ruxsatlar, jurnallar hám kishi tergew tapsırmaları.",
      ru: "Терминал в браузере: файлы, права, журналы и небольшие расследования.",
      en: "A terminal in your browser: files, permissions, logs and small investigations.",
    },
    topics: [],
  },
  {
    slug: "network",
    order: 3,
    open: false,
    title: { uz: "Tarmoqlar", kaa: "Tarmaqlar", ru: "Сети", en: "Networking" },
    summary: {
      uz: "IP manzil, DNS, portlar va paket qanday yo‘l bosishini simulyatorda ko‘ring.",
      kaa: "IP mánzil, DNS, portlar hám paket qanday jol basıp ótetuǵının simulyatorda kóriń.",
      ru: "IP-адреса, DNS, порты и путь пакета — в симуляторе.",
      en: "IP addresses, DNS, ports and a packet’s journey — in a simulator.",
    },
    topics: [],
  },
  {
    slug: "web",
    order: 4,
    open: false,
    title: { uz: "Veb-zaifliklar", kaa: "Veb-álsizlikler", ru: "Веб-уязвимости", en: "Web vulnerabilities" },
    summary: {
      uz: "XSS, SQL inyeksiya va IDOR’ni xavfsiz sandbox’da toping va tuzating.",
      kaa: "XSS, SQL inyekciya hám IDOR’dı qáwipsiz sandbox’ta tabıń hám dúzetiń.",
      ru: "Находите и исправляйте XSS, SQL-инъекции и IDOR в безопасной песочнице.",
      en: "Find and fix XSS, SQL injection and IDOR in a safe sandbox.",
    },
    topics: [],
  },
];

export const labs = [...all].sort((a, b) => a.order - b.order);

export function getLab(slug: string) {
  return labs.find((lab) => lab.slug === slug);
}
