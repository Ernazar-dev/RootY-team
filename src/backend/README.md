# backend

Server tomonidagi kod. Brauzerga hech qachon yuborilmaydi: modullar
`import "server-only"` bilan boshlanadi yoki `"use server"` amallari.

| Fayl / papka                  | Vazifasi                                                        |
| ----------------------------- | --------------------------------------------------------------- |
| `db/schema.ts`                | Jadvallar sxemasi (o‘zgartirgach: `npm run db:generate`)        |
| `db/index.ts`                 | PostgreSQL ulanishi                                             |
| `auth/password.ts`            | argon2id xesh, parol yaratish, login qoidalari                  |
| `auth/session.ts`             | Sessiyalar: cookie'da token, bazada faqat uning xeshi           |
| `auth/dal.ts`                 | `getCurrentUser`, `requireAdmin` — har bir tekshiruv shu yerdan |
| `auth/rate-limit.ts`          | Parol topishga qarshi cheklov, xavfsiz yo‘naltirish             |
| `auth/actions.ts`             | Kirish / chiqish amallari                                       |
| `lessons/merge.ts`            | Kod darslari + admin tuzatishlari qanday birlashadi             |
| `lessons/catalog.ts`          | Saytdagi darslar ro‘yxati (keshlangan)                          |
| `services/progress-actions.ts`| O‘quvchi natijasini saqlash (dars sahifasidan)                  |
| `services/admin.ts`           | Admin panel uchun o‘qish                                        |
| `services/admin-actions.ts`   | Admin panel amallari                                            |

Qoida: `"use server"` faylidagi har bir eksport — ochiq endpoint. U
foydalanuvchini o‘zi sessiyadan aniqlashi (`readSession` / `requireAdmin`)
va kirishni o‘zi tekshirishi kerak; `userId` ni argument sifatida qabul
qiladigan yordamchilar boshqa (server-only) faylda turadi.
