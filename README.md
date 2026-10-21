# RootY Team

Veb-ilovalar xavfsizligini o‘rgatish platformasi: interaktiv darslar,
laboratoriyalar, testlar va topshiriqlar. To‘rt tilda: o‘zbek (asosiy),
qoraqalpoq (lotin), rus, ingliz.

## Ishga tushirish

Node.js 24 kerak.

Birinchi marta (PowerShell):

```powershell
cd C:\Users\user\Projects\rooty-team
npm install
Copy-Item .env.example .env
```

Har safar:

```powershell
cd C:\Users\user\Projects\rooty-team
npm run dev
```

Brauzerda http://localhost:3000 ni oching — avtomatik ravishda tilingizga
(`/uz`, `/ru` …) yo‘naltiradi. To‘xtatish: terminalda `Ctrl+C`.

### Lokal PostgreSQL (ma’lumotlar bazasi bosqichidan)

Kompyuterda PostgreSQL o‘rnatilgan bo‘lsa, bir marta baza yarating
(o‘rnatishda kiritgan `postgres` parolini so‘raydi):

```powershell
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres rooty
```

So‘ng `.env` dagi qatorni to‘ldiring:

```
DATABASE_URL=postgresql://postgres:PAROLINGIZ@localhost:5432/rooty
```

Jadvallarni yarating (bir marta, keyin har `schema.ts` o‘zgarganda):

```powershell
npm run db:migrate
```

Admin hisob `.env` da turadi:

```
ADMIN_LOGIN=sizning.login
ADMIN_PASSWORD=uzun-va-murakkab-parol
ADMIN_NAME=Ism Familiya
```

Server har ishga tushganda (`npm run dev`, `npm start`) shu login bilan
admin yaratiladi; parolni `.env` da o‘zgartirib serverni qayta ishga
tushirsangiz — yangi parol kuchga kiradi (eski sessiyalar yopiladi).
Keyin http://localhost:3000/uz/login orqali kiring: admin avtomatik
http://localhost:3000/admin ga o‘tadi. Render'da xuddi shu uch qiymatni
dashboard → Environment ga yozing.

| Buyruq                     | Vazifasi                                         |
| -------------------------- | ------------------------------------------------ |
| `npm run dev`              | Ishlab chiqish serveri                           |
| `npm run build`            | Production build                                 |
| `npm run typecheck`        | TypeScript tekshiruvi (tarjimalar ham)           |
| `npm test`                 | Unit testlar                                     |
| `npm run lint`             | ESLint                                           |
| `npm run db:migrate`       | Bazadagi jadvallarni yangilash                   |
| `npm run db:generate`      | `schema.ts` o‘zgargach yangi migratsiya yaratish |
| `npm run db:studio`        | Bazani brauzerda ko‘rish (Drizzle Studio)        |
| `npm run admin:create -- …` | Admin yaratish yoki uning parolini tiklash      |

## Login va admin panel

- **O‘quvchilar** — hisobni admin ochadi (`/admin/students`): ism, login,
  guruh. Parol avtomatik yaratiladi va bir marta ko‘rsatiladi.
  O‘quvchi `/uz/login` dan kiradi; darsni ochgani, savollarga javoblari va
  «Darsni yakunladim» bosgani saqlanadi.
- **Admin panel** (`/admin`, faqat o‘zbekcha) — umumiy ko‘rinish va so‘nggi
  faollik, o‘quvchilar va har birining natijasi, guruhlar, darslar.
- **Xavfsizlik** — parollar argon2id bilan xeshlanadi; sessiya HttpOnly
  cookie, bazada faqat token xeshi saqlanadi; bir login uchun 15 daqiqada
  5 ta noto‘g‘ri urinishdan keyin kirish bloklanadi; har bir admin sahifa va
  amal serverda rolni qayta tekshiradi.

## Darslar: kod va admin panel

Darslar asosan kodda yoziladi (pastda). Admin panelda (`/admin/lessons`):

- **Tuzatish** — kod darsini JSON ko‘rinishida tahrirlab saqlasangiz, u
  koddagi versiya *ustidan* yoziladi va saytda darhol ko‘rinadi. Kod
  o‘zgarmaydi.
- **Kod versiyasiga qaytarish** — tuzatish o‘chadi, yana koddagi versiya
  ko‘rinadi. Tuzatishdan keyin kodni o‘zgartirsangiz, panel ogohlantiradi.
- **Yangi dars** — faqat panelda yashaydigan dars. Uni keyinroq kodga
  ko‘chirsangiz, paneldagisini «o‘chirish» kifoya.
- Panelda xato tuzilmali dars saqlanmaydi (4 til, savol javobi, widget
  nomi tekshiriladi).

Muhim: paneldagi tuzatishlar faqat bazada. Doimiy bo‘lishi kerak bo‘lsa,
o‘sha o‘zgarishni kodga ham kiriting va panelda «qaytarish»ni bosing.

## Tuzilma

```text
src/
  app/                     URL'lar — faqat sahifa fayllari (Next.js shu papkani o‘qiydi)
    [locale]/              Har bir sahifa 4 tilda: /uz, /kaa, /ru, /en
      learn/               Darslar katalogi va dars sahifasi
    globals.css            Ranglar va dizayn tokenlari
  proxy.ts                 Tilsiz URL → /uz, /kaa, /ru yoki /en

  frontend/                Brauzerda ko‘rinadigan hamma narsa
    components/            Header, footer, kartalar, til/mavzu tugmalari
      lesson/              Dars bloklarini chizuvchi komponentlar
    widgets/               Interaktiv vidjetlar (simulyatorlar)
      sim/                 Vidjetlar mantig‘i (toza funksiyalar, testlanadi)
    lessons/               Dars matnlari
      types.ts             Dars bloklari: text, callout, code, widget, check
      index.ts             Darslar ro‘yxati
      http-basics.ts       Namunaviy dars

  backend/                 Faqat serverda ishlaydigan kod (baza, login, testlar)

  shared/                  Ikkala tomon ham ishlatadi
    site.ts                Sayt nomi va manzili
    i18n/
      config.ts            Tillar ro‘yxati, Localized<T> turi
      messages/uz.ts       Interfeys matnlari (asosiy lug‘at)
      messages/{kaa,ru,en} Tarjimalar — biror kalit tushib qolsa typecheck xato beradi

tests/                     Unit testlar
.env                       Lokal sozlamalar va parollar (GitHub'ga chiqmaydi)
```

## Dizayn

Barcha ranglar `src/app/globals.css` dagi tokenlarda (`--accent`, `--surface` …).
Yorug‘/qorong‘i rejim shu tokenlarni almashtiradi. Brend rangini o‘zgartirish
uchun faqat `--accent` qiymatlarini yangilang. Komponentlarda qattiq rang
yozmang — `bg-surface`, `text-muted`, `text-accent` kabi nomlardan foydalaning.

## Yangi dars qo‘shish

1. `src/frontend/lessons/<slug>.ts` faylini yarating (`http-basics.ts` namunasi).
2. Har bir matn 4 tilda: `{ uz, kaa, ru, en }`.
3. Bloklar:
   - `heading` — bo‘lim sarlavhasi (mundarijada chiqadi)
   - `text` — matn; `` `kod` ``, `**qalin**`, bo‘sh qator = yangi paragraf
   - `callout` — `info` / `tip` / `warn` eslatma
   - `code` — kod namunasi
   - `widget` — interaktiv komponent (`src/frontend/widgets/` ga qo‘shib,
     `src/frontend/components/lesson/widgets.tsx` da ro‘yxatdan o‘tkaziladi)
   - `check` — o‘z-o‘zini tekshirish savoli (baholanmaydi)
4. `src/frontend/lessons/index.ts` dagi ro‘yxatga qo‘shing.
5. `npm test` — barcha tillar to‘ldirilganini tekshiradi.

## Deploy: Render + Neon

1. GitHub’ga push qiling.
2. Render → **New → Blueprint** → repo’ni tanlang (`render.yaml` o‘qiladi).
3. Muhit o‘zgaruvchilari:
   - `SITE_URL` — saytning haqiqiy manzili, masalan `https://rooty.onrender.com`
   - `DATABASE_URL` — Neon’dagi connection string (keyingi bosqichdan kerak)
4. Deploy.

Bepul Render rejasida server 15 daqiqa harakatsizlikdan keyin uxlaydi va
birinchi so‘rovda ~30–60 soniyada uyg‘onadi.

## Etika

Barcha laboratoriyalar faqat o‘quv maqsadida, platformaning o‘z izolyatsiya
qilingan muhitida bajariladi.
