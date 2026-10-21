import type { Lesson } from "./types";

// Plan: month 1, week 1, lesson 3 — Linux file system and basic commands.
// Examples match the practice terminal's files (widgets/linux-terminal.tsx),
// except the hidden flag, which the last mission asks the learner to find.
// Saved answers are keyed by check position: add new checks at the end.
const lesson: Lesson = {
  slug: "linux-basics",
  track: "web-security",
  order: 3,
  level: "beginner",
  minutes: 25,
  title: {
    uz: "Linux fayl tizimi: terminalda birinchi qadamlar",
    kaa: "Linux fayl sisteması: terminalda birinshi qádemler",
    ru: "Файловая система Linux: первые шаги в терминале",
    en: "The Linux file system: first steps in the terminal",
  },
  summary: {
    uz: "Sichqonchasiz, faqat yozib kompyuterni boshqarishni o‘rganamiz: qayerda turganingizni bilish, papkalar bo‘ylab yurish va fayllarni o‘qish. Har bir xaker va tizim administratori ishni aynan shundan boshlaydi.",
    kaa: "Tışqansız, tek jazıp kompyuterdi basqarıwdı úyrenemiz: qay jerde turǵanıńızdı biliw, papkalar boylap júriw hám fayllardı oqıw. Hár bir xaker hám sistema administratorı jumıstı dál usınnan baslaydı.",
    ru: "Учимся управлять компьютером без мыши, одним текстом: узнавать, где вы, ходить по папкам и читать файлы. Именно с этого начинает работу любой хакер и системный администратор.",
    en: "We learn to drive a computer without a mouse, by typing: find out where you are, move between folders and read files. Every hacker and system administrator starts here.",
  },
  blocks: [
    {
      kind: "goals",
      items: [
        {
          uz: "Terminalda hozir qayerda turganingizni bilasiz (`pwd`)",
          kaa: "Terminalda házir qay jerde turǵanıńızdı bilesiz (`pwd`)",
          ru: "Узнавать, где вы сейчас находитесь (`pwd`)",
          en: "Tell where you are right now (`pwd`)",
        },
        {
          uz: "Papka ichida nima borligini, yashirin fayllar bilan birga ko‘rasiz (`ls`, `ls -a`)",
          kaa: "Papka ishinde ne bar ekenin, jasırın fayllar menen birge kóresiz (`ls`, `ls -a`)",
          ru: "Смотреть, что лежит в папке, включая скрытые файлы (`ls`, `ls -a`)",
          en: "See what is in a folder, hidden files included (`ls`, `ls -a`)",
        },
        {
          uz: "Papkalar orasida yurasiz va adashib qolmaysiz (`cd`, `..`, `~`)",
          kaa: "Papkalar arasında júresiz hám adasıp qalmaysız (`cd`, `..`, `~`)",
          ru: "Переходить между папками и не теряться (`cd`, `..`, `~`)",
          en: "Move between folders without getting lost (`cd`, `..`, `~`)",
        },
        {
          uz: "Fayl ichini o‘qiysiz va yangi papka ochasiz (`cat`, `mkdir`)",
          kaa: "Fayl ishin oqıysız hám jańa papka ashasız (`cat`, `mkdir`)",
          ru: "Читать файлы и создавать папки (`cat`, `mkdir`)",
          en: "Read files and create folders (`cat`, `mkdir`)",
        },
        {
          uz: "Nega xakerlar birinchi bo‘lib `/etc` va `/var/log` papkalariga qarashini tushunasiz",
          kaa: "Ne ushın xakerler birinshi bolıp `/etc` hám `/var/log` papkalarına qarawın túsinesiz",
          ru: "Понимать, почему хакер первым делом заглядывает в `/etc` и `/var/log`",
          en: "Understand why an attacker looks in `/etc` and `/var/log` first",
        },
      ],
    },

    {
      kind: "heading",
      id: "terminal",
      text: { uz: "Terminal nima va u nega kerak?", kaa: "Terminal ne hám ol ne ushın kerek?", ru: "Что такое терминал и зачем он нужен", en: "What a terminal is and why you need it" },
    },
    {
      kind: "text",
      text: {
        uz: "Telefonda papkani ochish uchun unga barmoq bilan bosasiz. **Terminal**da xuddi shu ishni yozib bajarasiz: «papkani och» o‘rniga `cd papka` deb yozasiz va Enter bosasiz. Kompyuter javobni matn qilib chiqaradi.\n\nNega bunday noqulay usul? Chunki internetdagi saytlarning ko‘pchiligi **Linux serverlar**da ishlaydi va ularda ekran ham, sichqoncha ham yo‘q — faqat terminal bor. Saytni himoya qiladigan mutaxassis ham, unga hujum qiladigan xaker ham serverga aynan terminal orqali kiradi.",
        kaa: "Telefonda papkanı ashıw ushın oǵan barmaq penen basasız. **Terminal**da dál usı jumıstı jazıp orınlaysız: «papkanı ash» ornına `cd papka` dep jazasız hám Enter basasız. Kompyuter juwaptı tekst etip shıǵaradı.\n\nNe ushın bunday qolaysız usıl? Sebebi internettegi saytlardıń kópshiligi **Linux serverler**de isleydi hám olarda ekran da, tışqan da joq — tek terminal bar. Saytı qorǵaytuǵın qánige de, oǵan hújim jasaytuǵın xaker de serverge dál terminal arqalı kiredi.",
        ru: "На телефоне, чтобы открыть папку, вы нажимаете на неё пальцем. В **терминале** то же самое делается текстом: вместо «открыть папку» вы пишете `cd папка` и жмёте Enter. Компьютер отвечает тоже текстом.\n\nЗачем такой неудобный способ? Большинство сайтов в интернете работает на **Linux-серверах**, а у них нет ни экрана, ни мыши — только терминал. И защитник сайта, и атакующий попадают на сервер именно через терминал.",
        en: "On a phone you open a folder by tapping it. In a **terminal** you do the same thing by typing: instead of “open the folder” you write `cd folder` and press Enter. The computer answers in text too.\n\nWhy such an awkward way? Most websites run on **Linux servers**, and those have no screen and no mouse — only a terminal. Both the person defending a site and the attacker get onto the server through a terminal.",
      },
    },
    {
      kind: "terms",
      items: [
        {
          term: "terminal",
          text: {
            uz: "Kompyuterga matn bilan buyruq beradigan oyna",
            kaa: "Kompyuterge tekst penen buyrıq beretuǵın áyne",
            ru: "Окно, где компьютеру дают команды текстом",
            en: "A window where you give the computer typed commands",
          },
        },
        {
          term: "command",
          text: {
            uz: "**Buyruq** — kompyuterga beriladigan bitta topshiriq, masalan `ls`",
            kaa: "**Buyrıq** — kompyuterge beriletuǵın bir tapsırma, mısalı `ls`",
            ru: "**Команда** — одно задание компьютеру, например `ls`",
            en: "One instruction for the computer, such as `ls`",
          },
        },
        {
          term: "directory",
          text: {
            uz: "**Papka** (katalog). Linux'da papkani ko‘pincha shunday atashadi",
            kaa: "**Papka** (katalog). Linux'ta papkanı kóbinese usılay ataydı",
            ru: "**Папка** (каталог). В Linux папку обычно называют так",
            en: "A **folder**. That is what Linux usually calls one",
          },
        },
        {
          term: "path",
          text: {
            uz: "**Yo‘l** — fayl yoki papkaning manzili, masalan `/home/student/notes.txt`",
            kaa: "**Jol** — fayl yamasa papkanıń mánzili, mısalı `/home/student/notes.txt`",
            ru: "**Путь** — адрес файла или папки, например `/home/student/notes.txt`",
            en: "The address of a file or folder, such as `/home/student/notes.txt`",
          },
        },
        {
          term: "/",
          text: {
            uz: "**Ildiz** (root) — eng yuqori papka, hamma narsa shu yerdan boshlanadi",
            kaa: "**Túbir** (root) — eń joqarǵı papka, hámme nárse usı jerden baslanadı",
            ru: "**Корень** (root) — самая верхняя папка, с неё начинается всё",
            en: "The **root** — the top folder that everything else lives under",
          },
        },
        {
          term: "~",
          text: {
            uz: "Sizning **uy papkangiz**, masalan `/home/student`",
            kaa: "Sizdiń **úy papkańız**, mısalı `/home/student`",
            ru: "Ваша **домашняя папка**, например `/home/student`",
            en: "Your **home folder**, for example `/home/student`",
          },
        },
        {
          term: ".fayl",
          text: {
            uz: "Nomi nuqta bilan boshlangan **yashirin fayl**: oddiy `ls` uni ko‘rsatmaydi",
            kaa: "Atı noqat penen baslanǵan **jasırın fayl**: ápiwayı `ls` onı kórsetpeydi",
            ru: "**Скрытый файл**, имя начинается с точки: обычный `ls` его не покажет",
            en: "A **hidden file** whose name starts with a dot: a plain `ls` won’t show it",
          },
        },
      ],
    },

    {
      kind: "heading",
      id: "tree",
      text: { uz: "Fayl tizimi — ko‘p qavatli uy", kaa: "Fayl sisteması — kóp qabatlı úy", ru: "Файловая система — многоэтажный дом", en: "The file system is an apartment block" },
    },
    {
      kind: "text",
      text: {
        uz: "Windows'da `C:`, `D:` kabi disklar bor. Linux'da esa hamma narsa bitta **ildiz** — `/` dan boshlanadi. Uni ko‘p qavatli uy deb tasavvur qiling: `/` — binoning o‘zi, ichida esa har birining o‘z vazifasi bor xonalar.\n\nHar bir faylning to‘liq manzili bor, xuddi pochta manzili kabi. `/home/student/notes.txt` ni chapdan o‘ngga o‘qing: «bino → turar joylar → student xonadoni → notes.txt fayli».",
        kaa: "Windows'ta `C:`, `D:` sıyaqlı diskler bar. Linux'ta bolsa hámme nárse bir **túbir** — `/` den baslanadı. Onı kóp qabatlı úy dep kóz aldıńızǵa keltiriń: `/` — imarattıń ózi, ishinde bolsa hár biriniń óz wazıypası bar bólmeler.\n\nHár bir fayldıń tolıq mánzili bar, pochta mánzili sıyaqlı. `/home/student/notes.txt` tı shepten ońǵa oqıń: «imarat → turaq jaylar → student kvartirası → notes.txt faylı».",
        ru: "В Windows есть диски `C:`, `D:`. В Linux всё начинается с одного **корня** — `/`. Представьте многоэтажный дом: `/` — само здание, а внутри комнаты, у каждой своё назначение.\n\nУ каждого файла есть полный адрес, как почтовый. Читайте `/home/student/notes.txt` слева направо: «здание → жилые квартиры → квартира student → файл notes.txt».",
        en: "Windows has drives like `C:` and `D:`. On Linux everything starts from one **root**, `/`. Picture an apartment block: `/` is the building, and inside are rooms, each with its own job.\n\nEvery file has a full address, like a postal one. Read `/home/student/notes.txt` left to right: “building → apartments → student’s flat → the file notes.txt”.",
      },
    },
    {
      kind: "code",
      language: "text",
      code: {
        uz: "/            ← ildiz: butun bino\n├── home/    ← foydalanuvchilar xonadonlari\n│   └── student/   ← sizning uyingiz (~)\n├── root/    ← administrator (root) xonasi\n├── etc/     ← sozlamalar: binoning hujjatlari\n├── var/log/ ← jurnallar: kuzatuv kamerasi yozuvlari\n├── tmp/     ← vaqtinchalik fayllar: hammaga ochiq yo‘lak\n└── bin/     ← dasturlar: asboblar xonasi",
        kaa: "/            ← túbir: pútkil imarat\n├── home/    ← paydalanıwshılar kvartiraları\n│   └── student/   ← sizdiń úyińiz (~)\n├── root/    ← administrator (root) bólmesi\n├── etc/     ← sazlawlar: imarattıń hújjetleri\n├── var/log/ ← jurnallar: baqlaw kamerası jazıwları\n├── tmp/     ← waqıtsha fayllar: hámmege ashıq dáliz\n└── bin/     ← programmalar: ásbaplar bólmesi",
        ru: "/            ← корень: всё здание\n├── home/    ← квартиры пользователей\n│   └── student/   ← ваш дом (~)\n├── root/    ← комната администратора (root)\n├── etc/     ← настройки: документы здания\n├── var/log/ ← журналы: записи камер наблюдения\n├── tmp/     ← временные файлы: общий коридор\n└── bin/     ← программы: кладовая с инструментами",
        en: "/            ← root: the whole building\n├── home/    ← users' flats\n│   └── student/   ← your home (~)\n├── root/    ← the administrator's (root) room\n├── etc/     ← settings: the building's paperwork\n├── var/log/ ← logs: the security camera recordings\n├── tmp/     ← temporary files: a corridor open to all\n└── bin/     ← programs: the tool room",
      },
      caption: {
        uz: "Eng muhim papkalar. Hammasini yodlash shart emas — hozircha `home`, `etc` va `var/log` yetarli.",
        kaa: "Eń áhmiyetli papkalar. Hámmesin yadlaw shárt emes — házirshe `home`, `etc` hám `var/log` jetkilikli.",
        ru: "Главные папки. Запоминать все не нужно — пока хватит `home`, `etc` и `var/log`.",
        en: "The key folders. No need to memorise them all — `home`, `etc` and `var/log` are enough for now.",
      },
    },
    {
      kind: "callout",
      tone: "info",
      text: {
        uz: "**Nega aynan `/etc` va `/var/log`?** `/etc` da kompyuter qanday sozlanganini ko‘rasiz: uning nomi, qaysi tizim o‘rnatilgani, qanday foydalanuvchilar borligi. `/var/log` da esa kim qachon tizimga kirgani yozib boriladi. Xaker uchun bu — xarita, himoyachi uchun esa — iz qoldiruvchi kamera.",
        kaa: "**Ne ushın dál `/etc` hám `/var/log`?** `/etc` te kompyuter qalay sazlanǵanın kóresiz: onıń atı, qaysı sistema ornatılǵanı, qanday paydalanıwshılar bar ekenligi. `/var/log` ta bolsa kim qashan sistemaǵa kirgeni jazıp barıladı. Xaker ushın bul — karta, qorǵawshı ushın bolsa — iz qaldıratuǵın kamera.",
        ru: "**Почему именно `/etc` и `/var/log`?** В `/etc` видно, как настроен компьютер: его имя, какая система стоит, какие есть пользователи. В `/var/log` записывается, кто и когда входил в систему. Для атакующего это карта, для защитника — камера, которая хранит следы.",
        en: "**Why `/etc` and `/var/log`?** `/etc` shows how the machine is set up: its name, which system is installed, which users exist. `/var/log` records who logged in and when. For an attacker that is a map; for a defender it is a camera that keeps the evidence.",
      },
    },

    {
      kind: "heading",
      id: "commands",
      text: { uz: "Beshta asosiy buyruq — qadamma-qadam", kaa: "Bes tiykarǵı buyrıq — qádemme-qádem", ru: "Пять главных команд — по шагам", en: "Five core commands, step by step" },
    },
    {
      kind: "text",
      text: {
        uz: "Har bir buyruq nomi inglizcha so‘zlarning qisqartmasi. Ma’nosini bilsangiz, yodlash oson: `pwd` — *print working directory* («qaysi papkadaman?»), `ls` — *list* («ro‘yxat»), `cd` — *change directory* («papkani almashtir»), `cat` — *concatenate* («faylni chiqar»), `mkdir` — *make directory* («papka yarat»).\n\nQuyidagi qadamlarni pastdagi mashq terminalida o‘zingiz takrorlashingiz mumkin.",
        kaa: "Hár bir buyrıq atı inglisshe sózlerdiń qısqartpası. Mánisin bilseńiz, yadlaw ańsat: `pwd` — *print working directory* («qaysı papkadaman?»), `ls` — *list* («dizim»), `cd` — *change directory* («papkanı almastır»), `cat` — *concatenate* («fayldı shıǵar»), `mkdir` — *make directory* («papka jasa»).\n\nTómendegi qádemlerdi sabaqtıń tómenindegi shınıǵıw terminalında ózińiz qaytalawıńız múmkin.",
        ru: "Каждое имя команды — сокращение английских слов. Зная смысл, запомнить легко: `pwd` — *print working directory* («в какой я папке?»), `ls` — *list* («список»), `cd` — *change directory* («сменить папку»), `cat` — *concatenate* («вывести файл»), `mkdir` — *make directory* («создать папку»).\n\nВсе шаги ниже можно повторить в тренажёре дальше по уроку.",
        en: "Each command name is short for English words, so the meaning helps it stick: `pwd` is *print working directory* (“which folder am I in?”), `ls` is *list*, `cd` is *change directory*, `cat` is *concatenate* (“print the file”), `mkdir` is *make directory*.\n\nYou can repeat every step below in the practice terminal further down.",
      },
    },
    {
      kind: "steps",
      items: [
        {
          text: {
            uz: "**Qayerdaman?** Terminal ochilganda siz doim qaysidir papkada turasiz. `pwd` shu papkaning to‘liq manzilini aytadi.",
            kaa: "**Qay jerdemen?** Terminal ashılǵanda siz hámme waqıt qaysı bir papkada turasız. `pwd` usı papkanıń tolıq mánzilin aytadı.",
            ru: "**Где я?** Когда терминал открыт, вы всегда находитесь в какой-то папке. `pwd` называет её полный адрес.",
            en: "**Where am I?** Whenever a terminal is open you are standing in some folder. `pwd` tells you its full address.",
          },
          code: "pwd",
          output: "/home/student",
        },
        {
          text: {
            uz: "**Bu yerda nima bor?** `ls` papkadagi fayl va papkalar ro‘yxatini chiqaradi. `notes.txt` — fayl, `projects` — papka.",
            kaa: "**Bul jerde ne bar?** `ls` papkadaǵı fayl hám papkalar dizimin shıǵaradı. `notes.txt` — fayl, `projects` — papka.",
            ru: "**Что здесь лежит?** `ls` выводит список файлов и папок. `notes.txt` — файл, `projects` — папка.",
            en: "**What is here?** `ls` lists the files and folders. `notes.txt` is a file, `projects` is a folder.",
          },
          code: "ls",
          output: "notes.txt  projects",
        },
        {
          text: {
            uz: "**Faylni o‘qing.** `cat` fayl ichidagi matnni ekranga chiqaradi. Bu eslatmada keyingi topshiriq uchun maslahat bor.",
            kaa: "**Fayldı oqıń.** `cat` fayl ishindegi tekstti ekranǵa shıǵaradı. Bul eskertpede keyingi tapsırma ushın másláhát bar.",
            ru: "**Прочитайте файл.** `cat` выводит текст файла на экран. В этой записке есть подсказка к следующему заданию.",
            en: "**Read a file.** `cat` prints a file’s text to the screen. This note holds a hint for a later task.",
          },
          code: "cat notes.txt",
          output: {
            uz: "Salom, tadqiqotchi!\nBu papkada yashirin fayl bor.\n…",
            kaa: "Sálem, izertlewshi!\nBul papkada jasırın fayl bar.\n…",
            ru: "Привет, исследователь!\nВ этой папке есть скрытый файл.\n…",
            en: "Hello, explorer!\nThere is a hidden file in this folder.\n…",
          },
        },
        {
          text: {
            uz: "**Papkaga kiring.** `cd projects` — `projects` ichiga o‘tish. Endi `ls` shu papka ichini ko‘rsatadi.",
            kaa: "**Papkaǵa kiriń.** `cd projects` — `projects` ishine ótiw. Endi `ls` usı papka ishin kórsetedi.",
            ru: "**Зайдите в папку.** `cd projects` — перейти внутрь `projects`. Теперь `ls` покажет её содержимое.",
            en: "**Go into a folder.** `cd projects` moves you inside `projects`. Now `ls` shows what is in there.",
          },
          code: "cd projects\nls",
          output: "todo.txt",
        },
        {
          text: {
            uz: "**Orqaga qayting.** `cd ..` — bir pog‘ona yuqoriga, ya’ni oldingi papkaga. `cd ~` esa qayerda bo‘lsangiz ham to‘g‘ri uyingizga qaytaradi.",
            kaa: "**Artqa qaytıń.** `cd ..` — bir basqısh joqarıǵa, yaǵnıy aldıńǵı papkaǵa. `cd ~` bolsa qay jerde bolsańız da tuwrı úyińizge qaytaradı.",
            ru: "**Вернитесь назад.** `cd ..` — на уровень выше, в предыдущую папку. А `cd ~` откуда угодно возвращает прямо домой.",
            en: "**Go back.** `cd ..` goes one level up, to the folder before. `cd ~` takes you straight home from anywhere.",
          },
          code: "cd ..\npwd",
          output: "/home/student",
        },
        {
          text: {
            uz: "**O‘z papkangizni yarating.** `mkdir lab` yangi `lab` papkasini ochadi. `ls` bilan tekshiring — u ro‘yxatda paydo bo‘ladi.",
            kaa: "**Óz papkańızdı jasań.** `mkdir lab` jańa `lab` papkasın ashadı. `ls` penen tekseriń — ol dizimde payda boladı.",
            ru: "**Создайте свою папку.** `mkdir lab` создаёт папку `lab`. Проверьте через `ls` — она появится в списке.",
            en: "**Make your own folder.** `mkdir lab` creates a `lab` folder. Check with `ls` — it appears in the list.",
          },
          code: "mkdir lab\nls",
          output: "lab  notes.txt  projects",
        },
        {
          text: {
            uz: "**Yashirin fayllarni ko‘ring.** `ls -a` (*all* — «hammasi») nuqta bilan boshlanadigan fayllarni ham ko‘rsatadi. Natijani o‘zingiz mashq terminalida ko‘ring — u yerda sizni topishmoq kutmoqda.",
            kaa: "**Jasırın fayllardı kóriń.** `ls -a` (*all* — «hámmesi») noqat penen baslanatuǵın fayllardı da kórsetedi. Nátiyjeni ózińiz shınıǵıw terminalında kóriń — ol jerde sizdi jumbaq kútip tur.",
            ru: "**Посмотрите скрытые файлы.** `ls -a` (*all* — «все») показывает и файлы, начинающиеся с точки. Результат посмотрите сами в тренажёре — там вас ждёт загадка.",
            en: "**See hidden files.** `ls -a` (*all*) also shows files that start with a dot. See the result yourself in the practice terminal — a puzzle is waiting there.",
          },
          code: "ls -a",
        },
      ],
    },
    {
      kind: "callout",
      tone: "tip",
      text: {
        uz: "**To‘liq va qisqa manzil.** `/` bilan boshlangan yo‘l — **absolyut**, ya’ni to‘liq manzil: «Toshkent, Chilonzor, 5-uy». U qayerda turganingizdan qat’i nazar bir joyni ko‘rsatadi: `cd /etc`. Boshqa yo‘llar — **nisbiy**, ya’ni «qo‘shni uy» kabi: hozir turgan joyingizdan hisoblanadi: `cd projects`.",
        kaa: "**Tolıq hám qısqa mánzil.** `/` penen baslanǵan jol — **absolyut**, yaǵnıy tolıq mánzil: «Nókis, Ǵárezsizlik kóshesi, 5-úy». Ol qay jerde turǵanıńızǵa qaramastan bir jerdi kórsetedi: `cd /etc`. Basqa jollar — **salıstırmalı**, yaǵnıy «qońsı úy» sıyaqlı: házir turǵan jerińizden esaplanadı: `cd projects`.",
        ru: "**Полный и короткий адрес.** Путь, начинающийся с `/`, — **абсолютный**, это полный адрес: «Ташкент, Чиланзар, дом 5». Он указывает на одно место, где бы вы ни были: `cd /etc`. Остальные — **относительные**, как «соседний дом»: считаются от того места, где вы сейчас: `cd projects`.",
        en: "**Full and short addresses.** A path that starts with `/` is **absolute** — a full address like “5 Main Street, Springfield”. It points to the same place wherever you are: `cd /etc`. Any other path is **relative**, like “the house next door”: it counts from where you are now: `cd projects`.",
      },
    },

    {
      kind: "heading",
      id: "practice",
      text: { uz: "Amaliyot: missiyalar", kaa: "Ámeliyat: missiyalar", ru: "Практика: миссии", en: "Practice: missions" },
    },
    {
      kind: "text",
      text: {
        uz: "Endi o‘zingiz bajaring. Bu haqiqiy terminal emas, xavfsiz mashq maydoni — hech narsani buzib qo‘ymaysiz. O‘ngdagi missiyalarni ketma-ket bajaring. Oxirgisi — kichik topishmoq: javob yashirin faylda.\n\nFoydali tugma: **↑** — oldingi buyruqni qaytaradi. Qo‘shimcha topshiriq: `cat /etc/hostname` va `cat /var/log/auth.log` ni ham o‘qib ko‘ring.",
        kaa: "Endi ózińiz orınlań. Bul haqıyqıy terminal emes, qáwipsiz shınıǵıw maydanı — hesh nárseni buzıp qoymaysız. Oń táreptegi missiyalardı izbe-iz orınlań. Aqırǵısı — kishi jumbaq: juwap jasırın faylda.\n\nPaydalı túyme: **↑** — aldıńǵı buyrıqtı qaytaradı. Qosımsha tapsırma: `cat /etc/hostname` hám `cat /var/log/auth.log` tı da oqıp kóriń.",
        ru: "Теперь сами. Это не настоящий терминал, а безопасный тренажёр — ничего не сломаете. Выполняйте миссии справа по порядку. Последняя — маленькая загадка: ответ в скрытом файле.\n\nПолезная клавиша: **↑** — вернуть прошлую команду. Дополнительно прочитайте `cat /etc/hostname` и `cat /var/log/auth.log`.",
        en: "Now it’s your turn. This is not a real terminal but a safe practice area — you can’t break anything. Do the missions on the right in order. The last one is a small puzzle: the answer is in a hidden file.\n\nHandy key: **↑** brings back your last command. Bonus: also read `cat /etc/hostname` and `cat /var/log/auth.log`.",
      },
    },
    { kind: "widget", widget: "linux-terminal" },

    {
      kind: "heading",
      id: "real-life",
      text: { uz: "Haqiqiy hayotda qanday ishlatiladi", kaa: "Haqıyqıy turmısta qalay qollanıladı", ru: "Как это выглядит в реальной работе", en: "How this is used for real" },
    },
    {
      kind: "text",
      text: {
        uz: "Tasavvur qiling: kompaniya sizni o‘z serverini tekshirishga yolladi (bu **pentest** deyiladi — ruxsat bilan qilinadigan xavfsizlik tekshiruvi). Serverga kirdingiz. Birinchi daqiqalarda aynan shu darsdagi buyruqlarni yozasiz:\n\n`pwd` — qayerga tushdim? `ls -a` — bu yerda qanday fayllar bor, yashirinlari ham? `cat /etc/hostname` — bu qaysi kompyuter? `cat /var/log/auth.log` — kim qachon kirgan?\n\nKo‘pincha zaiflik murakkab hujumda emas, balki unutilgan faylda topiladi: kimdir parolni `.env` yoki `backup.txt` faylida qoldirgan bo‘ladi. Uni topish uchun esa `ls -a` va `cat` dan boshqa hech narsa kerak emas.",
        kaa: "Kóz aldıńızǵa keltiriń: kompaniya sizdi óz serverin tekseriwge jalladı (bul **pentest** dep ataladı — ruxsat penen islenetuǵın qáwipsizlik tekseriwi). Serverge kirdińiz. Birinshi minutlarda dál usı sabaqtaǵı buyrıqlardı jazasız:\n\n`pwd` — qay jerge tústim? `ls -a` — bul jerde qanday fayllar bar, jasırınları da? `cat /etc/hostname` — bul qaysı kompyuter? `cat /var/log/auth.log` — kim qashan kirgen?\n\nKóbinese álsizlik quramalı hújimde emes, al umıtılǵan faylda tabıladı: birew paroldi `.env` yamasa `backup.txt` faylında qaldırǵan boladı. Onı tabıw ushın bolsa `ls -a` hám `cat` tan basqa hesh nárse kerek emes.",
        ru: "Представьте: компания наняла вас проверить свой сервер (это называется **пентест** — проверка безопасности с разрешения владельца). Вы зашли на сервер. В первые минуты вы набираете ровно команды из этого урока:\n\n`pwd` — куда я попал? `ls -a` — какие здесь файлы, включая скрытые? `cat /etc/hostname` — что это за машина? `cat /var/log/auth.log` — кто и когда сюда входил?\n\nЧасто уязвимость находится не в сложной атаке, а в забытом файле: кто-то оставил пароль в `.env` или `backup.txt`. А чтобы его найти, ничего кроме `ls -a` и `cat` не нужно.",
        en: "Picture this: a company hired you to check its server (that is a **pentest** — a security test done with the owner’s permission). You are logged in. In the first minutes you type exactly the commands from this lesson:\n\n`pwd` — where did I land? `ls -a` — what files are here, hidden ones too? `cat /etc/hostname` — which machine is this? `cat /var/log/auth.log` — who logged in, and when?\n\nOften the weakness is not some clever attack but a forgotten file: someone left a password in `.env` or `backup.txt`. Finding it takes nothing more than `ls -a` and `cat`.",
      },
    },
    {
      kind: "callout",
      tone: "warn",
      text: {
        uz: "**Xavfsizlik saboqi:** nuqta bilan boshlangan fayl faqat «ko‘zdan yashirilgan», lekin himoyalanmagan — uni istalgan foydalanuvchi `ls -a` bilan ko‘radi. Parol yoki kalitni yashirin faylga qo‘yish himoya emas. Haqiqiy himoya — fayl **ruxsatlari** (permissions), ularni 2-haftada o‘rganamiz.",
        kaa: "**Qáwipsizlik sabaǵı:** noqat penen baslanǵan fayl tek «kózden jasırılǵan», biraq qorǵalmaǵan — onı qálegen paydalanıwshı `ls -a` penen kóredi. Parol yamasa giltti jasırın faylǵa qoyıw qorǵaw emes. Haqıyqıy qorǵaw — fayl **ruxsatları** (permissions), olardı 2-háptede úyrenemiz.",
        ru: "**Урок безопасности:** файл с точкой в начале лишь «спрятан с глаз», но не защищён — любой пользователь увидит его через `ls -a`. Положить пароль или ключ в скрытый файл — не защита. Настоящая защита — **права доступа** (permissions), их разберём на 2-й неделе.",
        en: "**Security lesson:** a file that starts with a dot is only “out of sight”, not protected — any user sees it with `ls -a`. Putting a password or key in a hidden file is not protection. Real protection comes from file **permissions**, which we cover in week 2.",
      },
    },

    {
      kind: "summary",
      items: [
        {
          uz: "Linux'da hamma narsa bitta daraxtda, uning boshi — `/` (ildiz)",
          kaa: "Linux'ta hámme nárse bir terekte, onıń bası — `/` (túbir)",
          ru: "В Linux всё лежит в одном дереве, его начало — `/` (корень)",
          en: "On Linux everything lives in one tree that starts at `/` (the root)",
        },
        {
          uz: "`pwd` — qayerdaman, `ls` — nima bor, `cd` — yur, `cat` — o‘qi, `mkdir` — yarat",
          kaa: "`pwd` — qay jerdemen, `ls` — ne bar, `cd` — júr, `cat` — oqı, `mkdir` — jasa",
          ru: "`pwd` — где я, `ls` — что есть, `cd` — перейти, `cat` — прочитать, `mkdir` — создать",
          en: "`pwd` — where am I, `ls` — what is here, `cd` — move, `cat` — read, `mkdir` — create",
        },
        {
          uz: "`..` — bir pog‘ona yuqoriga, `~` — uyga",
          kaa: "`..` — bir basqısh joqarıǵa, `~` — úyge",
          ru: "`..` — на уровень выше, `~` — домой",
          en: "`..` — one level up, `~` — home",
        },
        {
          uz: "Har doim `ls -a` ishlating: yashirin fayllar ko‘pincha eng qiziq narsalarni saqlaydi",
          kaa: "Hámme waqıt `ls -a` paydalanıń: jasırın fayllar kóbinese eń qızıq nárselerdi saqlaydı",
          ru: "Всегда используйте `ls -a`: в скрытых файлах часто самое интересное",
          en: "Always use `ls -a`: hidden files often hold the most interesting things",
        },
        {
          uz: "Yashirin fayl ≠ himoyalangan fayl",
          kaa: "Jasırın fayl ≠ qorǵalǵan fayl",
          ru: "Скрытый файл ≠ защищённый файл",
          en: "Hidden file ≠ protected file",
        },
      ],
    },

    {
      kind: "heading",
      id: "check",
      text: { uz: "O‘zingizni tekshiring", kaa: "Ózińizdi tekseriń", ru: "Проверьте себя", en: "Check yourself" },
    },
    {
      kind: "check",
      question: {
        uz: "Siz `/home/student/projects` papkasidasiz. `cd ..` dan keyin qayerda bo‘lasiz?",
        kaa: "Siz `/home/student/projects` papkasındasız. `cd ..` den keyin qay jerde bolasız?",
        ru: "Вы в папке `/home/student/projects`. Где вы окажетесь после `cd ..`?",
        en: "You are in `/home/student/projects`. Where are you after `cd ..`?",
      },
      options: [
        { uz: "`/`", kaa: "`/`", ru: "`/`", en: "`/`" },
        { uz: "`/home/student`", kaa: "`/home/student`", ru: "`/home/student`", en: "`/home/student`" },
        { uz: "`/home`", kaa: "`/home`", ru: "`/home`", en: "`/home`" },
      ],
      answer: 1,
      explain: {
        uz: "`..` — bir pog‘ona yuqoridagi papka. `projects` ning «ota» papkasi — `/home/student`.",
        kaa: "`..` — bir basqısh joqarıdaǵı papka. `projects` tiń «ata» papkası — `/home/student`.",
        ru: "`..` — папка на уровень выше. «Родитель» `projects` — это `/home/student`.",
        en: "`..` is the folder one level up. The parent of `projects` is `/home/student`.",
      },
    },
    {
      kind: "check",
      question: {
        uz: "`ls` papkada hech narsa ko‘rsatmadi. Bu papka haqiqatan bo‘sh, deb aytish mumkinmi?",
        kaa: "`ls` papkada hesh nárse kórsetpedi. Bul papka haqıyqatında bos dep aytıwǵa bola ma?",
        ru: "`ls` ничего не показал в папке. Можно ли сказать, что она действительно пуста?",
        en: "`ls` showed nothing in a folder. Can you say the folder is really empty?",
      },
      options: [
        {
          uz: "Ha, `ls` hamma faylni ko‘rsatadi",
          kaa: "Awa, `ls` hámme fayldı kórsetedi",
          ru: "Да, `ls` показывает все файлы",
          en: "Yes, `ls` shows every file",
        },
        {
          uz: "Yo‘q, yashirin fayllar bo‘lishi mumkin — `ls -a` bilan tekshirish kerak",
          kaa: "Yaq, jasırın fayllar bolıwı múmkin — `ls -a` penen tekseriw kerek",
          ru: "Нет, там могут быть скрытые файлы — нужно проверить `ls -a`",
          en: "No, there may be hidden files — check with `ls -a`",
        },
      ],
      answer: 1,
      explain: {
        uz: "Oddiy `ls` nuqta bilan boshlanadigan fayllarni ko‘rsatmaydi. Yaxshi odat: har doim `ls -a`.",
        kaa: "Ápiwayı `ls` noqat penen baslanatuǵın fayllardı kórsetpeydi. Jaqsı ádet: hámme waqıt `ls -a`.",
        ru: "Обычный `ls` не показывает файлы, начинающиеся с точки. Хорошая привычка — всегда `ls -a`.",
        en: "A plain `ls` hides files that start with a dot. Good habit: always `ls -a`.",
      },
    },
    {
      kind: "check",
      question: {
        uz: "Qaysi yo‘l absolyut (to‘liq manzil)?",
        kaa: "Qaysı jol absolyut (tolıq mánzil)?",
        ru: "Какой путь абсолютный (полный адрес)?",
        en: "Which path is absolute (a full address)?",
      },
      options: [
        { uz: "`projects/todo.txt`", kaa: "`projects/todo.txt`", ru: "`projects/todo.txt`", en: "`projects/todo.txt`" },
        { uz: "`../etc`", kaa: "`../etc`", ru: "`../etc`", en: "`../etc`" },
        { uz: "`/var/log/auth.log`", kaa: "`/var/log/auth.log`", ru: "`/var/log/auth.log`", en: "`/var/log/auth.log`" },
      ],
      answer: 2,
      explain: {
        uz: "Absolyut yo‘l `/` bilan boshlanadi va qayerda turganingizdan qat’i nazar bir xil joyni ko‘rsatadi.",
        kaa: "Absolyut jol `/` penen baslanadı hám qay jerde turǵanıńızǵa qaramastan bir jerdi kórsetedi.",
        ru: "Абсолютный путь начинается с `/` и указывает на одно и то же место, где бы вы ни находились.",
        en: "An absolute path starts with `/` and points to the same place wherever you are.",
      },
    },
    {
      kind: "check",
      question: {
        uz: "Serverda kim qachon tizimga kirganini bilmoqchisiz. Qaysi faylni o‘qiysiz?",
        kaa: "Serverde kim qashan sistemaǵa kirgenin bilmekshisiz. Qaysı fayldı oqıysız?",
        ru: "Вы хотите узнать, кто и когда входил на сервер. Какой файл прочитаете?",
        en: "You want to know who logged in to the server and when. Which file do you read?",
      },
      options: [
        { uz: "`/etc/hostname`", kaa: "`/etc/hostname`", ru: "`/etc/hostname`", en: "`/etc/hostname`" },
        { uz: "`/var/log/auth.log`", kaa: "`/var/log/auth.log`", ru: "`/var/log/auth.log`", en: "`/var/log/auth.log`" },
        { uz: "`/tmp`", kaa: "`/tmp`", ru: "`/tmp`", en: "`/tmp`" },
      ],
      answer: 1,
      explain: {
        uz: "`/var/log` — jurnallar papkasi, `auth.log` esa tizimga kirishlar (*authentication*) jurnali. `/etc/hostname` faqat kompyuter nomini saqlaydi.",
        kaa: "`/var/log` — jurnallar papkası, `auth.log` bolsa sistemaǵa kiriwler (*authentication*) jurnalı. `/etc/hostname` tek kompyuter atın saqlaydı.",
        ru: "`/var/log` — папка журналов, а `auth.log` — журнал входов (*authentication*). В `/etc/hostname` лишь имя машины.",
        en: "`/var/log` holds the logs and `auth.log` is the log of sign-ins (*authentication*). `/etc/hostname` only holds the machine’s name.",
      },
    },
  ],
};

export default lesson;
