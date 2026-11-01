import type { Localized } from "@/shared/i18n/config";

// Strings for the /rating page, kept next to it like the CTF arena's.

export const text = {
  eyebrow: { uz: "Musobaqa", kaa: "Jarıs", ru: "Соревнование", en: "Competition" },
  title: { uz: "Reyting", kaa: "Reyting", ru: "Рейтинг", en: "Rating" },
  lead: {
    uz: "Har bir yechilgan CTF topshirig‘i va tugatilgan dars uchun ball olasiz. Ball yig‘ilgani sari yangi daraja va nishon ochiladi.",
    kaa: "Hár bir sheshilgen CTF tapsırması hám tamamlanǵan sabaq ushın ball alasız. Ball jıynalǵan sayın jańa dáreje hám belgi ashıladı.",
    ru: "Баллы начисляются за каждое решённое CTF-задание и пройденный урок. С ростом баллов открываются новые звания и значки.",
    en: "Every solved CTF challenge and completed lesson earns points. As points add up, new ranks and badges unlock.",
  },
  players: { uz: "{n} ishtirokchi", kaa: "{n} qatnasıwshı", ru: "участников: {n}", en: "{n} players" },

  myRank: { uz: "Mening darajam", kaa: "Meniń dárejem", ru: "Моё звание", en: "My rank" },
  place: { uz: "{n}-o‘rin", kaa: "{n}-orın", ru: "{n}-е место", en: "#{n}" },
  points: { uz: "ball", kaa: "ball", ru: "балл.", en: "pts" },
  nextRank: {
    uz: "Keyingi daraja — {rank}: yana {n} ball",
    kaa: "Keyingi dáreje — {rank}: jáne {n} ball",
    ru: "Следующее звание — {rank}: ещё {n} балл.",
    en: "Next rank — {rank}: {n} more points",
  },
  topRank: {
    uz: "Eng yuqori darajaga erishdingiz!",
    kaa: "Eń joqarı dárejege eristińiz!",
    ru: "Вы достигли высшего звания!",
    en: "You have reached the top rank!",
  },
  signIn: {
    uz: "Reytingga kirish va daraja olish uchun tizimga kiring.",
    kaa: "Reytingke kiriw hám dáreje alıw ushın sistemaǵa kiriń.",
    ru: "Войдите, чтобы попасть в рейтинг и получать звания.",
    en: "Sign in to join the rating and earn ranks.",
  },
  signInCta: { uz: "Kirish", kaa: "Kiriw", ru: "Войти", en: "Sign in" },

  ladder: { uz: "Darajalar va nishonlar", kaa: "Dárejeler hám belgiler", ru: "Звания и значки", en: "Ranks and badges" },

  howTitle: { uz: "Ball qanday beriladi", kaa: "Ball qalay beriledi", ru: "Как начисляются баллы", en: "How points are earned" },
  howCtf: {
    uz: "CTF topshirig‘i — uning balli; har bir ochilgan maslahat ballni kamaytiradi (kamida 30% qoladi). Yechimni ko‘rsangiz ball berilmaydi.",
    kaa: "CTF tapsırması — onıń balı; hár bir ashılǵan kómek ballıdı kemeytedi (keminde 30% qaladı). Sheshimdi kórseńiz ball berilmeydi.",
    ru: "CTF-задание — его баллы; каждая открытая подсказка снижает их (не ниже 30%). За просмотр решения баллов нет.",
    en: "A CTF challenge — its points; each hint you open lowers them (never below 30%). Revealing the solution earns nothing.",
  },
  howLesson: {
    uz: "Tugatilgan dars — {n} ball.",
    kaa: "Tamamlanǵan sabaq — {n} ball.",
    ru: "Пройденный урок — {n} балл.",
    en: "A completed lesson — {n} points.",
  },
  howFair: {
    uz: "Faqat tizimga kirgan o‘quvchilarning serverda saqlangan natijalari hisoblanadi. Teng ball bo‘lsa, unga birinchi yetgan yuqorida turadi.",
    kaa: "Tek sistemaǵa kirgen oqıwshılardıń serverde saqlanǵan nátiyjeleri esaplanadı. Ball teń bolsa, oǵan birinshi jetken joqarıda turadı.",
    ru: "Учитываются только результаты учеников, сохранённые на сервере. При равенстве баллов выше тот, кто набрал их раньше.",
    en: "Only signed-in students’ results saved on the server count. On a tie, whoever got there first ranks higher.",
  },

  table: { uz: "Umumiy jadval", kaa: "Ulıwma keste", ru: "Общая таблица", en: "Full table" },
  search: { uz: "Ism bo‘yicha qidirish", kaa: "Atı boyınsha izlew", ru: "Поиск по имени", en: "Search by name" },
  allRanks: { uz: "Barcha darajalar", kaa: "Barlıq dárejeler", ru: "Все звания", en: "All ranks" },
  allGroups: { uz: "Barcha guruhlar", kaa: "Barlıq toparlar", ru: "Все группы", en: "All groups" },
  colStudent: { uz: "O‘quvchi", kaa: "Oqıwshı", ru: "Ученик", en: "Student" },
  colCtf: { uz: "CTF", kaa: "CTF", ru: "CTF", en: "CTF" },
  colLessons: { uz: "Darslar", kaa: "Sabaqlar", ru: "Уроки", en: "Lessons" },
  colPoints: { uz: "Ball", kaa: "Ball", ru: "Баллы", en: "Points" },
  you: { uz: "siz", kaa: "siz", ru: "вы", en: "you" },
  nobody: { uz: "Hech kim topilmadi", kaa: "Hesh kim tabılmadı", ru: "Никого не найдено", en: "Nobody found" },
  empty: {
    uz: "Reyting hali shakllanmagan. Birinchi ballni siz oling!",
    kaa: "Reyting ele qáliplespedi. Birinshi ballıdı siz alıń!",
    ru: "Рейтинг пока пуст. Наберите первые баллы!",
    en: "The rating is empty so far. Be the first to score!",
  },

  statPlayers: { uz: "Ishtirokchilar", kaa: "Qatnasıwshılar", ru: "Участники", en: "Players" },
  statMax: { uz: "Eng yuqori ball", kaa: "Eń joqarı ball", ru: "Максимум", en: "Top score" },
  statAvg: { uz: "O‘rtacha ball", kaa: "Ortasha ball", ru: "Средний балл", en: "Average" },
  statTasks: { uz: "Bajarilgan vazifalar", kaa: "Orınlanǵan tapsırmalar", ru: "Выполнено заданий", en: "Tasks done" },
} satisfies Record<string, Localized>;
