import type { Localized } from "@/shared/i18n/config";

// The CTF arena: several tracks (OSINT, Web, Forensics, Crypto), each with
// self-contained, offline challenges. A challenge shows a story and some
// "evidence" (synthetic data) and asks for a flag in the form ROOTY{...}.
//
// Flags are NEVER in this file or anywhere the browser can read them: the
// answers live in src/backend/ctf/flags.ts and are checked by a server
// action. This file only holds what a solver is allowed to see.

export const trackIds = ["osint", "web", "forensics", "crypto"] as const;
export type CtfTrackId = (typeof trackIds)[number];

export type Difficulty = 1 | 2 | 3;

/** A file shown in the challenge's evidence viewer. */
export interface Evidence {
  name: string;
  /** Lines of the file, shown with line numbers in a monospace panel. */
  lines: string[];
}

export interface Challenge {
  id: string;
  track: CtfTrackId;
  /** Order within the track; lower comes first. */
  order: number;
  points: number;
  difficulty: Difficulty;
  title: Localized;
  /** The scenario and what to look for. */
  brief: Localized;
  evidence: Evidence[];
  /**
   * Real files the solver downloads and analyses locally (strings, exiftool,
   * binwalk, unzip…). `href` is served from /public. Unlike `evidence`, the
   * flag is actually inside these bytes — this is a genuine offline artefact.
   */
  files?: { name: string; href: string; size?: string; note?: Localized }[];
  /** Each hint costs points; revealed one at a time. */
  hints: Localized[];
  /** Shown after solving: the lesson behind the challenge. */
  takeaway: Localized;
  /**
   * Step-by-step walkthrough, revealed only after the flag is found (or the
   * solver gives up). Each entry is one step: how the flag is found and what
   * to do with the key. Markdown-lite (`**bold**`, `` `code` ``) via <Rich>.
   */
  solution?: Localized[];
}

export interface CtfTrack {
  id: CtfTrackId;
  order: number;
  title: Localized;
  tagline: Localized;
  intro: Localized;
}

export const tracks: CtfTrack[] = [
  {
    id: "osint",
    order: 1,
    title: { uz: "OSINT", kaa: "OSINT", ru: "OSINT", en: "OSINT" },
    tagline: {
      uz: "Ochiq manbalardan tergov: izlar hamma joyda.",
      kaa: "Ashıq derekler arqalı tergew: izler hámme jerde.",
      ru: "Разведка по открытым источникам: следы повсюду.",
      en: "Open-source intelligence: the traces are everywhere.",
    },
    intro: {
      uz: "OSINT — ochiq, qonuniy manbalardan ma’lumot yig‘ish san’ati: ijtimoiy tarmoqlar, metadata, DNS yozuvlari. Hech narsa buzilmaydi — faqat e’tiborli bo‘lish kerak.",
      kaa: "OSINT — ashıq, nızamlı dereklerden maǵlıwmat jıynaw óneri: social tarmaqlar, metadata, DNS jazıwları. Hesh nárse buzılmaydı — tek itibarlı bolıw kerek.",
      ru: "OSINT — искусство собирать данные из открытых, легальных источников: соцсети, метаданные, DNS-записи. Ничего не ломается — нужна лишь внимательность.",
      en: "OSINT is the craft of gathering data from open, legal sources: social media, metadata, DNS records. Nothing gets hacked — you just pay attention.",
    },
  },
  {
    id: "web",
    order: 2,
    title: { uz: "Web", kaa: "Web", ru: "Web", en: "Web" },
    tagline: {
      uz: "Brauzer ko‘rsatmaganini manbadan toping.",
      kaa: "Brauzer kórsetpegenin derekten tabıń.",
      ru: "Найдите в исходнике то, что браузер не показал.",
      en: "Find in the source what the browser didn’t show.",
    },
    intro: {
      uz: "Web topshiriqlarida HTTP javoblari, cookie’lar, tokenlar va sahifa manbasi bilan ishlaysiz. Ekranda ko‘rinmagan narsa — ko‘pincha eng muhimi.",
      kaa: "Web tapsırmalarında HTTP juwapları, cookie’ler, tokenler hám bet deregi menen islesiz. Ekranda kórinbegen nárse — kóbinese eń áhmiyetlisi.",
      ru: "В веб-заданиях вы работаете с HTTP-ответами, cookie, токенами и исходником страницы. То, чего не видно на экране, — часто самое важное.",
      en: "Web challenges work with HTTP responses, cookies, tokens and page source. What isn’t visible on screen is often what matters most.",
    },
  },
  {
    id: "forensics",
    order: 3,
    title: { uz: "Forensika", kaa: "Forensika", ru: "Форензика", en: "Forensics" },
    tagline: {
      uz: "Jurnallar va baytlar voqeani aytib beradi.",
      kaa: "Jurnallar hám baytlar waqıyanı aytıp beredi.",
      ru: "Журналы и байты расскажут, что случилось.",
      en: "Logs and bytes tell you what happened.",
    },
    intro: {
      uz: "Forensika — raqamli izlardan voqeani tiklash: kim, qachon, nima qildi. Jurnal fayllari, xom baytlar va vaqt belgilaridan dalil chiqarasiz.",
      kaa: "Forensika — sanlı izlerden waqıyanı tiklew: kim, qashan, ne qıldı. Jurnal faylları, xam baytlar hám waqıt belgilerinen dálil shıǵarasız.",
      ru: "Форензика — восстановление событий по цифровым следам: кто, когда, что сделал. Вы извлекаете улики из журналов, сырых байтов и меток времени.",
      en: "Forensics reconstructs events from digital traces: who, when, what. You pull evidence from log files, raw bytes and timestamps.",
    },
  },
  {
    id: "crypto",
    order: 4,
    title: { uz: "Kriptografiya", kaa: "Kriptografiya", ru: "Криптография", en: "Crypto" },
    tagline: {
      uz: "Qatlamlarni birin-ketin arting.",
      kaa: "Qatlamlardı birinen soń biri arıtıń.",
      ru: "Снимайте слои один за другим.",
      en: "Peel the layers one by one.",
    },
    intro: {
      uz: "Bu topshiriqlarni Kriptografiya laboratoriyasidagi asboblar bilan yeching: Base64, ROT13, HEX va shifrlar. Ko‘pincha bir necha qatlam bo‘ladi.",
      kaa: "Bul tapsırmalardı Kriptografiya laboratoriyasındaǵı quraller menen sheshiń: Base64, ROT13, HEX hám shifrler. Kóbinese bir neshe qatlam boladı.",
      ru: "Эти задания решайте инструментами из лаборатории криптографии: Base64, ROT13, HEX и шифры. Часто слоёв несколько.",
      en: "Solve these with the tools from the cryptography lab: Base64, ROT13, HEX and ciphers. There are often several layers.",
    },
  },
];

export const challenges: Challenge[] = [
  // ── OSINT ──────────────────────────────────────────────────────────────
  {
    id: "osint-metadata",
    track: "osint",
    order: 1,
    points: 100,
    difficulty: 1,
    title: { uz: "Rasm ichidagi sir", kaa: "Súwret ishindegi sır", ru: "Секрет внутри фото", en: "The secret inside the photo" },
    brief: {
      uz: "Bir dasturchi ofisidan selfi joyladi. Rasmning o‘zi oddiy, lekin har bir foto fayl ichida yashirin **metadata** (EXIF) olib yuradi. Fayl ma’lumotlarini o‘qing va yashiringan izohni toping.",
      kaa: "Bir dasturshı ofisinen selfi qoydı. Súwrettiń ózi ápiwayı, biraq hár bir foto fayl ishinde jasırın **metadata** (EXIF) alıp júredi. Fayl maǵlıwmatların oqıń hám jasırılǵan túsindirmeni tabıń.",
      ru: "Разработчик выложил селфи из офиса. Само фото обычное, но каждый файл несёт скрытые **метаданные** (EXIF). Прочитайте данные файла и найдите спрятанный комментарий.",
      en: "A developer posted an office selfie. The picture looks ordinary, but every photo file carries hidden **metadata** (EXIF). Read the file’s data and find the hidden comment.",
    },
    evidence: [
      {
        name: "post.txt",
        lines: [
          "@rawshan_dev · 2 soat oldin",
          "Yangi ofisimizdan salom! Kod yozishga tayyor.",
          "[office-selfie.jpg]",
          "#rootyteam #devlife",
        ],
      },
      {
        name: "office-selfie.jpg — EXIF",
        lines: [
          "File            : office-selfie.jpg",
          "Make            : Google",
          "Model           : Pixel 7",
          "DateTimeOriginal: 2026:02:14 09:41:22",
          "GPSLatitude     : 41.311081",
          "GPSLongitude    : 69.279729",
          "Software        : rooty-cms 2.1",
          "UserComment     : Uk9PVFl7bWV0YWRhdGFfbGVha3N9",
        ],
      },
    ],
    hints: [
      {
        uz: "`UserComment` maydoni g‘alati — bu Base64’ga o‘xshaydi.",
        kaa: "`UserComment` maydanı qızıq — bul Base64’ke uqsaydı.",
        ru: "Поле `UserComment` странное — похоже на Base64.",
        en: "The `UserComment` field looks odd — it resembles Base64.",
      },
      {
        uz: "Kriptografiya laboratoriyasidagi Base64 asbobiga shu qiymatni qo‘ying.",
        kaa: "Kriptografiya laboratoriyasındaǵı Base64 quralına sol mánini qoyıń.",
        ru: "Вставьте это значение в инструмент Base64 из лаборатории криптографии.",
        en: "Paste that value into the Base64 tool in the cryptography lab.",
      },
    ],
    takeaway: {
      uz: "Foto va hujjatlar metadata olib yuradi: joylashuv, qurilma, vaqt. Internetga rasm joylashdan oldin metadata’ni tozalang.",
      kaa: "Foto hám hújjetler metadata alıp júredi: jaylasıw, qurılma, waqıt. Internetke súwret qoyıwdan aldın metadata’nı tazalań.",
      ru: "Фото и документы несут метаданные: геолокацию, устройство, время. Перед публикацией очищайте метаданные.",
      en: "Photos and documents carry metadata: location, device, time. Strip metadata before posting anything online.",
    },
    solution: [
      {
        uz: "EXIF ro‘yxatida `UserComment` maydoni g‘alati: `Uk9PVFl7bWV0YWRhdGFfbGVha3N9`. Oxiri harf-raqamlardan iborat — bu **Base64**.",
        kaa: "EXIF dizimindegi `UserComment` maydanı qızıq: `Uk9PVFl7bWV0YWRhdGFfbGVha3N9`. Bul **Base64**.",
        ru: "В EXIF поле `UserComment` странное: `Uk9PVFl7bWV0YWRhdGFfbGVha3N9`. Это **Base64**.",
        en: "In the EXIF the `UserComment` field looks odd: `Uk9PVFl7bWV0YWRhdGFfbGVha3N9`. That is **Base64**.",
      },
      {
        uz: "Shu qiymatni Kriptografiya laboratoriyasidagi **Base64** asbobiga qo‘yib dekod qiling.",
        kaa: "Sol mánini Kriptografiya laboratoriyasındaǵı **Base64** quralına qoyıp dekodlań.",
        ru: "Декодируйте это значение инструментом **Base64** в лаборатории криптографии.",
        en: "Decode that value with the **Base64** tool in the cryptography lab.",
      },
      {
        uz: "Natija — flagning o‘zi: `ROOTY{metadata_leaks}`. Uni flag maydoniga kiriting.",
        kaa: "Nátiyje — flagtıń ózi: `ROOTY{metadata_leaks}`. Onı flag maydanına kiritiń.",
        ru: "Результат — сам флаг: `ROOTY{metadata_leaks}`. Введите его в поле флага.",
        en: "The result is the flag itself: `ROOTY{metadata_leaks}`. Enter it in the flag box.",
      },
    ],
  },
  {
    id: "osint-dns",
    track: "osint",
    order: 2,
    points: 150,
    difficulty: 2,
    title: { uz: "Unutilgan DNS yozuvi", kaa: "Umıtılǵan DNS jazıwı", ru: "Забытая DNS-запись", en: "The forgotten DNS record" },
    brief: {
      uz: "Kompaniya saytini ishga tushirishdan oldin DNS zona faylida bir yozuvni o‘chirishni unutgan. DNS yozuvlari hammaga ochiq. Zonani o‘qing va ochiq qolib ketgan sirni toping.",
      kaa: "Kompaniya saytın iske túsiriwden aldın DNS zona faylında bir jazıwdı óshiriwdi umıtqan. DNS jazıwları hámmege ashıq. Zonani oqıń hám ashıq qalıp ketken sırdı tabıń.",
      ru: "Перед запуском сайта компания забыла удалить одну запись в DNS-зоне. DNS-записи открыты всем. Прочитайте зону и найдите оставшийся секрет.",
      en: "Before launching, a company forgot to remove one record from its DNS zone. DNS records are public. Read the zone and find the secret left behind.",
    },
    evidence: [
      {
        name: "rooty-shop.example.zone",
        lines: [
          "$TTL 3600",
          "@       IN  SOA   ns1.rooty-shop.example. admin.rooty-shop.example. (",
          "              2026021401 ; serial",
          "              7200 3600 1209600 3600 )",
          "@       IN  NS    ns1.rooty-shop.example.",
          "@       IN  A     185.74.6.21",
          "www     IN  CNAME @",
          "mail    IN  A     185.74.6.22",
          "; TODO: launch oldidan o‘chirish kerak",
          '_debug  IN  TXT   "ROOTY{forgotten_dns_record}"',
          "staging IN  A     10.0.0.5",
        ],
      },
    ],
    hints: [
      {
        uz: "`TXT` yozuvlari ko‘pincha izohlar va sozlamalar uchun ishlatiladi — e’tibor bering.",
        kaa: "`TXT` jazıwları kóbinese túsindirmeler hám sazlawlar ushın qollanıladı — itibar beriń.",
        ru: "Записи `TXT` часто используют для заметок и настроек — обратите внимание.",
        en: "`TXT` records are often used for notes and settings — look there.",
      },
      {
        uz: "Izoh qatori («TODO») qaysi yozuv unutilganini aytib turibdi.",
        kaa: "Túsindirme qatarı («TODO») qaysı jazıw umıtılǵanın aytıp tur.",
        ru: "Строка с комментарием («TODO») подсказывает, какую запись забыли.",
        en: "The comment line (“TODO”) points right at the forgotten record.",
      },
    ],
    takeaway: {
      uz: "DNS yozuvlari — ochiq ma’lumot. Ichki (`staging`, `_debug`) nomlar hujumchiga tarmoq xaritasini beradi. Ularni ommaviy DNS’da qoldirmang.",
      kaa: "DNS jazıwları — ashıq maǵlıwmat. Ishki (`staging`, `_debug`) atlar hújimshige tarmaq kartasın beredi. Olardı ommalıq DNS’te qaldırmań.",
      ru: "DNS-записи открыты. Внутренние имена (`staging`, `_debug`) дают атакующему карту сети. Не оставляйте их в публичном DNS.",
      en: "DNS records are public. Internal names (`staging`, `_debug`) hand an attacker a map of your network. Keep them out of public DNS.",
    },
    solution: [
      {
        uz: "Zona faylidagi `TXT` yozuvlarini qarang — izoh va sozlamalar odatda shu yerda bo‘ladi.",
        kaa: "Zona faylındaǵı `TXT` jazıwların qarań — túsindirme hám sazlawlar ádette usı jerde boladı.",
        ru: "Смотрите записи `TXT` в зоне — заметки и настройки обычно там.",
        en: "Look at the `TXT` records in the zone — notes and settings usually live there.",
      },
      {
        uz: "`; TODO: launch oldidan o‘chirish kerak` izohi aynan keyingi qatorni ko‘rsatadi: `_debug IN TXT`.",
        kaa: "`; TODO` túsindirmesi dál keyingi qatarǵa isaret etedi: `_debug IN TXT`.",
        ru: "Комментарий `; TODO` указывает прямо на следующую строку: `_debug IN TXT`.",
        en: "The `; TODO` comment points right at the next line: `_debug IN TXT`.",
      },
      {
        uz: "Flag ochiq ko‘rinib turibdi: `ROOTY{forgotten_dns_record}`.",
        kaa: "Flag ashıq kórinip tur: `ROOTY{forgotten_dns_record}`.",
        ru: "Флаг виден прямо так: `ROOTY{forgotten_dns_record}`.",
        en: "The flag is sitting in plain sight: `ROOTY{forgotten_dns_record}`.",
      },
    ],
  },
  {
    id: "osint-geolocation",
    track: "osint",
    order: 3,
    points: 200,
    difficulty: 2,
    title: {
      uz: "Bu rasm qayerda olingan?",
      kaa: "Bul súwret qayerde alınǵan?",
      ru: "Где снято это фото?",
      en: "Where was this photo taken?",
    },
    brief: {
      uz: "Sayohatchi `postcard.jpg` suratini joyladi, lekin uni internetga qo‘yishdan oldin **metadatani tozalashni unutgan**. Rasmni yuklab oling, u dunyoning qayerida olinganini aniqlang. Javob — **koordinata**: `kenglik, uzunlik` (masalan `39.65, 66.96`).",
      kaa: "Sayaxatshı `postcard.jpg` súwretin qoydı, biraq internetke qoyıwdan aldın **metadatanı tazalawdı umıtqan**. Súwretti júklep alıń, dúnyanıń qayerinde alınǵanın anıqlań. Juwap — **koordinata**: `keńlik, uzınlıq`.",
      ru: "Путешественник выложил `postcard.jpg`, но **забыл очистить метаданные** перед публикацией. Скачайте фото и определите, где в мире оно снято. Ответ — **координаты**: `широта, долгота` (например `39.65, 66.96`).",
      en: "A traveller posted `postcard.jpg` but **forgot to strip the metadata** before uploading. Download the photo and work out where in the world it was taken. The answer is **coordinates**: `latitude, longitude` (e.g. `39.65, 66.96`).",
    },
    files: [
      {
        name: "postcard.jpg",
        href: "/ctf/postcard.jpg",
        size: "≈0.9 MB",
        note: {
          uz: "Rasmni yuklab olib, uning EXIF ma’lumotlarini o‘qing.",
          kaa: "Súwretti júklep alıp, onıń EXIF maǵlıwmatların oqıń.",
          ru: "Скачайте фото и прочитайте его EXIF.",
          en: "Download the photo and read its EXIF.",
        },
      },
    ],
    evidence: [
      {
        name: "exiftool postcard.jpg | grep GPS",
        lines: [
          "GPS Latitude Ref                : North",
          "GPS Latitude                    : 39 deg 39' 15.12\"",
          "GPS Longitude Ref               : East",
          "GPS Longitude                   : 66 deg 57' 34.92\"",
        ],
      },
    ],
    hints: [
      {
        uz: "Avval metadatani ko‘ring: `exiftool postcard.jpg`. **GPS** maydonlari bormi?",
        kaa: "Aldın metadatanı kóriń: `exiftool postcard.jpg`. **GPS** maydanları barma?",
        ru: "Сначала посмотрите метаданные: `exiftool postcard.jpg`. Есть ли поля **GPS**?",
        en: "First check the metadata: `exiftool postcard.jpg`. Are there **GPS** fields?",
      },
      {
        uz: "GPS **daraja-daqiqa-soniya** (DMS) ko‘rinishida. Uni o‘nli darajaga aylantiring: `D + M/60 + S/3600`. Shimol/Sharq — musbat.",
        kaa: "GPS **daraja-minut-sekund** (DMS) túrinde. Onı onlı dárejege aylandırıń: `D + M/60 + S/3600`.",
        ru: "GPS в формате **градусы-минуты-секунды** (DMS). Переведите в десятичные: `D + M/60 + S/3600`. Север/Восток — плюс.",
        en: "GPS is in **degrees-minutes-seconds** (DMS). Convert to decimal: `D + M/60 + S/3600`. North/East are positive.",
      },
    ],
    takeaway: {
      uz: "Smartfon suratlari ko‘pincha aniq GPS koordinatasini olib yuradi. Joylashuvni oshkor qilmaslik uchun internetga qo‘yishdan oldin metadatani tozalang. OSINT’da esa — bu birinchi tekshiradigan narsa.",
      kaa: "Smartfon súwretleri kóbinese anıq GPS koordinatasın alıp júredi. Jaylasıwdı áshkara etpew ushın metadatanı tazalań. OSINT’ta — bul birinshi tekseriletuǵın nárse.",
      ru: "Фото со смартфона часто несут точные GPS-координаты. Чтобы не раскрыть локацию, очищайте метаданные перед публикацией. А в OSINT — это первое, что нужно проверить.",
      en: "Phone photos often carry exact GPS coordinates. To avoid revealing your location, strip metadata before posting. In OSINT it is the first thing to check.",
    },
    solution: [
      {
        uz: "`postcard.jpg` ni yuklab oling va `exiftool postcard.jpg` ni ishga soling — `GPS Latitude` va `GPS Longitude` maydonlari bor.",
        kaa: "`postcard.jpg` ni júklep `exiftool postcard.jpg` ni iske qosıń — `GPS Latitude`/`GPS Longitude` bar.",
        ru: "Скачайте `postcard.jpg` и запустите `exiftool postcard.jpg` — есть поля `GPS Latitude` и `GPS Longitude`.",
        en: "Download `postcard.jpg` and run `exiftool postcard.jpg` — it has `GPS Latitude` and `GPS Longitude`.",
      },
      {
        uz: "DMS → o‘nli: `39 + 39/60 + 15.12/3600 ≈ 39.654`, `66 + 57/60 + 34.92/3600 ≈ 66.960`. (Ko‘p vosita o‘zi o‘nli ko‘rsatadi.)",
        kaa: "DMS → onlı: `≈39.654`, `≈66.960`.",
        ru: "DMS → десятичные: `≈39.654`, `≈66.960`. (Многие инструменты сразу дают десятичные.)",
        en: "DMS → decimal: `≈39.654`, `≈66.960`. (Many tools show decimal directly.)",
      },
      {
        uz: "Koordinatani xaritaga qo‘ysangiz — **Registon, Samarqand**. Javob maydoniga `39.654, 66.960` deb kiriting (shahar ichidagi har qanday nuqta qabul qilinadi).",
        kaa: "Koordinatanı kartaǵa qoysań — **Registon, Samarqand**. `39.654, 66.960` dep kiritiń.",
        ru: "Нанесите координаты на карту — это **Регистан, Самарканд**. Введите `39.654, 66.960` (принимается любая точка в городе).",
        en: "Drop the coordinates on a map — it is the **Registan, Samarkand**. Enter `39.654, 66.960` (any point in the city is accepted).",
      },
    ],
  },
  // ── Web ────────────────────────────────────────────────────────────────
  {
    id: "web-headers",
    track: "web",
    order: 1,
    points: 100,
    difficulty: 1,
    title: { uz: "Sarlavhadagi iz", kaa: "Sarlawhadaǵı iz", ru: "След в заголовке", en: "The trace in the header" },
    brief: {
      uz: "Sahifa oddiy ko‘rinadi, lekin server javobining **sarlavhalari** (headers) ko‘proq narsa aytadi. Ularni o‘qing va standart bo‘lmagan sarlavhadagi izni toping.",
      kaa: "Bet ápiwayı kórinedi, biraq server juwabınıń **sarlawhaları** (headers) kóbirek nárse aytadı. Olardı oqıń hám standart bolmaǵan sarlawhadaǵı izdi tabıń.",
      ru: "Страница выглядит обычно, но **заголовки** ответа сервера говорят больше. Прочитайте их и найдите след в нестандартном заголовке.",
      en: "The page looks plain, but the server response **headers** say more. Read them and find the trace in a non-standard header.",
    },
    evidence: [
      {
        name: "response.http",
        lines: [
          "HTTP/1.1 200 OK",
          "Date: Fri, 14 Feb 2026 09:41:22 GMT",
          "Server: nginx/1.24.0",
          "Content-Type: text/html; charset=utf-8",
          "Set-Cookie: session=9f2a...; HttpOnly; Secure; SameSite=Lax",
          "X-Powered-By: rooty-cms",
          "X-Flag: Uk9PVFl7aGVhZGVyc190ZWxsX3RhbGVzfQ==",
          "Cache-Control: no-store",
        ],
      },
    ],
    hints: [
      {
        uz: "`X-` bilan boshlangan sarlavhalar — nostandart. Ulardan biri Base64’ga o‘xshaydi.",
        kaa: "`X-` penen baslanǵan sarlawhalar — standart emes. Olardıń biri Base64’ke uqsaydı.",
        ru: "Заголовки на `X-` — нестандартные. Один из них похож на Base64.",
        en: "Headers starting with `X-` are non-standard. One looks like Base64.",
      },
    ],
    takeaway: {
      uz: "Server sarlavhalari hammaga ko‘rinadi (DevTools → Network). Debug yoki ichki sarlavhalarni ishlab chiqarishda o‘chiring.",
      kaa: "Server sarlawhaları hámmege kórinedi (DevTools → Network). Debug yamasa ishki sarlawhalardı óndiriste óshiriń.",
      ru: "Заголовки сервера видны всем (DevTools → Network). Отключайте отладочные и внутренние заголовки в продакшене.",
      en: "Server headers are visible to everyone (DevTools → Network). Turn off debug and internal headers in production.",
    },
    solution: [
      {
        uz: "Javob sarlavhalarida `X-` bilan boshlangan nostandart maydon bor: `X-Flag: Uk9PVFl7aGVhZGVyc190ZWxsX3RhbGVzfQ==`.",
        kaa: "Juwap sarlawhalarında `X-` penen baslanǵan maydan bar: `X-Flag: Uk9PVFl7aGVhZGVyc190ZWxsX3RhbGVzfQ==`.",
        ru: "В заголовках есть нестандартное поле на `X-`: `X-Flag: Uk9PVFl7aGVhZGVyc190ZWxsX3RhbGVzfQ==`.",
        en: "The headers carry a non-standard `X-` field: `X-Flag: Uk9PVFl7aGVhZGVyc190ZWxsX3RhbGVzfQ==`.",
      },
      {
        uz: "`==` bilan tugashi — Base64 belgisi. Qiymatni **Base64** asbobida dekod qiling → `ROOTY{headers_tell_tales}`.",
        kaa: "`==` benen tamamlanıwı — Base64 belgisi. Mánini **Base64** quralında dekodlań → `ROOTY{headers_tell_tales}`.",
        ru: "Окончание `==` — признак Base64. Декодируйте значение в **Base64** → `ROOTY{headers_tell_tales}`.",
        en: "Ending in `==` marks Base64. Decode the value with **Base64** → `ROOTY{headers_tell_tales}`.",
      },
    ],
  },
  {
    id: "web-jwt",
    track: "web",
    order: 2,
    points: 150,
    difficulty: 2,
    title: { uz: "Token ichidagi rol", kaa: "Token ishindegi rol", ru: "Роль внутри токена", en: "The role inside the token" },
    brief: {
      uz: "Sayt sizga **JWT** token berdi. Ko‘plar o‘ylaydiki, token shifrlangan — aslida uning o‘rta qismi shunchaki Base64. Tokenni o‘qing va ichidagi yashirin maydonni toping.",
      kaa: "Sayt sizge **JWT** token berdi. Kópler oylaydı, token shifrlanǵan — haqıyqatında onıń orta bólimi jay ǵana Base64. Tokendi oqıń hám ishindegi jasırın maydandı tabıń.",
      ru: "Сайт выдал вам **JWT**-токен. Многие думают, что токен зашифрован — на деле его средняя часть просто Base64. Прочитайте токен и найдите скрытое поле внутри.",
      en: "A site gave you a **JWT** token. Many think it’s encrypted — in fact its middle part is just Base64. Read the token and find the hidden field inside.",
    },
    evidence: [
      {
        name: "token.jwt",
        lines: [
          "eyJhbGciOiJIUzI1NiJ9",
          ".eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiZWRpdG9yIiwi",
          "ZmxhZyI6IlJPT1RZe2p3dF9pc19vbmx5X2Jhc2U2NH0ifQ",
          ".kQ3m9d_fake_signature_not_needed",
        ],
      },
    ],
    hints: [
      {
        uz: "JWT uch qismdan iborat, nuqta bilan ajratilgan: sarlavha.payload.imzo. Sizga o‘rta qism (payload) kerak.",
        kaa: "JWT úsh bólimnen ibarat, noqat penen ajıratılǵan: sarlawha.payload.qol. Sizge orta bólim (payload) kerek.",
        ru: "JWT состоит из трёх частей через точку: заголовок.payload.подпись. Вам нужна средняя часть (payload).",
        en: "A JWT has three dot-separated parts: header.payload.signature. You want the middle part (payload).",
      },
      {
        uz: "O‘rta qismning ikkala qatorini birlashtirib (nuqtalarsiz) Base64 asbobiga qo‘ying — JSON chiqadi.",
        kaa: "Orta bólimniń eki qatarın biriktirip (noqatlarsız) Base64 quralına qoyıń — JSON shıǵadı.",
        ru: "Соедините две строки средней части (без точек) и вставьте в Base64 — получите JSON.",
        en: "Join the middle part’s two lines (no dots) and paste into Base64 — you’ll get JSON.",
      },
    ],
    takeaway: {
      uz: "JWT payload shifrlanmagan — faqat Base64. Hech qachon tokenga parol yoki maxfiy ma’lumot joylamang; imzo faqat o‘zgartirishdan himoya qiladi, yashirmaydi.",
      kaa: "JWT payload shifrlanbaǵan — tek Base64. Hesh qashan tokenge parol yamasa jasırın maǵlıwmat qoymań; qol tek ózgertiwden qorǵaydı, jasırmaydı.",
      ru: "Payload JWT не зашифрован — только Base64. Никогда не кладите в токен пароли или секреты; подпись защищает от подмены, но не прячет.",
      en: "A JWT payload is not encrypted — only Base64. Never put passwords or secrets in a token; the signature protects against tampering, not reading.",
    },
    solution: [
      {
        uz: "JWT — nuqta bilan ajratilgan uch qism: `sarlavha.payload.imzo`. Sizga **o‘rta** qism (payload) kerak.",
        kaa: "JWT — noqat penen ajıratılǵan úsh bólim: `sarlawha.payload.qol`. Sizge **orta** bólim (payload) kerek.",
        ru: "JWT — три части через точку: `заголовок.payload.подпись`. Нужна **средняя** часть (payload).",
        en: "A JWT is three dot-separated parts: `header.payload.signature`. You need the **middle** part (payload).",
      },
      {
        uz: "Payloadning ikki qatorini birlashtiring: `eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiZWRpdG9yIiwiZmxhZyI6IlJPT1RZe2p3dF9pc19vbmx5X2Jhc2U2NH0ifQ`.",
        kaa: "Payloadtıń eki qatarın biriktiriń: `...ZmxhZyI6IlJPT1RZe2p3dF9pc19vbmx5X2Jhc2U2NH0ifQ`.",
        ru: "Соедините две строки payload: `...ZmxhZyI6IlJPT1RZe2p3dF9pc19vbmx5X2Jhc2U2NH0ifQ`.",
        en: "Join the payload’s two lines: `...ZmxhZyI6IlJPT1RZe2p3dF9pc19vbmx5X2Jhc2U2NH0ifQ`.",
      },
      {
        uz: "**Base64** da dekod qiling → JSON chiqadi: `{\"user\":\"admin\",\"role\":\"editor\",\"flag\":\"ROOTY{jwt_is_only_base64}\"}`. `flag` maydoni — javob.",
        kaa: "**Base64** da dekodlań → JSON: `flag` maydanı — juwap: `ROOTY{jwt_is_only_base64}`.",
        ru: "Декодируйте в **Base64** → JSON; поле `flag` — ответ: `ROOTY{jwt_is_only_base64}`.",
        en: "Decode in **Base64** → JSON; the `flag` field is the answer: `ROOTY{jwt_is_only_base64}`.",
      },
    ],
  },
  {
    id: "web-robots",
    track: "web",
    order: 3,
    points: 150,
    difficulty: 2,
    title: { uz: "robots.txt ortidagi eshik", kaa: "robots.txt artındaǵı esik", ru: "Дверь за robots.txt", en: "The door behind robots.txt" },
    brief: {
      uz: "`robots.txt` qidiruv tizimlariga qaysi sahifalarni indekslamaslikni aytadi — lekin u hammaga ochiq. Admin «yashirin» yo‘lni aynan shu yerda ko‘rsatib qo‘ygan. Faylni o‘qing va yashirin sahifani toping.",
      kaa: "`robots.txt` izlew sistemalarına qaysı betlerdi indekslemewdi aytadı — biraq ol hámmege ashıq. Admin «jasırın» joldı dál usı jerde kórsetip qoyǵan. Fayldı oqıń hám jasırın betti tabıń.",
      ru: "`robots.txt` говорит поисковикам, какие страницы не индексировать — но он открыт всем. Админ сам указал «скрытый» путь именно здесь. Прочитайте файл и найдите скрытую страницу.",
      en: "`robots.txt` tells search engines which pages to skip — but it’s public. The admin pointed to a “hidden” path right there. Read the file and find the hidden page.",
    },
    evidence: [
      {
        name: "robots.txt",
        lines: [
          "User-agent: *",
          "Disallow: /admin/",
          "Disallow: /internal/backup-2021/",
          "Sitemap: https://rooty-shop.example/sitemap.xml",
        ],
      },
      {
        name: "/internal/backup-2021/notes.txt",
        lines: [
          "# ichki eslatmalar — joylamang!",
          "db parol rotatsiyasi: har 90 kun",
          "eski admin eslatmasi: ROOTY{robots_is_not_security}",
          "migratsiya tugadi: 2021-11-02",
        ],
      },
    ],
    hints: [
      {
        uz: "`Disallow` qatorlari qaysi yo‘llar «yashirin» ekanini aytadi. Odatiy bo‘lmagan birini tanlang.",
        kaa: "`Disallow` qatarları qaysı jollar «jasırın» ekenin aytadı. Ádettegi bolmaǵan birin tańlań.",
        ru: "Строки `Disallow` называют «скрытые» пути. Выберите необычный.",
        en: "The `Disallow` lines name the “hidden” paths. Pick the unusual one.",
      },
    ],
    takeaway: {
      uz: "`robots.txt` — himoya emas, u maxfiy yo‘llarni aynan oshkor qiladi. Maxfiy sahifalarni ro‘yxatga yozish o‘rniga, ularni autentifikatsiya bilan himoyalang.",
      kaa: "`robots.txt` — qorǵaw emes, ol jasırın jollardı dál áshkara etedi. Jasırın betlerdi dizimge jazıw ornına, olardı autentifikaciya menen qorǵań.",
      ru: "`robots.txt` — не защита, он как раз раскрывает секретные пути. Вместо списка защищайте скрытые страницы аутентификацией.",
      en: "`robots.txt` is not protection — it actually reveals secret paths. Instead of listing them, protect hidden pages with authentication.",
    },
    solution: [
      {
        uz: "`robots.txt` dagi `Disallow` qatorlari «yashirin» yo‘llarni sanaydi. `/internal/backup-2021/` eng g‘alati ko‘rinadi.",
        kaa: "`robots.txt` dagi `Disallow` qatarları «jasırın» jollardı sanaydı. `/internal/backup-2021/` eń qızıq kórinedi.",
        ru: "Строки `Disallow` в `robots.txt` перечисляют «скрытые» пути. `/internal/backup-2021/` выглядит подозрительнее всех.",
        en: "The `Disallow` lines in `robots.txt` list the “hidden” paths. `/internal/backup-2021/` looks the most unusual.",
      },
      {
        uz: "O‘sha papkadagi `notes.txt` ni oching — eski admin eslatmasi ichida flag turibdi: `ROOTY{robots_is_not_security}`.",
        kaa: "Sol papkadaǵı `notes.txt` ti ashıń — eski admin eslatpası ishinde flag tur: `ROOTY{robots_is_not_security}`.",
        ru: "Откройте `notes.txt` в той папке — в старой заметке админа лежит флаг: `ROOTY{robots_is_not_security}`.",
        en: "Open `notes.txt` in that folder — the old admin note holds the flag: `ROOTY{robots_is_not_security}`.",
      },
    ],
  },
  // ── Forensics ──────────────────────────────────────────────────────────
  {
    id: "forensics-authlog",
    track: "forensics",
    order: 1,
    points: 150,
    difficulty: 2,
    title: { uz: "auth.log tergovi", kaa: "auth.log tergewi", ru: "Расследование auth.log", en: "The auth.log investigation" },
    brief: {
      uz: "Serverning autentifikatsiya jurnalida kimdir parolni taxminlab kirgan. Jurnalni o‘qing: ko‘p muvaffaqiyatsiz urinishdan **keyin** qaysi IP tizimga kira oldi? Flag — o‘sha IP: `ROOTY{IP}`.",
      kaa: "Serverdiń autentifikaciya jurnalında kimdir paroldı boljap kirgen. Jurnaldı oqıń: kóp sátsiz urınıwdan **keyin** qaysı IP sistemaǵa kire aldı? Flag — sol IP: `ROOTY{IP}`.",
      ru: "В журнале аутентификации сервера кто-то подобрал пароль. Прочитайте журнал: какой IP вошёл **после** множества неудач? Флаг — этот IP: `ROOTY{IP}`.",
      en: "In the server’s auth log someone guessed a password. Read it: which IP logged in **after** many failures? The flag is that IP: `ROOTY{IP}`.",
    },
    evidence: [
      {
        name: "auth.log",
        lines: [
          "Feb 14 03:11:02 sshd: Failed password for root from 203.0.113.45 port 51122",
          "Feb 14 03:11:04 sshd: Failed password for root from 203.0.113.45 port 51123",
          "Feb 14 03:11:07 sshd: Failed password for root from 203.0.113.45 port 51124",
          "Feb 14 03:11:09 sshd: Failed password for admin from 198.51.100.7 port 44001",
          "Feb 14 03:11:12 sshd: Failed password for root from 203.0.113.45 port 51125",
          "Feb 14 03:11:15 sshd: Accepted password for root from 203.0.113.45 port 51126",
          "Feb 14 03:11:16 sshd: Accepted publickey for deploy from 10.0.0.9 port 52000",
          "Feb 14 03:12:40 sudo: root : COMMAND=/usr/bin/wget http://example.test/x",
        ],
      },
    ],
    hints: [
      {
        uz: "«Failed password» — muvaffaqiyatsiz, «Accepted password» — muvaffaqiyatli urinish. Bittadan ko‘p marta muvaffaqiyatsiz bo‘lgan IP’ni kuzating.",
        kaa: "«Failed password» — sátsiz, «Accepted password» — sátli urınıw. Birden kóp ret sátsiz bolǵan IP’ni baqlań.",
        ru: "«Failed password» — неудача, «Accepted password» — успех. Следите за IP, который много раз ошибался.",
        en: "“Failed password” is a miss, “Accepted password” is a hit. Track the IP that failed many times.",
      },
      {
        uz: "`Accepted publickey` — bu oddiy, qonuniy kirish (kalit bilan). Sizga parol taxminlagan IP kerak.",
        kaa: "`Accepted publickey` — bul ápiwayı, nızamlı kiriw (gilt penen). Sizge parol boljaǵan IP kerek.",
        ru: "`Accepted publickey` — это обычный законный вход (по ключу). Вам нужен IP, подбиравший пароль.",
        en: "`Accepted publickey` is a normal, legitimate login (by key). You want the IP that guessed a password.",
      },
    ],
    takeaway: {
      uz: "Ketma-ket «Failed password» — brute-force belgisi. Root uchun parol bilan SSH’ni o‘chiring, faqat kalitdan foydalaning va fail2ban kabi vosita qo‘ying.",
      kaa: "Izbe-iz «Failed password» — brute-force belgisi. Root ushın parol menen SSH’ni óshiriń, tek gilttan paydalanıń hám fail2ban sıyaqlı qural qoyıń.",
      ru: "Череда «Failed password» — признак brute-force. Отключите вход по паролю для root, используйте ключи и ставьте fail2ban.",
      en: "A run of “Failed password” is a brute-force sign. Disable password SSH for root, use keys, and add something like fail2ban.",
    },
    solution: [
      {
        uz: "`203.0.113.45` IP’si ketma-ket to‘rt marta `Failed password` oladi — bu parol taxminlash (brute-force).",
        kaa: "`203.0.113.45` IP’si izbe-iz tórt ret `Failed password` aladı — bul parol boljaw (brute-force).",
        ru: "IP `203.0.113.45` подряд четыре раза получает `Failed password` — это подбор пароля (brute-force).",
        en: "IP `203.0.113.45` gets `Failed password` four times in a row — that is password guessing (brute-force).",
      },
      {
        uz: "So‘ng aynan o‘sha IP `Accepted password` oladi — hujum muvaffaqiyatli. (`Accepted publickey` esa boshqa, qonuniy kirish — chalg‘itmang.)",
        kaa: "Soń dál sol IP `Accepted password` aladı — húzjim sátli. (`Accepted publickey` basqa, nızamlı kiriw.)",
        ru: "Затем тот же IP получает `Accepted password` — атака удалась. (`Accepted publickey` — другой, законный вход.)",
        en: "Then that same IP gets `Accepted password` — the attack succeeded. (`Accepted publickey` is a different, legitimate login.)",
      },
      {
        uz: "Flag — o‘sha IP, shu formatda: `ROOTY{203.0.113.45}`.",
        kaa: "Flag — sol IP, usı formatta: `ROOTY{203.0.113.45}`.",
        ru: "Флаг — этот IP в таком формате: `ROOTY{203.0.113.45}`.",
        en: "The flag is that IP in this format: `ROOTY{203.0.113.45}`.",
      },
    ],
  },
  {
    id: "forensics-hex",
    track: "forensics",
    order: 2,
    points: 100,
    difficulty: 1,
    title: { uz: "Baytlar ichidagi matn", kaa: "Baytlar ishindegi tekst", ru: "Текст внутри байтов", en: "Text inside the bytes" },
    brief: {
      uz: "Bizda fayldan olingan xom baytlarning **HEX dump**’i bor. Har bir juft belgi — bitta bayt, bitta harf. Baytlarni matnga aylantiring va flagni o‘qing.",
      kaa: "Bizde faylda alınǵan xam baytlardıń **HEX dump**’i bar. Hár bir jup belgi — bir bayt, bir hárip. Baytlardı tekstke aylandırıń hám flagti oqıń.",
      ru: "У нас есть **HEX dump** сырых байтов из файла. Каждая пара символов — один байт, одна буква. Переведите байты в текст и прочитайте флаг.",
      en: "We have a **HEX dump** of raw bytes from a file. Each pair of characters is one byte, one letter. Turn the bytes into text and read the flag.",
    },
    evidence: [
      {
        name: "dump.hex",
        lines: ["52 4f 4f 54 59 7b 72 61 77 5f", "62 79 74 65 73 5f 68 69 64 65", "5f 74 65 78 74 7d"],
      },
    ],
    hints: [
      {
        uz: "Kriptografiya laboratoriyasidagi HEX asbobiga baytlarni qo‘ying.",
        kaa: "Kriptografiya laboratoriyasındaǵı HEX quralına baytlardı qoyıń.",
        ru: "Вставьте байты в инструмент HEX из лаборатории криптографии.",
        en: "Paste the bytes into the HEX tool in the cryptography lab.",
      },
      {
        uz: "`52` — bu «R» harfi. Qolganini davom ettiring.",
        kaa: "`52` — bul «R» háribi. Qalǵanın dawam ettiriń.",
        ru: "`52` — это буква «R». Продолжайте остальное.",
        en: "`52` is the letter “R”. Carry on with the rest.",
      },
    ],
    takeaway: {
      uz: "Har qanday fayl — baytlar ketma-ketligi. HEX dump xom ma’lumotni ko‘rishga yordam beradi; «yashirin» ASCII matn ko‘pincha shundoq ko‘rinib turadi.",
      kaa: "Hár qanday fayl — baytlar izbe-izligi. HEX dump xam maǵlıwmattı kóriwge járdem beredi; «jasırın» ASCII tekst kóbinese sonsha kórinip tur.",
      ru: "Любой файл — последовательность байтов. HEX dump помогает увидеть сырые данные; «скрытый» ASCII-текст часто виден прямо так.",
      en: "Every file is a sequence of bytes. A HEX dump lets you see the raw data; “hidden” ASCII text is often sitting in plain sight.",
    },
    solution: [
      {
        uz: "Har bir juft belgi — bitta bayt. Barcha qatorlarni birlashtiring va **HEX** asbobiga qo‘ying.",
        kaa: "Hár bir jup belgi — bir bayt. Barlıq qatarlardı biriktirip **HEX** quralına qoyıń.",
        ru: "Каждая пара символов — один байт. Соедините все строки и вставьте в инструмент **HEX**.",
        en: "Each pair of characters is one byte. Join all the lines and paste into the **HEX** tool.",
      },
      {
        uz: "`52`→`R`, `4f`→`O`, `4f`→`O`, `54`→`T`, `59`→`Y`, `7b`→`{` … baytlar to‘g‘ridan-to‘g‘ri ASCII matnga aylanadi.",
        kaa: "`52`→`R`, `4f`→`O`, `54`→`T`, `59`→`Y`, `7b`→`{` … baytlar tuwrıdan-tuwrı ASCII tekstke aylanadı.",
        ru: "`52`→`R`, `4f`→`O`, `54`→`T`, `59`→`Y`, `7b`→`{` … байты прямо переводятся в ASCII-текст.",
        en: "`52`→`R`, `4f`→`O`, `54`→`T`, `59`→`Y`, `7b`→`{` … the bytes map straight to ASCII text.",
      },
      {
        uz: "To‘liq matn — flag: `ROOTY{raw_bytes_hide_text}`.",
        kaa: "Tolıq tekst — flag: `ROOTY{raw_bytes_hide_text}`.",
        ru: "Полный текст — флаг: `ROOTY{raw_bytes_hide_text}`.",
        en: "The full text is the flag: `ROOTY{raw_bytes_hide_text}`.",
      },
    ],
  },
  {
    id: "forensics-stego-photo",
    track: "forensics",
    order: 3,
    points: 150,
    difficulty: 2,
    title: {
      uz: "Rasm ichidagi yashirin izoh",
      kaa: "Súwret ishindegi jasırın túsindirme",
      ru: "Скрытая подпись в фото",
      en: "The hidden note inside the photo",
    },
    brief: {
      uz: "Bizda `photo.jpg` nomli oddiy rasm bor. Ko‘zga hech narsa ko‘rinmaydi, lekin kimdir fayl **metadatasiga** (EXIF) matn yashirgan. `strings` yoki `exiftool` bilan faylni «o‘qing», yashirin maydonni toping va uni ochib flagni oling.",
      kaa: "Bizde `photo.jpg` degen ápiwayı súwret bar. Kózge hesh nárse kórinbeydi, biraq kimdir fayldıń **metadatasına** (EXIF) tekst jasırǵan. `strings` yaki `exiftool` menen fayldı «oqıń», jasırın maydandı tabıń hám onı ashıp flagti alıń.",
      ru: "У нас обычное фото `photo.jpg`. На глаз ничего нет, но кто-то спрятал текст в **метаданных** (EXIF). «Прочитайте» файл через `strings` или `exiftool`, найдите скрытое поле и раскодируйте флаг.",
      en: "We have an ordinary photo `photo.jpg`. Nothing shows on screen, but someone hid text in the file’s **metadata** (EXIF). “Read” the file with `strings` or `exiftool`, find the hidden field and decode the flag.",
    },
    evidence: [
      {
        name: "exiftool photo.jpg",
        lines: [
          "Make                : SnapCam",
          "Model               : SnapCam 24mm f/2.0",
          "DateTimeOriginal    : 2024:07:14 19:42:10",
          "Orientation         : Horizontal (normal)",
          "UserComment         : Y3NlY3tiNjlhNTcwNC02ZTRiLTQ5ZWItOTlkZC0yNGNhZGNhZWYwNDZ9",
          "LensModel           : SnapCam 24mm f/2.0",
        ],
      },
      {
        name: "strings photo.jpg | grep -i cam",
        lines: ["Y3NlY3tiNjlhNTcwNC02ZTRiLTQ5ZWItOTlkZC0yNGNhZGNhZWYwNDZ9SnapCam", "SnapCam 24mm f/2.0"],
      },
    ],
    hints: [
      {
        uz: "`strings photo.jpg | grep -i cam` yoki `exiftool photo.jpg` — `UserComment` maydoni g‘alati, harf-raqamlardan iborat.",
        kaa: "`strings photo.jpg | grep -i cam` yaki `exiftool photo.jpg` — `UserComment` maydanı qızıq, hárip-sanlardan ibarat.",
        ru: "`strings photo.jpg | grep -i cam` или `exiftool photo.jpg` — поле `UserComment` странное, из букв и цифр.",
        en: "`strings photo.jpg | grep -i cam` or `exiftool photo.jpg` — the `UserComment` field is odd, all letters and digits.",
      },
      {
        uz: "`UserComment` qiymati — **Base64**. Uni dekod qiling (CyberChef yoki `base64 -d`).",
        kaa: "`UserComment` mánisi — **Base64**. Onı dekodlań (CyberChef yaki `base64 -d`).",
        ru: "Значение `UserComment` — это **Base64**. Декодируйте его (CyberChef или `base64 -d`).",
        en: "The `UserComment` value is **Base64**. Decode it (CyberChef or `base64 -d`).",
      },
    ],
    takeaway: {
      uz: "Stego/forensikada birinchi qadam — har doim `strings`, `exiftool`, `binwalk`, `zsteg`. Rasm «chiroyli» ko‘rinsa ham, metadata va fayl oxirida yashirin matn yoki butun fayl bo‘lishi mumkin.",
      kaa: "Stego/forensikada birinshi qádem — hámeshe `strings`, `exiftool`, `binwalk`, `zsteg`. Súwret «sulıw» kórinse de, metadata hám fayl aqırında jasırın tekst yaki pútin fayl bolıwı múmkin.",
      ru: "Первый шаг в стего/форензике — всегда `strings`, `exiftool`, `binwalk`, `zsteg`. Даже «красивое» фото может прятать текст или целый файл в метаданных и в хвосте.",
      en: "The first move in stego/forensics is always `strings`, `exiftool`, `binwalk`, `zsteg`. Even a “nice” photo can hide text or a whole file in metadata and in its trailing bytes.",
    },
    solution: [
      {
        uz: "Faylni «o‘qing»: `strings photo.jpg | grep -i cam` yoki `exiftool photo.jpg`. EXIF’dagi `UserComment` maydonida g‘alati satr chiqadi: `Y3NlY3tiNjlhNTcwNC02ZTRiLTQ5ZWItOTlkZC0yNGNhZGNhZWYwNDZ9`.",
        kaa: "Fayldı «oqıń»: `strings photo.jpg | grep -i cam` yaki `exiftool photo.jpg`. `UserComment` maydanında qızıq satr: `Y3NlY3tiNjlhNTcwNC02ZTRiLTQ5ZWItOTlkZC0yNGNhZGNhZWYwNDZ9`.",
        ru: "«Прочитайте» файл: `strings photo.jpg | grep -i cam` или `exiftool photo.jpg`. В `UserComment` появится строка `Y3NlY3tiNjlhNTcwNC02ZTRiLTQ5ZWItOTlkZC0yNGNhZGNhZWYwNDZ9`.",
        en: "“Read” the file: `strings photo.jpg | grep -i cam` or `exiftool photo.jpg`. The `UserComment` holds `Y3NlY3tiNjlhNTcwNC02ZTRiLTQ5ZWItOTlkZC0yNGNhZGNhZWYwNDZ9`.",
      },
      {
        uz: "Harf-raqamlardan iborat, oxiri `fQ` — bu **Base64**. Dekod qiling: `echo \"Y3NlY3tiNjlhNTcwNC02ZTRiLTQ5ZWItOTlkZC0yNGNhZGNhZWYwNDZ9\" | base64 -d` (yoki CyberChef).",
        kaa: "Hárip-sanlardan ibarat — bul **Base64**. Dekodlań: `base64 -d` yaki CyberChef.",
        ru: "Строка из букв и цифр — это **Base64**. Декодируйте: `base64 -d` или CyberChef.",
        en: "A string of letters and digits — it is **Base64**. Decode it: `base64 -d` or CyberChef.",
      },
      {
        uz: "Natija — flag: `csec{b69a5704-6e4b-49eb-99dd-24cadcaef046}`. `SnapCam` so‘zi boshqa EXIF maydoni (obyektiv nomi) — flagga kirmaydi, uni base64’ga qo‘shmang.",
        kaa: "Nátiyje — flag: `csec{b69a5704-6e4b-49eb-99dd-24cadcaef046}`. `SnapCam` — basqa EXIF maydanı, flagqa kirmeydi.",
        ru: "Результат — флаг: `csec{b69a5704-6e4b-49eb-99dd-24cadcaef046}`. Слово `SnapCam` — другое поле EXIF, в флаг не входит.",
        en: "The result is the flag: `csec{b69a5704-6e4b-49eb-99dd-24cadcaef046}`. The word `SnapCam` is a different EXIF field — not part of the flag, don’t include it in the Base64.",
      },
    ],
  },
  {
    id: "forensics-stego-binwalk",
    track: "forensics",
    order: 4,
    points: 250,
    difficulty: 3,
    title: {
      uz: "Rasm ortidagi kod",
      kaa: "Súwret artındaǵı kod",
      ru: "Код позади картинки",
      en: "The code behind the picture",
    },
    brief: {
      uz: "Arxivni yuklab oling, ichidan `vacation.jpg` rasmini chiqarib oling. Rasm oddiy fotoга o‘xshaydi va `strings … | grep flag` **hech narsa topmaydi** — bu safar flag metadatada emas, rasm **oxiriga ulangan** boshqa fayl ichida yashiringan. Uni toping.",
      kaa: "Arxivti júklep alıń, ishinen `vacation.jpg` súwretin shıǵarıp alıń. Súwret ápiwayı fotoǵa uqsaydı hám `strings … | grep flag` **hesh nárse tappaydı** — bul sapar flag súwrettiń **aqırına ulanǵan** basqa fayl ishinde jasırınǵan.",
      ru: "Скачайте архив, достаньте из него `vacation.jpg`. Фото выглядит обычным, а `strings … | grep flag` **ничего не находит** — на этот раз флаг не в метаданных, а в другом файле, **дописанном в конец** картинки.",
      en: "Download the archive and take out `vacation.jpg`. The photo looks ordinary and `strings … | grep flag` finds **nothing** — this time the flag is not in metadata but inside another file **appended to the end** of the picture.",
    },
    files: [
      {
        name: "beach-trip.zip",
        href: "/ctf/beach-trip.zip",
        size: "≈1.2 MB",
        note: {
          uz: "Ichida `vacation.jpg`. Avval ajrating, keyin rasmni tahlil qiling.",
          kaa: "Ishinde `vacation.jpg`. Aldın ajıratıń, keyin súwretti analiz qılıń.",
          ru: "Внутри `vacation.jpg`. Сначала распакуйте, затем анализируйте картинку.",
          en: "Contains `vacation.jpg`. Unzip first, then analyse the picture.",
        },
      },
    ],
    evidence: [
      {
        name: "terminal",
        lines: [
          "$ unzip beach-trip.zip",
          "  inflating: vacation.jpg",
          "$ strings vacation.jpg | grep -i flag",
          "    (hech narsa — nothing)",
          "$ binwalk vacation.jpg",
          "DECIMAL   HEXADECIMAL   DESCRIPTION",
          "-----------------------------------------------------------",
          "0         0x0           JPEG image data, EXIF standard",
          "1220523   0x129D6B      Zip archive data, name: flag.txt",
        ],
      },
    ],
    hints: [
      {
        uz: "`strings`/`exiftool` bu safar bo‘sh. `binwalk vacation.jpg` ishga soling — fayl ichida JPEG’dan keyin **Zip arxiv** borligini ko‘rsatadi.",
        kaa: "`strings`/`exiftool` bul sapar bos. `binwalk vacation.jpg` iske qosıń — JPEG’den keyin **Zip arxiv** barlıǵın kórsetedi.",
        ru: "`strings`/`exiftool` на этот раз пусты. Запустите `binwalk vacation.jpg` — он покажет **Zip-архив** после JPEG.",
        en: "`strings`/`exiftool` come up empty this time. Run `binwalk vacation.jpg` — it shows a **Zip archive** after the JPEG.",
      },
      {
        uz: "Yashirin faylni ajrating: `binwalk -e vacation.jpg` yoki to‘g‘ridan-to‘g‘ri `unzip vacation.jpg`. Ichida `flag.txt`.",
        kaa: "Jasırın fayldı ajıratıń: `binwalk -e vacation.jpg` yaki `unzip vacation.jpg`. Ishinde `flag.txt`.",
        ru: "Извлеките скрытый файл: `binwalk -e vacation.jpg` или прямо `unzip vacation.jpg`. Внутри `flag.txt`.",
        en: "Extract the hidden file: `binwalk -e vacation.jpg` or just `unzip vacation.jpg`. Inside is `flag.txt`.",
      },
    ],
    takeaway: {
      uz: "Bir fayl o‘z ichida boshqasini olib yurishi mumkin (polyglot). `strings` faqat ochiq matnni ko‘radi; siqilgan/ulangan ma’lumotni topish uchun `binwalk`, `foremost` yoki fayl imzolarini (`PK` — Zip) qidiring. JPEG `FF D9` (EOI) dan keyingi baytlar — doim shubhali.",
      kaa: "Bir fayl ózinde basqasın alıp júriwi múmkin (polyglot). `strings` tek ashıq tekstti kóredi; siqılǵan maǵlıwmat ushın `binwalk`, `foremost` yaki fayl imzaların (`PK`) izleń. JPEG `FF D9` den keyingi baytlar — hámeshe gúmanlı.",
      ru: "Один файл может нести в себе другой (polyglot). `strings` видит только открытый текст; для сжатых/дописанных данных ищите сигнатуры (`PK` — Zip) через `binwalk`, `foremost`. Байты после `FF D9` (EOI) в JPEG — всегда подозрительны.",
      en: "One file can carry another inside it (a polyglot). `strings` only sees plaintext; for compressed/appended data look for signatures (`PK` = Zip) with `binwalk` or `foremost`. Bytes after `FF D9` (EOI) in a JPEG are always suspect.",
    },
    solution: [
      {
        uz: "Yuklab olgan `beach-trip.zip` ni oching → `vacation.jpg` chiqadi. `strings vacation.jpg | grep -i flag` — bo‘sh, demak flag ochiq matnda emas.",
        kaa: "`beach-trip.zip` ti ashıń → `vacation.jpg`. `strings … | grep -i flag` bos — flag ashıq tekstte emes.",
        ru: "Распакуйте `beach-trip.zip` → `vacation.jpg`. `strings … | grep -i flag` пусто — флаг не в открытом тексте.",
        en: "Unzip `beach-trip.zip` → `vacation.jpg`. `strings … | grep -i flag` is empty — the flag is not in plaintext.",
      },
      {
        uz: "`binwalk vacation.jpg` ishga soling: u JPEG oxiridan keyin (offset 0x129D6B) **Zip arxiv** (`flag.txt`) borligini ko‘rsatadi. Rasmning `FF D9` belgisidan keyin fayl ulangan.",
        kaa: "`binwalk vacation.jpg`: JPEG aqırınan keyin **Zip arxiv** (`flag.txt`) barlıǵın kórsetedi.",
        ru: "`binwalk vacation.jpg`: после конца JPEG — **Zip-архив** (`flag.txt`). Файл дописан после маркера `FF D9`.",
        en: "`binwalk vacation.jpg` shows a **Zip archive** (`flag.txt`) after the JPEG’s end. A file was appended past the `FF D9` marker.",
      },
      {
        uz: "Ajrating: `binwalk -e vacation.jpg` yoki `unzip vacation.jpg` (u «extra bytes» haqida ogohlantiradi, lekin baribir ochadi). `flag.txt` ni o‘qing → `csec{b1nw4lk_f0und_wh4t_str1ngs_m1ss3d}`.",
        kaa: "Ajıratıń: `unzip vacation.jpg`. `flag.txt` → `csec{b1nw4lk_f0und_wh4t_str1ngs_m1ss3d}`.",
        ru: "Извлеките: `unzip vacation.jpg` (предупредит про «extra bytes», но откроет). Читаем `flag.txt` → `csec{b1nw4lk_f0und_wh4t_str1ngs_m1ss3d}`.",
        en: "Extract: `unzip vacation.jpg` (it warns about “extra bytes” but still opens). Read `flag.txt` → `csec{b1nw4lk_f0und_wh4t_str1ngs_m1ss3d}`.",
      },
    ],
  },
  // ── Crypto ─────────────────────────────────────────────────────────────
  {
    id: "crypto-layers",
    track: "crypto",
    order: 1,
    points: 150,
    difficulty: 2,
    title: { uz: "Ikki qavatli kod", kaa: "Eki qabatlı kod", ru: "Двухслойный код", en: "The two-layer code" },
    brief: {
      uz: "Bu matn ikki marta kodlangan: avval flag ROT13 bilan o‘zgartirilgan, so‘ng Base64 bilan o‘ralgan. Qatlamlarni teskari tartibda arting: avval Base64, keyin ROT13.",
      kaa: "Bul tekst eki ret kodlanǵan: aldın flag ROT13 penen ózgertilgen, sońınan Base64 penen oralǵan. Qatlamlardı keri tártipte arıtıń: aldın Base64, keyin ROT13.",
      ru: "Этот текст закодирован дважды: сначала флаг изменили ROT13, затем обернули Base64. Снимайте слои в обратном порядке: сначала Base64, потом ROT13.",
      en: "This text is encoded twice: the flag was first put through ROT13, then wrapped in Base64. Peel the layers in reverse: Base64 first, then ROT13.",
    },
    evidence: [
      {
        name: "secret.txt",
        lines: ["RUJCR0x7eW5scmVmX2NycnlfbmpubH0="],
      },
    ],
    hints: [
      {
        uz: "Oxiridagi `=` — Base64 belgisi. Avval Base64 asbobidan o‘tkazing.",
        kaa: "Aqırındaǵı `=` — Base64 belgisi. Aldın Base64 quralınan ótkeriń.",
        ru: "`=` в конце — признак Base64. Сначала пропустите через Base64.",
        en: "The `=` at the end marks Base64. Run it through the Base64 tool first.",
      },
      {
        uz: "Base64’dan keyin g‘alati matn chiqadi — u ROT13. Kriptografiya asbobida ROT13 ni qo‘llang.",
        kaa: "Base64’tan keyin qızıq tekst shıǵadı — ol ROT13. Kriptografiya quralında ROT13 ti qollań.",
        ru: "После Base64 выйдет странный текст — это ROT13. Примените ROT13 в инструменте.",
        en: "After Base64 you get odd text — that’s ROT13. Apply ROT13 in the tool.",
      },
    ],
    takeaway: {
      uz: "Kodlash qatlamlari — shifrlash emas: kalit yo‘q, har birini ketma-ket qaytarish mumkin. `=`, nuqta yoki g‘alati harflar sizga qaysi kodlash ekanini aytadi.",
      kaa: "Kodlaw qatlamları — shifrlaw emes: gilt joq, hár birin izbe-iz qaytarıw múmkin. `=`, noqat yamasa qızıq háripler sizge qaysı kodlaw ekenin aytadı.",
      ru: "Слои кодирования — не шифрование: ключа нет, каждый снимается по очереди. `=`, точки или странные буквы подсказывают тип кодировки.",
      en: "Layers of encoding are not encryption: there’s no key, each is reversed in turn. A `=`, dots or odd letters tell you which encoding it is.",
    },
    solution: [
      {
        uz: "Satr `=` bilan tugaydi — bu **Base64**. Avval uni Base64 asbobida dekod qiling → `EBBGL{ynlref_pecy_ajjl}` kabi g‘alati matn chiqadi.",
        kaa: "Satr `=` benen tamamlanadı — bul **Base64**. Aldın onı Base64 quralında dekodlań → qızıq tekst shıǵadı.",
        ru: "Строка кончается на `=` — это **Base64**. Сначала декодируйте её → выйдет странный текст.",
        en: "The string ends in `=` — that is **Base64**. Decode it first → you get odd-looking text.",
      },
      {
        uz: "Chiqqan matn harflari siljigan — bu **ROT13**. ROT13 asbobidan o‘tkazing: har harf 13 pozitsiyaga qaytadi.",
        kaa: "Shıqqan tekst háripleri jıljıǵan — bul **ROT13**. ROT13 quralınan ótkeriń.",
        ru: "В полученном тексте буквы сдвинуты — это **ROT13**. Пропустите через ROT13.",
        en: "The letters in that text are shifted — that is **ROT13**. Run it through ROT13.",
      },
      {
        uz: "Ikki qatlam artilgach flag chiqadi: `ROOTY{layers_peel_away}`.",
        kaa: "Eki qatlam arıtılǵannan keyin flag shıǵadı: `ROOTY{layers_peel_away}`.",
        ru: "После снятия двух слоёв выходит флаг: `ROOTY{layers_peel_away}`.",
        en: "After peeling both layers the flag appears: `ROOTY{layers_peel_away}`.",
      },
    ],
  },
  {
    id: "crypto-common-modulus",
    track: "crypto",
    order: 2,
    points: 300,
    difficulty: 3,
    title: {
      uz: "Umumiy modul (common modulus)",
      kaa: "Ulıwma modul (common modulus)",
      ru: "Общий модуль (common modulus)",
      en: "The common modulus",
    },
    brief: {
      uz: "Bitta xabar (`m`) **bir xil `N`** bilan, ammo ikki xil ochiq eksponent (`e1` va `e2`) orqali ikki marta shifrlangan. Bu RSA’ning klassik xatosi: `N` hech qachon qayta ishlatilmasligi kerak. `N` ni faktorlamasdan ham `m` ni tiklab, flagni toping.",
      kaa: "Bir xabar (`m`) **birdey `N`** menen, biraq eki túrli ashıq eksponent (`e1` hám `e2`) arqalı eki ret shifrlanǵan. Bul RSA’nıń klassikalıq qátesi. `N` di faktorlamay-aq `m` di tiklap, flagti tabıń.",
      ru: "Одно сообщение (`m`) зашифровано дважды с **одним и тем же `N`**, но разными открытыми экспонентами (`e1` и `e2`). Это классическая ошибка RSA: `N` нельзя переиспользовать. Восстановите `m` без факторизации `N` и найдите флаг.",
      en: "One message (`m`) was encrypted twice with **the same `N`** but two different public exponents (`e1` and `e2`). This is a classic RSA mistake: `N` must never be reused. Recover `m` without factoring `N` and find the flag.",
    },
    evidence: [
      {
        name: "challenge.txt",
        lines: [
          "N  = 84589102583846111521444759134397273936436349797253840765181513059330417342558532297238697964787553694859369609517107481138530215182402209218416866675364275716845951692837772888343533810914697216560695259003547347252140303492311053734845842889788609702120406833274403904575735230885476180587208105537685001151",
          "e1 = 17",
          "e2 = 65537",
          "c1 = 30291962728725622657961979486046437181984360690860075867671075520721402806019632726698812884552593880452377379789461626772598660368165575041253137687055820107219093615559463896214024591899683834843309827595011907191254291549693438002523101293102607799194724882022583022442915575356159461998990810223315260810",
          "c2 = 13751894395024615762246182285044830794460240454120072537743066825729931789586119470961103980923985308845564587714234659171078975812278049631715548789935775627771197556070755718850646118286095357317315023833872254209410958739529386425002019601913608718724258327601278037574991809699282293725903546971737900558",
        ],
      },
    ],
    hints: [
      {
        uz: "Bir xil `N`, turli `e` — bu **common modulus attack**. `e1` va `e2` o‘zaro tub (gcd = 1).",
        kaa: "Birdey `N`, túrli `e` — bul **common modulus attack**. `e1` hám `e2` ózara tuwısqan (gcd = 1).",
        ru: "Один `N`, разные `e` — это **common modulus attack**. `e1` и `e2` взаимно просты (gcd = 1).",
        en: "Same `N`, different `e` — this is the **common modulus attack**. `e1` and `e2` are coprime (gcd = 1).",
      },
      {
        uz: "Kengaytirilgan Evklid algoritmi bilan shunday `s`, `t` toping: `s·e1 + t·e2 = 1`. Bittasi manfiy chiqadi.",
        kaa: "Keńeytirilgen Evklid algoritmi menen `s`, `t` tabıń: `s·e1 + t·e2 = 1`. Biri teris boladı.",
        ru: "Через расширенный алгоритм Евклида найдите `s`, `t`: `s·e1 + t·e2 = 1`. Один из них отрицательный.",
        en: "With the extended Euclidean algorithm find `s`, `t` so that `s·e1 + t·e2 = 1`. One of them is negative.",
      },
      {
        uz: "Keyin `m = c1^s · c2^t mod N`. Manfiy daraja uchun mos ciphertextning modulyar teskarisini oling.",
        kaa: "Soń `m = c1^s · c2^t mod N`. Teris dáreje ushın sáykes ciphertexttiń modulyar keri mánin alıń.",
        ru: "Затем `m = c1^s · c2^t mod N`. Для отрицательной степени возьмите модульно обратный соответствующего шифротекста.",
        en: "Then `m = c1^s · c2^t mod N`. For the negative exponent use the modular inverse of that ciphertext.",
      },
    ],
    takeaway: {
      uz: "Bir xil modul `N` ni turli odamlarga yoki turli `e` bilan qayta ishlatish — jiddiy xato: hujumchi xususiy kalitni bilmasdan ham xabarni tiklaydi. Har kalit juftligi uchun yangi `N` yarating.",
      kaa: "Birdey modul `N` di túrli adamlarǵa yaki túrli `e` menen qayta islatiw — úlken qáte: húzjimshi jeke giltti bilmey-aq xabardı tiklaydı. Hár gilt juplıǵı ushın jańa `N` jaratıń.",
      ru: "Переиспользование одного модуля `N` для разных людей или разных `e` — серьёзная ошибка: атакующий восстановит сообщение, не зная приватного ключа. Для каждой пары ключей создавайте новый `N`.",
      en: "Reusing one modulus `N` across people or across different `e` is a serious flaw: an attacker recovers the message without ever knowing the private key. Generate a fresh `N` for every key pair.",
    },
    solution: [
      {
        uz: "Belgi: `N` ikki marta bir xil. RSA’da `N` qayta ishlatilsa va `gcd(e1, e2) = 1` bo‘lsa, xabar `m` ni faktorlashsiz tiklab bo‘ladi — bu **common modulus attack**.",
        kaa: "Belgi: `N` eki ret birdey. RSA’da `N` qayta islatılsa hám `gcd(e1, e2) = 1` bolsa, xabar `m` di faktorlamay tiklaw múmkin — **common modulus attack**.",
        ru: "Признак: `N` одинаков дважды. Если в RSA `N` переиспользован и `gcd(e1, e2) = 1`, сообщение `m` восстанавливается без факторизации — **common modulus attack**.",
        en: "The tell: `N` is the same twice. If RSA reuses `N` and `gcd(e1, e2) = 1`, the message `m` is recoverable without factoring — the **common modulus attack**.",
      },
      {
        uz: "Kengaytirilgan Evklid: `s·e1 + t·e2 = 1`. Bu yerda `s`, `t` ning biri manfiy. Matematik jihatdan `c1^s · c2^t = m^(s·e1) · m^(t·e2) = m^1 = m (mod N)`.",
        kaa: "Keńeytirilgen Evklid: `s·e1 + t·e2 = 1`. `c1^s · c2^t = m^(s·e1 + t·e2) = m (mod N)`.",
        ru: "Расширенный Евклид: `s·e1 + t·e2 = 1`. Тогда `c1^s · c2^t = m^(s·e1 + t·e2) = m (mod N)`.",
        en: "Extended Euclid: `s·e1 + t·e2 = 1`. Then `c1^s · c2^t = m^(s·e1 + t·e2) = m (mod N)`.",
      },
      {
        uz: "Manfiy daraja (masalan `t < 0`) uchun `c2^t = (c2^(-1))^(|t|) mod N` — ya’ni `c2` ning `N` bo‘yicha modulyar teskarisini oling. Buni Python (`pow(c, -1, N)`) yoki shu sahifadagi hisob yordamida qiling.",
        kaa: "Teris dáreje ushın `c2^t = (c2^(-1))^(|t|) mod N` — `c2` niń modulyar keri mánin alıń. Python `pow(c, -1, N)`.",
        ru: "Для отрицательной степени `c2^t = (c2^(-1))^(|t|) mod N` — возьмите модульно обратный `c2`. В Python: `pow(c, -1, N)`.",
        en: "For the negative exponent, `c2^t = (c2^(-1))^(|t|) mod N` — take the modular inverse of `c2`. In Python: `pow(c, -1, N)`.",
      },
      {
        uz: "`m` ni baytga aylantirsangiz (long_to_bytes), ASCII matn — flagning o‘zi chiqadi: `CTF4{935d2777d63121c5e9720b}`.",
        kaa: "`m` di baytqa aylandırsań (long_to_bytes), ASCII tekst — flag: `CTF4{935d2777d63121c5e9720b}`.",
        ru: "Переведя `m` в байты (long_to_bytes), получите ASCII-текст — сам флаг: `CTF4{935d2777d63121c5e9720b}`.",
        en: "Convert `m` to bytes (long_to_bytes) and the ASCII text is the flag itself: `CTF4{935d2777d63121c5e9720b}`.",
      },
    ],
  },
  {
    id: "crypto-impossible-vault",
    track: "crypto",
    order: 3,
    points: 500,
    difficulty: 3,
    title: {
      uz: "Imkonsiz sandiq (3 muhr)",
      kaa: "Múmkin emes sandıq (3 móhir)",
      ru: "Невозможный сейф (3 печати)",
      en: "The Impossible Vault (3 seals)",
    },
    brief: {
      uz: "Sandiqni uchta «muhr» qo‘riqlaydi, har biri «zamonaviy» kripto, ammo har birida halokatli **matematik xato** bor. Uchala muhrni buzing — har biridan bitta kalit bo‘lagi chiqadi. So‘ng ularni birlashtirib yakuniy AES shifrini oching va flagni toping.",
      kaa: "Sandıqtı úsh «móhir» qoriqlaydı, hár biri «zamanagóy» kripto, biraq hár birinde ólimli **matematikalıq qáte** bar. Úshewin de buzıń — hár birinen bir kalit bólegi shıǵadı. Soń olardı biriktirip AES shifrin ashıń.",
      ru: "Сейф охраняют три «печати», каждая — «современная» крипта, но в каждой фатальная **математическая ошибка**. Взломайте все три — из каждой выпадет часть ключа. Затем соберите их, расшифруйте финальный AES и найдите флаг.",
      en: "Three “seals” guard the vault, each “modern” crypto, but each hides a fatal **mathematical flaw**. Break all three — each yields a key part. Then combine them, decrypt the final AES and find the flag.",
    },
    evidence: [
      {
        name: "seals.json — seal 1 (RSA)",
        lines: [
          '"e": 3,',
          '"n": "<2048-bit modulus>",',
          '"c": "<136-digit integer — note: c is small compared to n>"',
        ],
      },
      {
        name: "seals.json — seal 2 (Vigenère)",
        lines: [
          "MIWEMCYBRNWR WK DYC PKH GP YGSBBY SEDDKASDZMC BB HVRGC LWYRK ...",
          'note: "Vigenère over uppercase English. Key length findable via Friedman IoC."',
        ],
      },
      {
        name: "seals.json — seal 3 (LFSR-16)",
        lines: [
          '"ciphertext": "bc76bc2d5e53df950de5b44e4bb87ed8a9",',
          '"polynomial": "x^16 + x^14 + x^13 + x^11 + 1"  (0xB400),',
          '"seed_bits": 16,',
          '"known_plaintext": "4b33593a → \\"K3Y:\\" (first 4 bytes)"',
        ],
      },
      {
        name: "seals.json — final (AES-256-CBC)",
        lines: [
          '"iv": "de778c85038bc71901ff00a248c240e5",',
          '"ciphertext": "45e3721a667c4c53a20e16f6bcde859e… (64 bytes)",',
          '"key": "SHA256(seal1_pt || seal2_pt || seal3_pt)",',
          '"iv_derivation": "MD5(seal1_pt || seal2_pt || seal3_pt)"',
        ],
      },
    ],
    hints: [
      {
        uz: "Muhr 1 (RSA): `e=3` va xabar kichik. `m^3 < n` bo‘lsa, modul umuman ishlamaydi — `c` to‘g‘ridan-to‘g‘ri `m^3`. Butun **kub ildiz** oling.",
        kaa: "Móhir 1 (RSA): `e=3`, xabar kishi. `m^3 < n` bolsa, `c` tuwrıdan-tuwrı `m^3`. Pútin **kub ildiz** alıń.",
        ru: "Печать 1 (RSA): `e=3`, сообщение маленькое. Если `m^3 < n`, модуль не срабатывает — `c` это просто `m^3`. Возьмите целый **кубический корень**.",
        en: "Seal 1 (RSA): `e=3`, small message. If `m^3 < n` the modulus never fires — `c` is just `m^3`. Take the integer **cube root**.",
      },
      {
        uz: "Muhr 2 (Vigenère): avval **IoC (Index of Coincidence)** bilan kalit uzunligini toping (ingliz matni ≈ 0.065), so‘ng har ustunga **chi-kvadrat** chastota hujumi — kalit `KRYPTOS`.",
        kaa: "Móhir 2 (Vigenère): **IoC** menen kalit uzınlıǵın tabıń, soń hár baǵanaǵa **chi-kvadrat** — kalit `KRYPTOS`.",
        ru: "Печать 2 (Vigenère): сначала длина ключа по **IoC** (англ. ≈ 0.065), затем **хи-квадрат** по каждому столбцу — ключ `KRYPTOS`.",
        en: "Seal 2 (Vigenère): find the key length via **IoC** (English ≈ 0.065), then **chi-squared** per column — the key is `KRYPTOS`.",
      },
      {
        uz: "Muhr 3 (LFSR-16): urug‘ atigi 16 bit (65 536 ta). Ma’lum ochiq matn `K3Y:` bilan barcha urug‘larni **brute-force** qiling: keystream ⊕ shifr = `K3Y:` bo‘lsa, topildi.",
        kaa: "Móhir 3 (LFSR-16): urıq 16 bit ǵana. `K3Y:` ma’lum matn menen barlıq urıqlardı **brute-force** qılıń.",
        ru: "Печать 3 (LFSR-16): сид всего 16 бит (65 536). С известным текстом `K3Y:` переберите все сиды **brute-force**.",
        en: "Seal 3 (LFSR-16): the seed is only 16 bits (65 536). With the known plaintext `K3Y:` **brute-force** every seed.",
      },
    ],
    takeaway: {
      uz: "«Zamonaviy» nom algoritmni xavfsiz qilmaydi. Paddingsiz RSA (`e=3`), qisqa kalitli Vigenère va 16-bitli LFSR — hammasi parametr xatosi tufayli buziladi. Xavfsizlik to‘g‘ri parametr va standart (OAEP, AEAD, CSPRNG)dan kelib chiqadi.",
      kaa: "«Zamanagóy» at algoritmdi qáwipsiz qılmaydı. Paddingsiz RSA, qısqa kalitli Vigenère, 16-bit LFSR — bári parametr qátesinen buzıladı. Qáwipsizlik durıs parametr hám standarttan keledi.",
      ru: "«Современное» название не делает алгоритм безопасным. RSA без паддинга (`e=3`), Vigenère с коротким ключом и 16-битный LFSR ломаются из-за ошибок в параметрах. Безопасность — от правильных параметров и стандартов (OAEP, AEAD, CSPRNG).",
      en: "A “modern” label does not make an algorithm safe. Unpadded RSA (`e=3`), short-key Vigenère and a 16-bit LFSR all fall to parameter mistakes. Security comes from correct parameters and standards (OAEP, AEAD, CSPRNG).",
    },
    solution: [
      {
        uz: "**Muhr 1 — RSA.** `e=3`, xabar 144 bit, `n` 2048 bit. `m^3 < n` bo‘lgani uchun `c = m^3` (modul ishlamaydi). `c` ning butun kub ildizini oling → `m` → baytga aylantiring: `S1:CAFEBABE0BADCODE` (1-kalit bo‘lagi).",
        kaa: "**Móhir 1 — RSA.** `c = m^3`. Kub ildiz → `m` → bayt: `S1:CAFEBABE0BADCODE`.",
        ru: "**Печать 1 — RSA.** `c = m^3`. Кубический корень → `m` → байты: `S1:CAFEBABE0BADCODE`.",
        en: "**Seal 1 — RSA.** `c = m^3`. Integer cube root → `m` → bytes: `S1:CAFEBABE0BADCODE`.",
      },
      {
        uz: "**Muhr 2 — Vigenère.** IoC bilan kalit uzunligi 7 ekanini aniqlang, chi-kvadrat bilan kalit `KRYPTOS` ni tiklang, matnni deshifrlang. Matn ichida 2-bo‘lak yozilgan: `CAFEDEADBABEFACE`.",
        kaa: "**Móhir 2 — Vigenère.** Kalit uzınlıǵı 7, kalit `KRYPTOS`. Matnda: `CAFEDEADBABEFACE`.",
        ru: "**Печать 2 — Vigenère.** Длина ключа 7, ключ `KRYPTOS`. В тексте: `CAFEDEADBABEFACE`.",
        en: "**Seal 2 — Vigenère.** Key length 7, key `KRYPTOS`. The text spells out: `CAFEDEADBABEFACE`.",
      },
      {
        uz: "**Muhr 3 — LFSR-16.** 0x0000–0xFFFF oralig‘idagi har urug‘ uchun 4 bayt keystream yarating, shifrning dastlabki 4 bayti bilan XOR qiling; `K3Y:` chiqqan urug‘ to‘g‘ri. Keyin to‘liq keystream bilan deshifrlang → `K3Y:BADC0FFEE1337` (3-bo‘lak).",
        kaa: "**Móhir 3 — LFSR-16.** Hár urıq ushın keystream, XOR; `K3Y:` chıqsa durıs → `K3Y:BADC0FFEE1337`.",
        ru: "**Печать 3 — LFSR-16.** Для каждого сида keystream, XOR; где вышло `K3Y:` — верный → `K3Y:BADC0FFEE1337`.",
        en: "**Seal 3 — LFSR-16.** For each seed make keystream, XOR; the one giving `K3Y:` is right → `K3Y:BADC0FFEE1337`.",
      },
      {
        uz: "**Yakuniy.** `combined = part1 || part2 || part3`; `aes_key = SHA256(combined)`, `iv = MD5(combined)`. AES-256-CBC bilan deshifrlang → flag: `CTF4{wh3n_m4th_b3tr4ys_y0ur_crypt0_its_g4m3_0v3r}`.",
        kaa: "**Juwmaq.** `aes_key=SHA256(combined)`, `iv=MD5(combined)`. AES-256-CBC → `CTF4{wh3n_m4th_b3tr4ys_y0ur_crypt0_its_g4m3_0v3r}`.",
        ru: "**Финал.** `aes_key=SHA256(combined)`, `iv=MD5(combined)`. AES-256-CBC → `CTF4{wh3n_m4th_b3tr4ys_y0ur_crypt0_its_g4m3_0v3r}`.",
        en: "**Final.** `aes_key=SHA256(combined)`, `iv=MD5(combined)`. AES-256-CBC → `CTF4{wh3n_m4th_b3tr4ys_y0ur_crypt0_its_g4m3_0v3r}`.",
      },
    ],
  },
];

export function getTrack(id: string) {
  return tracks.find((t) => t.id === id);
}

export function challengesOf(track: CtfTrackId) {
  return challenges.filter((c) => c.track === track).sort((a, b) => a.order - b.order);
}

export function getChallenge(id: string) {
  return challenges.find((c) => c.id === id);
}
