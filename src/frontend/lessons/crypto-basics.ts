import type { Lesson } from "./types";

// Plan: month 1, week 3, lesson 1 — HTTPS and the idea of encryption.
// Saved answers are keyed by check position: add new checks at the end.
const lesson: Lesson = {
  slug: "crypto-basics",
  track: "web-security",
  order: 7,
  level: "beginner",
  minutes: 30,
  title: {
    uz: "Shifrlash: sirni qanday saqlash mumkin",
    kaa: "Shifrlaw: sırdı qalay saqlaw múmkin",
    ru: "Шифрование: как сохранить секрет",
    en: "Encryption: how to keep a secret",
  },
  summary: {
    uz: "Sezar shifridan HTTPS’gacha: kalit nima, nega eski shifrlar bir zumda buziladi va bugun brauzeringiz parolingizni qanday himoya qiladi. Oxirida buzib bo‘lmaydigan parol tuzamiz.",
    kaa: "Sezar shifrinen HTTPS’ke shekem: gilt degen ne, ne ushın eski shifrler bir zamatta buzıladı hám búgin brauzerińiz parolıńızdı qalay qorǵaydı. Aqırında buzıp bolmaytuǵın parol dúzemiz.",
    ru: "От шифра Цезаря до HTTPS: что такое ключ, почему старые шифры ломаются мгновенно и как браузер сегодня защищает ваш пароль. В конце составим пароль, который не взломать.",
    en: "From the Caesar cipher to HTTPS: what a key is, why old ciphers fall instantly, and how your browser protects your password today. At the end we build a password nobody can crack.",
  },
  blocks: [
    {
      kind: "goals",
      items: [
        {
          uz: "Ochiq matn, shifrlangan matn va kalit nima ekanini tushuntira olasiz",
          kaa: "Ashıq tekst, shifrlanǵan tekst hám gilt ne ekenin túsindire alasız",
          ru: "Объяснять, что такое открытый текст, шифротекст и ключ",
          en: "Explain plaintext, ciphertext and key",
        },
        {
          uz: "Sezar shifrini qo‘lda shifrlab, ochasiz",
          kaa: "Sezar shifrin qolda shifrlap, ashasız",
          ru: "Шифровать и расшифровывать шифр Цезаря вручную",
          en: "Encrypt and decrypt a Caesar cipher by hand",
        },
        {
          uz: "Nega eski shifrlar buziladi — **brute-force** nima ekanini bilasiz",
          kaa: "Ne ushın eski shifrler buzıladı — **brute-force** ne ekenin bilesiz",
          ru: "Понимать, почему старые шифры ломаются, и что такое **brute-force**",
          en: "Know why old ciphers break and what **brute force** is",
        },
        {
          uz: "Brauzerdagi qulf belgisi (HTTPS) nimani himoya qiladi va nimani himoya qilmaydi — farqlaysiz",
          kaa: "Brauzerdegi qulıp belgisi (HTTPS) neni qorǵaydı hám neni qorǵamaydı — ajırata alasız",
          ru: "Различать, от чего защищает замок в браузере (HTTPS), а от чего нет",
          en: "Tell what the browser padlock (HTTPS) protects — and what it doesn’t",
        },
        {
          uz: "Kodlash (Base64) va shifrlashni adashtirmaysiz",
          kaa: "Kodlaw (Base64) hám shifrlawdı shatastırmaysız",
          ru: "Не путать кодирование (Base64) с шифрованием",
          en: "Never mix up encoding (Base64) and encryption",
        },
        {
          uz: "Kuchli parol tuza olasiz",
          kaa: "Kúshli parol dúze alasız",
          ru: "Составлять надёжный пароль",
          en: "Build a strong password",
        },
      ],
    },

    {
      kind: "heading",
      id: "secret",
      text: { uz: "2000 yillik o‘yin", kaa: "2000 jıllıq oyın", ru: "Игра длиной в 2000 лет", en: "A 2,000-year-old game" },
    },
    {
      kind: "text",
      text: {
        uz: "Sinfda do‘stingizga xat uzatdingiz, lekin u qo‘ldan-qo‘lga o‘tib boradi — yo‘lda istalgan odam ochib o‘qishi mumkin. Nima qilish kerak? Xatni faqat ikkalangiz biladigan qoida bilan **shifrlash** kerak. Shunda uni yo‘lda ochgan odam faqat tushunarsiz harflarni ko‘radi.\n\nInternet ham xuddi shunday: parolingiz sizdan serverga borguncha o‘nlab kompyuterlardan o‘tadi. Shifrlash — o‘sha yo‘ldagi «begona ko‘zlar»dan himoya.",
        kaa: "Klasta dostıńızǵa xat uzattıńız, biraq ol qoldan-qolǵa ótip baradı — jolda qálegen adam ashıp oqıwı múmkin. Ne qılıw kerek? Xattı tek ekewińiz biletuǵın qaǵıyda menen **shifrlaw** kerek. Sonda onı jolda ashqan adam tek túsiniksiz háriplerdi kóredi.\n\nInternet te dál sonday: parolıńız sizden serverge barǵansha onlaǵan kompyuterlerden ótedi. Shifrlaw — sol joldaǵı «jat kózler»den qorǵaw.",
        ru: "Вы передали другу записку на уроке, но она идёт из рук в руки — по дороге её может развернуть кто угодно. Что делать? **Зашифровать** записку по правилу, которое знаете только вы двое. Тогда тот, кто её развернёт, увидит лишь бессмысленные буквы.\n\nВ интернете то же самое: пока ваш пароль идёт к серверу, он проходит через десятки чужих компьютеров. Шифрование — защита от этих «чужих глаз» по дороге.",
        en: "You pass a note to a friend in class, but it travels hand to hand — anyone on the way could unfold it. What now? **Encrypt** it with a rule only the two of you know. Then whoever unfolds it sees only meaningless letters.\n\nThe internet is the same: on its way to the server, your password passes through dozens of strangers’ computers. Encryption protects it from those “eyes on the way”.",
      },
    },
    {
      kind: "terms",
      items: [
        {
          term: "plaintext",
          text: { uz: "**Ochiq matn** — asl, o‘qiladigan xabar: `SALOM`", kaa: "**Ashıq tekst** — haqıyqıy, oqılatuǵın xabar: `SALOM`", ru: "**Открытый текст** — исходное, читаемое сообщение: `SALOM`", en: "The original, readable message: `SALOM`" },
        },
        {
          term: "ciphertext",
          text: { uz: "**Shifrlangan matn** — uning tushunarsiz ko‘rinishi: `VDORP`", kaa: "**Shifrlanǵan tekst** — onıń túsiniksiz kórinisi: `VDORP`", ru: "**Шифротекст** — его непонятный вид: `VDORP`", en: "Its scrambled form: `VDORP`" },
        },
        {
          term: "key",
          text: { uz: "**Kalit** — shifrlash va ochish uchun kerak bo‘ladigan sir. Sezar shifrida bu — siljish soni", kaa: "**Gilt** — shifrlaw hám ashıw ushın kerek bolatuǵın sır. Sezar shifrinde bul — jılısıw sanı", ru: "**Ключ** — секрет для шифрования и расшифровки. У Цезаря это величина сдвига", en: "The secret needed to lock and unlock. For Caesar it is the shift" },
        },
        {
          term: "encrypt / decrypt",
          text: { uz: "**Shifrlash** — ochiq matnni yopish, **ochish** — kalit bilan qaytarish", kaa: "**Shifrlaw** — ashıq tekstti jabıw, **ashıw** — gilt penen qaytarıw", ru: "**Зашифровать** — спрятать текст, **расшифровать** — вернуть его ключом", en: "**Encrypt** hides the text, **decrypt** brings it back with the key" },
        },
        {
          term: "brute-force",
          text: { uz: "**To‘liq tanlash** — barcha mumkin bo‘lgan kalitlarni birma-bir sinab ko‘rish", kaa: "**Tolıq tańlaw** — barlıq múmkin bolǵan giltlerdi birme-bir sınap kóriw", ru: "**Полный перебор** — пробовать все возможные ключи по очереди", en: "Trying every possible key, one by one" },
        },
        {
          term: "HTTPS / TLS",
          text: { uz: "Brauzer va sayt orasidagi shifrlangan aloqa. Manzil satridagi qulf belgisi", kaa: "Brauzer hám sayt arasındaǵı shifrlanǵan baylanıs. Mánzil qatarındaǵı qulıp belgisi", ru: "Зашифрованная связь браузера и сайта. Замок в адресной строке", en: "The encrypted link between browser and site. The padlock in the address bar" },
        },
        {
          term: "Base64",
          text: { uz: "**Kodlash** usuli, shifr emas: kalitsiz, har kim ocha oladi", kaa: "**Kodlaw** usılı, shifr emes: giltsiz, hár kim asha aladı", ru: "Способ **кодирования**, а не шифр: без ключа, раскодирует любой", en: "An **encoding**, not a cipher: no key, anyone can decode it" },
        },
      ],
    },

    {
      kind: "heading",
      id: "caesar",
      text: { uz: "Sezar shifri — qo‘lda", kaa: "Sezar shifri — qolda", ru: "Шифр Цезаря — вручную", en: "The Caesar cipher, by hand" },
    },
    {
      kind: "text",
      text: {
        uz: "Yuliy Sezar 2000 yil oldin sarkardalariga xatlarni shunday yuborgan: har bir harf alifboda bir necha qadam oldinga suriladi. Necha qadam — shu **kalit**. Qog‘oz va ruchka oling, birga bajaramiz.",
        kaa: "Yuliy Sezar 2000 jıl burın sárdarlarına xatlardı usılay jibergen: hár bir hárip álipbede bir neshe qádem aldıǵa jılısadı. Neshe qádem — sol **gilt**. Qaǵaz hám ruchka alıń, birge orınlaymız.",
        ru: "Юлий Цезарь 2000 лет назад писал своим полководцам так: каждая буква сдвигается по алфавиту на несколько шагов вперёд. Сколько шагов — это и есть **ключ**. Возьмите бумагу и ручку, сделаем вместе.",
        en: "Julius Caesar wrote to his generals like this 2,000 years ago: every letter moves a few steps forward in the alphabet. How many steps — that is the **key**. Grab paper and a pen and let’s do it together.",
      },
    },
    {
      kind: "steps",
      items: [
        {
          text: {
            uz: "**Kalitni tanlang.** Masalan, `3`. Buni faqat siz va do‘stingiz bilasiz.",
            kaa: "**Giltti tańlań.** Mısalı, `3`. Bunı tek siz hám dostıńız bilesiz.",
            ru: "**Выберите ключ.** Например, `3`. Его знаете только вы и друг.",
            en: "**Pick a key.** Say `3`. Only you and your friend know it.",
          },
        },
        {
          text: {
            uz: "**Har bir harfni 3 qadam suring.** S dan keyin T, U, V — demak S → V. A → D, L → O, O → R, M → P.",
            kaa: "**Hár bir háripti 3 qádem jılıstırıń.** S tan keyin T, U, V — demek S → V. A → D, L → O, O → R, M → P.",
            ru: "**Сдвиньте каждую букву на 3.** После S идут T, U, V — значит S → V. A → D, L → O, O → R, M → P.",
            en: "**Move each letter 3 steps.** After S come T, U, V — so S → V. A → D, L → O, O → R, M → P.",
          },
          prompt: "",
          code: "S A L O M\n↓ ↓ ↓ ↓ ↓   +3\nV D O R P",
          output: "VDORP",
        },
        {
          text: {
            uz: "**Alifbo oxiriga yetsangiz — boshiga qayting.** X → A, Y → B, Z → C. Alifbo xuddi soat siferblatidek aylanadi.",
            kaa: "**Álipbe aqırına jetseńiz — basına qaytıń.** X → A, Y → B, Z → C. Álipbe dál saat siferblatı sıyaqlı aylanadı.",
            ru: "**Дошли до конца алфавита — начните сначала.** X → A, Y → B, Z → C. Алфавит идёт по кругу, как циферблат.",
            en: "**Reached the end of the alphabet? Wrap around.** X → A, Y → B, Z → C. The alphabet goes round like a clock face.",
          },
        },
        {
          text: {
            uz: "**Ochish — teskari yo‘l.** Do‘stingiz `VDORP` ni oladi va har harfni 3 qadam **orqaga** suradi: yana `SALOM`.",
            kaa: "**Ashıw — keri jol.** Dostıńız `VDORP` tı aladı hám hár háripti 3 qádem **artqa** jılıstıradı: jáne `SALOM`.",
            ru: "**Расшифровка — обратный путь.** Друг получает `VDORP` и сдвигает каждую букву на 3 **назад**: снова `SALOM`.",
            en: "**Decrypting is the reverse.** Your friend gets `VDORP` and moves each letter 3 steps **back**: `SALOM` again.",
          },
        },
      ],
    },
    {
      kind: "text",
      text: {
        uz: "Endi quyidagi xonada uchta tarixiy shifrni sinab ko‘ring: Sezar, Atbash (alifboni teskari o‘qish) va Vijener (har harf uchun alohida siljish). Har birida bitta topshiriq bor — uchchalasini yeching!",
        kaa: "Endi tómendegi bólmede úsh tariyxıy shifrdi sınap kóriń: Sezar, Atbash (álipbeni keri oqıw) hám Vijener (hár hárip ushın bólek jılısıw). Hár birinde bir tapsırma bar — úshewin de sheshiń!",
        ru: "Теперь попробуйте три исторических шифра в комнате ниже: Цезарь, Атбаш (алфавит задом наперёд) и Виженер (свой сдвиг для каждой буквы). В каждом одно задание — решите все три!",
        en: "Now try three historical ciphers in the room below: Caesar, Atbash (the alphabet read backwards) and Vigenère (a different shift for each letter). Each has one challenge — solve all three!",
      },
    },
    { kind: "widget", widget: "cipher-lab" },
    {
      kind: "callout",
      tone: "warn",
      text: {
        uz: "**Nega Sezar shifri bugun ishlamaydi?** Unda atigi 25 ta kalit bor. Hujumchi kalitni bilmasa ham hammasini birma-bir sinab ko‘radi — kompyuter buni soniyaning mingdan birida qiladi. Bunga **brute-force** (to‘liq tanlash) deyiladi. Zamonaviy shifrlarda kalitlar soni shunchalik ko‘pki, ularni sinab chiqishga koinot yoshidan ko‘p vaqt kerak.",
        kaa: "**Ne ushın Sezar shifri búgin islemeydi?** Onda bar bolǵanı 25 gilt bar. Hújimshi giltti bilmese de hámmesin birme-bir sınap kóredi — kompyuter bunı sekundtıń mińnan birinde isleydi. Bunı **brute-force** (tolıq tańlaw) dep ataydı. Zamanagóy shifrlerde giltler sanı sonshelli kóp, olardı sınap shıǵıwǵa álem jasınan kóp waqıt kerek.",
        ru: "**Почему Цезарь сегодня не работает?** У него всего 25 ключей. Даже не зная ключ, атакующий попробует их все — компьютер справится за тысячную долю секунды. Это называется **brute-force** (полный перебор). В современных шифрах ключей так много, что на перебор ушло бы больше времени, чем существует Вселенная.",
        en: "**Why doesn’t Caesar work today?** It has only 25 keys. Without knowing the key, an attacker simply tries them all — a computer does it in a thousandth of a second. That is **brute force**. Modern ciphers have so many keys that trying them all would take longer than the age of the universe.",
      },
    },
    {
      kind: "callout",
      tone: "tip",
      text: {
        uz: "**Kerkhoffs qoidasi (1883):** shifr hamma uning qanday ishlashini bilsa ham xavfsiz qolishi kerak. Sir — algoritmda emas, faqat **kalitda**. Shuning uchun «o‘zim o‘ylab topgan maxfiy shifr» — yomon g‘oya: uni kimdir albatta tushunib oladi.",
        kaa: "**Kerkhoffs qaǵıydası (1883):** shifr hámme onıń qalay isleytuǵının bilse de qáwipsiz qalıwı kerek. Sır — algoritmde emes, tek **giltte**. Sonlıqtan «ózim oylap tapqan jasırın shifr» — jaman pikir: onı birew álbette túsinip aladı.",
        ru: "**Принцип Керкгоффса (1883):** шифр должен оставаться надёжным, даже если все знают, как он устроен. Секрет — не в алгоритме, а только в **ключе**. Поэтому «свой тайный шифр» — плохая идея: кто-нибудь обязательно его разгадает.",
        en: "**Kerckhoffs’s principle (1883):** a cipher must stay secure even if everyone knows how it works. The secret lives only in the **key**, not the algorithm. That is why “my own secret cipher” is a bad idea — someone will figure it out.",
      },
    },

    {
      kind: "heading",
      id: "https",
      text: { uz: "Bugungi shifrlash: HTTPS", kaa: "Búgingi shifrlaw: HTTPS", ru: "Шифрование сегодня: HTTPS", en: "Encryption today: HTTPS" },
    },
    {
      kind: "text",
      text: {
        uz: "Kafeda bepul Wi-Fi’ga ulandingiz va saytga parolingizni kiritdingiz. Shu Wi-Fi’ga ulangan har qanday odam tarmoqdan o‘tayotgan ma’lumotni «tinglashi» mumkin.\n\n**HTTP** bo‘lsa (qulf yo‘q) — u parolingizni ochiq holda ko‘radi: `password=Ali1990`. **HTTPS** bo‘lsa (qulf bor) — u faqat `x8#kQ2!vz…` kabi tushunarsiz baytlarni ko‘radi. Qulf belgisi — aloqa **TLS** bilan shifrlanganining belgisi.",
        kaa: "Kafede biypul Wi-Fi’ǵa jalǵandıńız hám saytqa parolıńızdı kirittińiz. Usı Wi-Fi’ǵa jalǵanǵan hár qanday adam tarmaqtan ótip atırǵan maǵlıwmattı «tıńlawı» múmkin.\n\n**HTTP** bolsa (qulıp joq) — ol parolıńızdı ashıq halda kóredi: `password=Ali1990`. **HTTPS** bolsa (qulıp bar) — ol tek `x8#kQ2!vz…` sıyaqlı túsiniksiz baytlardı kóredi. Qulıp belgisi — baylanıs **TLS** penen shifrlanǵanınıń belgisi.",
        ru: "Вы подключились к бесплатному Wi-Fi в кафе и ввели пароль на сайте. Любой, кто подключён к той же сети, может «подслушивать» данные, которые по ней идут.\n\nЕсли сайт на **HTTP** (замка нет) — он увидит пароль открытым текстом: `password=Ali1990`. Если на **HTTPS** (замок есть) — только непонятные байты вроде `x8#kQ2!vz…`. Замок означает, что связь зашифрована с помощью **TLS**.",
        en: "You join a free café Wi-Fi and type your password into a site. Anyone on the same network can “listen in” on the data passing through it.\n\nIf the site uses **HTTP** (no padlock), they see your password in plain text: `password=Ali1990`. With **HTTPS** (padlock), they see only meaningless bytes like `x8#kQ2!vz…`. The padlock means the connection is encrypted with **TLS**.",
      },
    },
    {
      kind: "text",
      text: {
        uz: "TLS ikki xil shifrlashni birlashtiradi:\n\n**Simmetrik** (masalan, AES) — shifrlash va ochish uchun bitta kalit, xuddi Sezardagidek. Juda tez, lekin savol bor: kalitni saytga qanday xavfsiz yetkazasiz?\n\n**Asimmetrik** (masalan, RSA yoki ECDH) — ikkita kalit. **Ochiq kalit** — ochiq turgan qulf: uni hammaga tarqatish mumkin, u faqat yopa oladi. **Yopiq kalit** — o‘sha qulfning kaliti, u faqat serverda turadi va ocha oladi.\n\nTLS avval asimmetrik usul bilan xavfsiz «tanishadi», keyin ikkalasi bitta tezkor simmetrik kalit kelishib oladi va butun suhbatni u bilan shifrlaydi.",
        kaa: "TLS eki túrli shifrlawdı birlestiredi:\n\n**Simmetriyalıq** (mısalı, AES) — shifrlaw hám ashıw ushın bir gilt, dál Sezardaǵıday. Júdá tez, biraq soraw bar: giltti saytqa qalay qáwipsiz jetkeresiz?\n\n**Asimmetriyalıq** (mısalı, RSA yamasa ECDH) — eki gilt. **Ashıq gilt** — ashıq turǵan qulıp: onı hámmege taratıw múmkin, ol tek jaba aladı. **Jabıq gilt** — sol qulıptıń gilti, ol tek serverde turadı hám asha aladı.\n\nTLS aldın asimmetriyalıq usıl menen qáwipsiz «tanısadı», keyin ekewi bir tez simmetriyalıq giltke kelisip aladı hám pútkil sáwbetti sonıń menen shifrlaydı.",
        ru: "TLS сочетает два вида шифрования:\n\n**Симметричное** (например, AES) — один ключ и для шифрования, и для расшифровки, как у Цезаря. Очень быстро, но вопрос: как безопасно передать ключ сайту?\n\n**Асимметричное** (например, RSA или ECDH) — два ключа. **Открытый ключ** — это открытый замок: его можно раздать всем, он умеет только запирать. **Закрытый ключ** — ключ от этого замка, он хранится только на сервере и умеет открывать.\n\nTLS сначала безопасно «знакомится» асимметричным способом, затем стороны договариваются об одном быстром симметричном ключе и шифруют им весь разговор.",
        en: "TLS combines two kinds of encryption:\n\n**Symmetric** (e.g. AES) — one key both locks and unlocks, just like Caesar. Very fast, but how do you get that key to the site safely?\n\n**Asymmetric** (e.g. RSA or ECDH) — two keys. The **public key** is an open padlock: you can hand it to everyone, and it can only lock. The **private key** is the key to that padlock; it stays on the server and can unlock.\n\nTLS first “shakes hands” safely using the asymmetric method, then both sides agree on one fast symmetric key and encrypt the whole conversation with it.",
      },
    },
    {
      kind: "steps",
      items: [
        {
          text: {
            uz: "**Istalgan saytni oching** va manzil satridagi qulf (yoki sozlamalar) belgisini bosing.",
            kaa: "**Qálegen saytı ashıń** hám mánzil qatarındaǵı qulıp (yamasa sazlawlar) belgisin basıń.",
            ru: "**Откройте любой сайт** и нажмите на значок замка (или настроек) в адресной строке.",
            en: "**Open any site** and click the padlock (or settings) icon in the address bar.",
          },
        },
        {
          text: {
            uz: "**«Ulanish xavfsiz» → «Sertifikat»** ni tanlang. Sertifikat — saytning «pasporti»: u kimga berilgani (`subject`), kim bergani (`issuer`) va qachongacha amal qilishi yozilgan.",
            kaa: "**«Baylanıs qáwipsiz» → «Sertifikat»** tı tańlań. Sertifikat — sayttıń «pasportı»: ol kimge berilgeni (`subject`), kim bergeni (`issuer`) hám qashanǵa shekem ámel etetuǵını jazılǵan.",
            ru: "**Выберите «Подключение защищено» → «Сертификат».** Сертификат — «паспорт» сайта: кому выдан (`subject`), кем выдан (`issuer`) и до какого числа действует.",
            en: "**Choose “Connection is secure” → “Certificate”.** A certificate is the site’s “passport”: who it was issued to (`subject`), who issued it (`issuer`) and when it expires.",
          },
        },
        {
          text: {
            uz: "**Terminal orqali ham ko‘rish mumkin.** `curl -v` TLS «qo‘l siqishuvi»ni ko‘rsatadi: protokol versiyasi, shifr nomi va sertifikat.",
            kaa: "**Terminal arqalı da kóriw múmkin.** `curl -v` TLS «qol qısıwı»n kórsetedi: protokol versiyası, shifr atı hám sertifikat.",
            ru: "**Это видно и в терминале.** `curl -v` показывает «рукопожатие» TLS: версию протокола, имя шифра и сертификат.",
            en: "**You can see it in a terminal too.** `curl -v` shows the TLS handshake: protocol version, cipher name and certificate.",
          },
          code: "curl -v https://example.com",
          output: "* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384\n*  subject: CN=www.example.org\n*  issuer: C=US; O=DigiCert Inc; CN=DigiCert Global G3 TLS ECC SHA384 2020 CA1\n*  SSL certificate verify ok.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      text: {
        uz: "**Qulf ≠ halol sayt.** Qulf faqat «sayt bilan aloqangizni yo‘ldagilar o‘qiy olmaydi» degani. Firibgarlar ham bepul sertifikat olib, `bank-bonus-uz.com` kabi soxta saytga qulf qo‘yishadi. Shuning uchun har doim **manzilning o‘zini** tekshiring.",
        kaa: "**Qulıp ≠ adal sayt.** Qulıp tek «sayt penen baylanısıńızdı joldaǵılar oqıy almaydı» degeni. Alaqanshılar da biypul sertifikat alıp, `bank-bonus-uz.com` sıyaqlı jalǵan saytqa qulıp qoyadı. Sonlıqtan hámme waqıt **mánzildiń ózin** tekseriń.",
        ru: "**Замок ≠ честный сайт.** Замок значит лишь «вашу связь с сайтом не прочитают по дороге». Мошенники тоже бесплатно получают сертификаты и ставят замок на поддельный сайт вроде `bank-bonus-uz.com`. Поэтому всегда проверяйте **сам адрес**.",
        en: "**Padlock ≠ honest site.** The padlock only means “nobody on the way can read your connection”. Scammers get free certificates too and put a padlock on fake sites like `bank-bonus-uz.com`. So always check **the address itself**.",
      },
    },
    {
      kind: "callout",
      tone: "info",
      text: {
        uz: "**Kodlash ≠ shifrlash.** `U0VDUkVU` sirli ko‘rinadimi? Bu shunchaki `SECRET` so‘zining **Base64** ko‘rinishi — istalgan onlayn dekoder uni kalitsiz ochadi. Base64, HEX va URL-kodlash — ma’lumotni yozish shakli, himoya emas. Saytda «yashirin» narsa Base64’da tursa, u yashirin emas. Buni oldingi darsdagi mini CTF’da ko‘rdingiz.",
        kaa: "**Kodlaw ≠ shifrlaw.** `U0VDUkVU` jasırın kórine me? Bul jay ǵana `SECRET` sóziniń **Base64** kórinisi — qálegen onlayn dekoder onı giltsiz ashadı. Base64, HEX hám URL-kodlaw — maǵlıwmattı jazıw forması, qorǵaw emes. Saytta «jasırın» nárse Base64’te tursa, ol jasırın emes. Bunı aldıńǵı sabaqtaǵı mini CTF’ta kórdińiz.",
        ru: "**Кодирование ≠ шифрование.** `U0VDUkVU` выглядит загадочно? Это просто слово `SECRET` в **Base64** — любой онлайн-декодер раскроет его без ключа. Base64, HEX и URL-кодирование — форма записи, а не защита. Если «секрет» на сайте лежит в Base64, он не секрет. Вы видели это в мини-CTF прошлого урока.",
        en: "**Encoding ≠ encryption.** Does `U0VDUkVU` look secret? It is just the word `SECRET` in **Base64** — any online decoder reveals it without a key. Base64, hex and URL encoding are ways of writing data, not protection. If a site’s “secret” sits in Base64, it isn’t secret. You saw this in the previous lesson’s mini CTF.",
      },
    },

    {
      kind: "heading",
      id: "passwords",
      text: { uz: "Parol — sizning kalitingiz", kaa: "Parol — sizdiń giltińiz", ru: "Пароль — ваш ключ", en: "Your password is your key" },
    },
    {
      kind: "text",
      text: {
        uz: "Eng kuchli shifr ham kalit zaif bo‘lsa, foyda bermaydi. Parolingiz — akkauntingiz kaliti. Saytlar bazasi tez-tez sizib chiqadi, va hujumchi o‘sha bazadagi parollarni soniyasiga milliardlab variant bilan tanlaydi — xuddi Sezarning 25 kalitini sinagandek, faqat ancha tezroq.\n\nSolishtiring: `Ali1990!` — ism + tug‘ilgan yil, hujumchilar lug‘atida birinchilardan. `olma-velosiped-tog‘-qor` — to‘rtta tasodifiy so‘z: eslab qolish oson, tanlashga esa asrlar kerak. **Uzunlik murakkablikdan muhimroq.**\n\nQuyida parol o‘ylab toping va uni buzish qancha vaqt olishini ko‘ring. Har bir belgi qo‘shilganda vaqt qanday o‘sishini kuzating.",
        kaa: "Eń kúshli shifr de gilt álsiz bolsa, payda bermeydi. Parolıńız — akkauntıńız gilti. Saytlar bazası tez-tez sızıp shıǵadı, hám hújimshi sol bazadaǵı parollardı sekundına milliardlaǵan variant penen tańlaydı — dál Sezardıń 25 giltin sınaǵanday, tek ádewir tezirek.\n\nSalıstırıń: `Ali1990!` — at + tuwılǵan jıl, hújimshiler sózliginde birinshilerden. `alma-velosiped-taw-qar` — tórt tosınnan sóz: yadta saqlaw ańsat, tańlawǵa bolsa ásirler kerek. **Uzınlıq quramalılıqtan áhmiyetlirek.**\n\nTómende parol oylap tabıń hám onı buzıw qansha waqıt alatuǵının kóriń. Hár bir belgi qosılǵanda waqıt qalay ósetuǵının baqlań.",
        ru: "Даже сильнейший шифр бесполезен, если ключ слабый. Ваш пароль — ключ от аккаунта. Базы сайтов регулярно утекают, и атакующий перебирает пароли из них миллиардами вариантов в секунду — как 25 ключей Цезаря, только гораздо быстрее.\n\nСравните: `Ali1990!` — имя + год рождения, в словарях атакующих он среди первых. `яблоко-велосипед-гора-снег` — четыре случайных слова: запомнить легко, а перебирать — века. **Длина важнее сложности.**\n\nПридумайте пароль ниже и посмотрите, сколько времени займёт его взлом. Следите, как растёт время с каждым новым символом.",
        en: "Even the strongest cipher is useless with a weak key. Your password is your account’s key. Site databases leak all the time, and an attacker guesses the passwords in them at billions per second — like trying Caesar’s 25 keys, only far faster.\n\nCompare: `Ali1990!` — a name plus a birth year, near the top of every attacker’s word list. `apple-bicycle-mountain-snow` — four random words: easy to remember, centuries to guess. **Length beats complexity.**\n\nInvent a password below and see how long cracking it would take. Watch the time grow with every character you add.",
      },
    },
    { kind: "widget", widget: "password-meter" },

    {
      kind: "summary",
      items: [
        {
          uz: "Shifrlash = ochiq matn + kalit → tushunarsiz matn. Kalitsiz ochib bo‘lmasligi kerak",
          kaa: "Shifrlaw = ashıq tekst + gilt → túsiniksiz tekst. Giltsiz ashıp bolmawı kerek",
          ru: "Шифрование = открытый текст + ключ → непонятный текст. Без ключа открыть нельзя",
          en: "Encryption = plaintext + key → scrambled text that can’t be read without the key",
        },
        {
          uz: "Kalitlar soni kam bo‘lsa (Sezarda 25 ta), brute-force uni bir zumda buzadi",
          kaa: "Giltler sanı az bolsa (Sezarda 25), brute-force onı bir zamatta buzadı",
          ru: "Если ключей мало (у Цезаря 25), перебор ломает шифр мгновенно",
          en: "With few keys (Caesar has 25), brute force breaks it instantly",
        },
        {
          uz: "Sir — algoritmda emas, faqat kalitda (Kerkhoffs qoidasi)",
          kaa: "Sır — algoritmde emes, tek giltte (Kerkhoffs qaǵıydası)",
          ru: "Секрет — не в алгоритме, а только в ключе (принцип Керкгоффса)",
          en: "The secret lives in the key, not the algorithm (Kerckhoffs)",
        },
        {
          uz: "Qulf (HTTPS) yo‘ldagilardan himoya qiladi, lekin saytning halolligini kafolatlamaydi",
          kaa: "Qulıp (HTTPS) joldaǵılardan qorǵaydı, biraq sayttıń adallıǵın kepillemeydi",
          ru: "Замок (HTTPS) защищает от тех, кто на пути, но не гарантирует честность сайта",
          en: "The padlock (HTTPS) guards the road, not the honesty of the site",
        },
        {
          uz: "Base64 — kodlash, shifr emas",
          kaa: "Base64 — kodlaw, shifr emes",
          ru: "Base64 — кодирование, а не шифр",
          en: "Base64 is encoding, not encryption",
        },
        {
          uz: "Kuchli parol — uzun parol: bir nechta tasodifiy so‘z",
          kaa: "Kúshli parol — uzın parol: bir neshe tosınnan sóz",
          ru: "Надёжный пароль — длинный: несколько случайных слов",
          en: "A strong password is a long one: several random words",
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
        uz: "Hujumchi Sezar shifridagi xabarni kalitsiz qanday ochadi?",
        kaa: "Hújimshi Sezar shifrindegi xabardı giltsiz qalay ashadı?",
        ru: "Как атакующий прочитает сообщение, зашифрованное Цезарем, без ключа?",
        en: "How does an attacker read a Caesar-encrypted message without the key?",
      },
      options: [
        { uz: "Hech qanday — kalitsiz ochib bo‘lmaydi", kaa: "Hesh qanday — giltsiz ashıp bolmaydı", ru: "Никак — без ключа не открыть", en: "They can’t — it is impossible without the key" },
        { uz: "Barcha 25 kalitni sinab ko‘radi", kaa: "Barlıq 25 giltti sınap kóredi", ru: "Перебирает все 25 ключей", en: "They try all 25 keys" },
        { uz: "Serverdan kalitni so‘raydi", kaa: "Serverden giltti soraydı", ru: "Просит ключ у сервера", en: "They ask the server for the key" },
      ],
      answer: 1,
      explain: {
        uz: "Kalitlar soni juda kam bo‘lsa, ularni to‘liq tanlash (brute-force) bir zumda tugaydi. Zamonaviy shifrlar shuning uchun juda uzun kalitlardan foydalanadi.",
        kaa: "Giltler sanı júdá az bolsa, olardı tolıq tańlaw (brute-force) bir zamatta tamamlanadı. Zamanagóy shifrler sonlıqtan júdá uzın giltlerden paydalanadı.",
        ru: "Когда ключей мало, полный перебор (brute-force) занимает мгновение. Поэтому современные шифры используют очень длинные ключи.",
        en: "With so few keys, brute force finishes instantly. That is why modern ciphers use very long keys.",
      },
    },
    {
      kind: "check",
      question: {
        uz: "Sayt API kalitini Base64’ga o‘girib, JavaScript fayliga qo‘ydi. Bu xavfsizmi?",
        kaa: "Sayt API giltin Base64’ke aylandırıp, JavaScript faylına qoydı. Bul qáwipsiz be?",
        ru: "Сайт закодировал API-ключ в Base64 и положил в JavaScript-файл. Это безопасно?",
        en: "A site turned its API key into Base64 and put it in a JavaScript file. Is that safe?",
      },
      options: [
        { uz: "Ha, Base64 — bu shifrlash", kaa: "Awa, Base64 — bul shifrlaw", ru: "Да, Base64 — это шифрование", en: "Yes, Base64 is encryption" },
        { uz: "Yo‘q, Base64’ni har kim kalitsiz ochadi", kaa: "Yaq, Base64’ti hár kim giltsiz ashadı", ru: "Нет, Base64 раскодирует кто угодно без ключа", en: "No, anyone can decode Base64 without a key" },
      ],
      answer: 1,
      explain: {
        uz: "Base64 — faqat kodlash. Brauzerga yuborilgan har qanday narsani foydalanuvchi ko‘ra oladi, shuning uchun sirlar faqat serverda turishi kerak.",
        kaa: "Base64 — tek kodlaw. Brauzerge jiberilgen hár qanday nárseni paydalanıwshı kóre aladı, sonlıqtan sırlar tek serverde turıwı kerek.",
        ru: "Base64 — просто кодировка. Всё, что отправлено в браузер, пользователь может увидеть, поэтому секреты должны оставаться на сервере.",
        en: "Base64 is only an encoding. Anything sent to the browser can be seen by the user, so secrets must stay on the server.",
      },
    },
    {
      kind: "check",
      question: {
        uz: "Sayt manzili yonida qulf belgisi bor. Bu nimani kafolatlaydi?",
        kaa: "Sayt mánzili qasında qulıp belgisi bar. Bul neni kepilleydi?",
        ru: "Рядом с адресом сайта есть замок. Что это гарантирует?",
        en: "There is a padlock next to a site’s address. What does it guarantee?",
      },
      options: [
        { uz: "Sayt halol va firibgar emas", kaa: "Sayt adal hám alaqanshı emes", ru: "Сайт честный и не мошеннический", en: "The site is honest, not a scam" },
        { uz: "Siz va sayt orasidagi ma’lumotni yo‘lda hech kim o‘qiy olmaydi", kaa: "Siz benen sayt arasındaǵı maǵlıwmattı jolda hesh kim oqıy almaydı", ru: "Данные между вами и сайтом никто не прочитает по дороге", en: "Nobody on the way can read the data between you and the site" },
        { uz: "Saytda hech qanday zaiflik yo‘q", kaa: "Saytta hesh qanday álsizlik joq", ru: "На сайте нет уязвимостей", en: "The site has no vulnerabilities" },
      ],
      answer: 1,
      explain: {
        uz: "HTTPS faqat yo‘ldagi aloqani shifrlaydi. Soxta sayt ham qulf olishi mumkin, zaif sayt ham. Shuning uchun manzilni o‘zingiz tekshirasiz.",
        kaa: "HTTPS tek joldaǵı baylanıstı shifrlaydı. Jalǵan sayt ta qulıp alıwı múmkin, álsiz sayt ta. Sonlıqtan mánzildi ózińiz tekseresiz.",
        ru: "HTTPS шифрует только связь по дороге. Замок может получить и поддельный, и уязвимый сайт. Поэтому адрес вы проверяете сами.",
        en: "HTTPS only encrypts the connection on the way. A fake site can get a padlock, and so can a vulnerable one. That is why you check the address yourself.",
      },
    },
    {
      kind: "check",
      question: {
        uz: "Qaysi parol eng kuchli?",
        kaa: "Qaysı parol eń kúshli?",
        ru: "Какой пароль самый надёжный?",
        en: "Which password is strongest?",
      },
      options: [
        { uz: "`Ali1990!`", kaa: "`Ali1990!`", ru: "`Ali1990!`", en: "`Ali1990!`" },
        { uz: "`P@ssw0rd`", kaa: "`P@ssw0rd`", ru: "`P@ssw0rd`", en: "`P@ssw0rd`" },
        { uz: "`olma-velosiped-tog‘-qor`", kaa: "`alma-velosiped-taw-qar`", ru: "`яблоко-велосипед-гора-снег`", en: "`apple-bicycle-mountain-snow`" },
      ],
      answer: 2,
      explain: {
        uz: "Birinchi ikkitasi qisqa va hujumchilar lug‘atida bor. To‘rtta tasodifiy so‘z — uzun, shuning uchun ularni tanlab chiqish juda uzoq vaqt oladi.",
        kaa: "Birinshi ekewi qısqa hám hújimshiler sózliginde bar. Tórt tosınnan sóz — uzın, sonlıqtan olardı tańlap shıǵıw júdá uzaq waqıt aladı.",
        ru: "Первые два короткие и есть в словарях атакующих. Четыре случайных слова — длинный пароль, его перебор займёт очень много времени.",
        en: "The first two are short and already in attackers’ word lists. Four random words make a long password that takes an enormous time to guess.",
      },
    },
  ],
};

export default lesson;
