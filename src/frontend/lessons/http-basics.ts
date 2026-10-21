import type { Lesson } from "./types";

// Plan: month 1, week 2 — HTTP requests and responses.
// The steps follow the http-exchange widget's server (widgets/sim/http-server.ts).
// Saved answers are keyed by check position: add new checks at the end.
const lesson: Lesson = {
  slug: "http-basics",
  track: "web-security",
  order: 6,
  level: "beginner",
  minutes: 25,
  title: {
    uz: "HTTP: brauzer va server suhbati",
    kaa: "HTTP: brauzer hám server sáwbeti",
    ru: "HTTP: разговор браузера и сервера",
    en: "HTTP: how the browser talks to the server",
  },
  summary: {
    uz: "Saytni ochganingizda brauzeringiz serverga xat yuboradi va javob oladi. Bu xat qanday yozilishini, server sizni qanday taniyotganini va nega xakerlar aynan shu xatlarni o‘zgartirib ko‘rishini o‘rganamiz.",
    kaa: "Saytı ashqanıńızda brauzerińiz serverge xat jiberedi hám juwap aladı. Bul xat qalay jazılatuǵının, server sizdi qalay tanıytuǵının hám ne ushın xakerler dál usı xatlardı ózgertip kóretuǵının úyrenemiz.",
    ru: "Когда вы открываете сайт, браузер отправляет серверу письмо и получает ответ. Разберём, как пишется это письмо, как сервер вас узнаёт и почему хакеры первым делом пробуют эти письма подменить.",
    en: "When you open a site, your browser sends the server a letter and gets a reply. We learn how that letter is written, how the server recognises you, and why attackers start by tampering with exactly these letters.",
  },
  blocks: [
    {
      kind: "goals",
      items: [
        {
          uz: "HTTP so‘rov va javob qanday tuzilganini o‘qiy olasiz",
          kaa: "HTTP soraw hám juwap qalay dúzilgenin oqıy alasız",
          ru: "Читать, из чего состоят HTTP-запрос и ответ",
          en: "Read how an HTTP request and response are built",
        },
        {
          uz: "`GET` va `POST` farqini bilasiz",
          kaa: "`GET` hám `POST` parqın bilesiz",
          ru: "Отличать `GET` от `POST`",
          en: "Tell `GET` from `POST`",
        },
        {
          uz: "Javob kodlarini tushunasiz: `200`, `302`, `403`, `404`",
          kaa: "Juwap kodların túsinesiz: `200`, `302`, `403`, `404`",
          ru: "Понимать коды ответа: `200`, `302`, `403`, `404`",
          en: "Understand the status codes `200`, `302`, `403`, `404`",
        },
        {
          uz: "Cookie nima ekanini va server sizni qanday «eslab qolishini» tushuntira olasiz",
          kaa: "Cookie ne ekenin hám server sizdi qalay «yadta saqlaytuǵının» túsindire alasız",
          ru: "Объяснить, что такое cookie и как сервер вас «запоминает»",
          en: "Explain what a cookie is and how the server “remembers” you",
        },
        {
          uz: "Brauzerda haqiqiy so‘rovlarni ko‘ra olasiz (F12 → Network)",
          kaa: "Brauzerde haqıyqıy sorawlardı kóre alasız (F12 → Network)",
          ru: "Смотреть настоящие запросы в браузере (F12 → Network)",
          en: "See real requests in your browser (F12 → Network)",
        },
        {
          uz: "Nega server brauzerdan kelgan hech narsaga ishonmasligi kerakligini tushunasiz",
          kaa: "Ne ushın server brauzerden kelgen hesh nársege isenbewi kerekligin túsinesiz",
          ru: "Понимать, почему сервер не должен верить ничему, что пришло из браузера",
          en: "Understand why a server must trust nothing that comes from the browser",
        },
      ],
    },

    {
      kind: "heading",
      id: "concept",
      text: { uz: "HTTP — restorandagi buyurtma", kaa: "HTTP — restorandaǵı buyırtpa", ru: "HTTP — заказ в ресторане", en: "HTTP is ordering in a restaurant" },
    },
    {
      kind: "text",
      text: {
        uz: "Restoranni tasavvur qiling. Siz — **mijoz** (brauzer), oshxona — **server**. Siz ofitsiantga buyurtma berasiz: nima kerakligini va qaysi stoldaligingizni aytasiz. Bu — **so‘rov** (request).\n\nOshxona buyurtmani tekshiradi va taom yoki «bu bizda yo‘q» degan javob qaytaradi. Bu — **javob** (response). **HTTP** aynan shu suhbatning qoidalari.\n\nHar kuni ko‘rasiz: brauzerga `youtube.com` deb yozganingizda u YouTube serveriga «bosh sahifani ber» degan so‘rov yuboradi. Videoni bosganingizda — yana bitta so‘rov. «Like» bosganingizda — yana bitta. Bitta sahifa ochilishi ortida o‘nlab so‘rovlar turadi.",
        kaa: "Restorandı kóz aldıńızǵa keltiriń. Siz — **klient** (brauzer), as úy — **server**. Siz ofitsiantqa buyırtpa beresiz: ne kerekligin hám qaysı stolda ekenińizdi aytasız. Bul — **soraw** (request).\n\nAs úy buyırtpanı tekseredi hám tamaq yamasa «bul bizde joq» degen juwap qaytaradı. Bul — **juwap** (response). **HTTP** dál usı sáwbettiń qaǵıydaları.\n\nHár kúni kóresiz: brauzerge `youtube.com` dep jazǵanıńızda ol YouTube serverine «bas betti ber» degen soraw jiberedi. Videonı basqanıńızda — jáne bir soraw. «Like» basqanıńızda — jáne biri. Bir bettiń ashılıwı artında onlaǵan sorawlar turadı.",
        ru: "Представьте ресторан. Вы — **клиент** (браузер), кухня — **сервер**. Вы делаете заказ официанту: говорите, что хотите и за каким вы столиком. Это — **запрос** (request).\n\nКухня проверяет заказ и возвращает блюдо или ответ «этого у нас нет». Это — **ответ** (response). **HTTP** — это правила такого разговора.\n\nВы видите это каждый день: когда вы пишете в браузере `youtube.com`, он отправляет серверу YouTube запрос «дай главную страницу». Нажали на видео — ещё запрос. Поставили лайк — ещё один. За одной открытой страницей стоят десятки запросов.",
        en: "Picture a restaurant. You are the **customer** (the browser) and the kitchen is the **server**. You give the waiter an order: what you want and which table you are at. That is a **request**.\n\nThe kitchen checks the order and sends back a dish or a “we don’t have that”. That is a **response**. **HTTP** is simply the rules of this conversation.\n\nYou see it every day: type `youtube.com` and your browser sends YouTube’s server a request, “give me the home page”. Click a video — another request. Hit like — another. Behind one page are dozens of requests.",
      },
    },
    {
      kind: "terms",
      items: [
        {
          term: "request",
          text: { uz: "**So‘rov** — brauzer serverga yuboradigan xat", kaa: "**Soraw** — brauzer serverge jiberetuǵın xat", ru: "**Запрос** — письмо, которое браузер шлёт серверу", en: "The letter the browser sends to the server" },
        },
        {
          term: "response",
          text: { uz: "**Javob** — server qaytaradigan xat: holat kodi va sahifa", kaa: "**Juwap** — server qaytaratuǵın xat: jaǵday kodı hám bet", ru: "**Ответ** — письмо от сервера: код состояния и страница", en: "The server’s reply: a status code and the page" },
        },
        {
          term: "method",
          text: { uz: "**Metod** — nima qilmoqchisiz: `GET` «ber», `POST` «mana ma’lumot»", kaa: "**Metod** — ne qılmaqshısız: `GET` «ber», `POST` «mine maǵlıwmat»", ru: "**Метод** — что вы хотите: `GET` «дай», `POST` «вот данные»", en: "What you want: `GET` “give me”, `POST` “here is data”" },
        },
        {
          term: "path",
          text: { uz: "**Manzil** — saytning qaysi sahifasi, masalan `/profile`", kaa: "**Mánzil** — sayttıń qaysı beti, mısalı `/profile`", ru: "**Путь** — какая страница сайта, например `/profile`", en: "Which page of the site, such as `/profile`" },
        },
        {
          term: "header",
          text: { uz: "**Sarlavha** — xatga qo‘shilgan qo‘shimcha qator, masalan `Host:` yoki `Cookie:`", kaa: "**Sarlawha** — xatqa qosılǵan qosımsha qatar, mısalı `Host:` yamasa `Cookie:`", ru: "**Заголовок** — дополнительная строка письма, например `Host:` или `Cookie:`", en: "An extra line on the letter, like `Host:` or `Cookie:`" },
        },
        {
          term: "status code",
          text: { uz: "**Holat kodi** — javob boshidagi uch xonali son: `200` yaxshi, `404` topilmadi", kaa: "**Jaǵday kodı** — juwap basındaǵı úsh xanalı san: `200` jaqsı, `404` tabılmadı", ru: "**Код состояния** — трёхзначное число в начале ответа: `200` хорошо, `404` не найдено", en: "The three-digit number at the top of a reply: `200` fine, `404` not found" },
        },
        {
          term: "cookie",
          text: { uz: "Server brauzerga beradigan kichik «chipta». Keyingi har bir so‘rovda brauzer uni qaytarib ko‘rsatadi", kaa: "Server brauzerge beretuǵın kishi «bilet». Keyingi hár bir sorawda brauzer onı qaytarıp kórsetedi", ru: "Маленький «билет», который сервер выдаёт браузеру. Браузер показывает его в каждом следующем запросе", en: "A small “ticket” the server gives the browser. The browser shows it again with every next request" },
        },
      ],
    },

    {
      kind: "heading",
      id: "request",
      text: { uz: "So‘rov ichida nima bor", kaa: "Soraw ishinde ne bar", ru: "Что внутри запроса", en: "What is inside a request" },
    },
    {
      kind: "code",
      language: "http",
      code: {
        uz: "GET /profile HTTP/1.1      ← metod, manzil va versiya\nHost: shop.example         ← qaysi saytga\nCookie: session=7f3a9c     ← «chiptam»: men kimman",
        kaa: "GET /profile HTTP/1.1      ← metod, mánzil hám versiya\nHost: shop.example         ← qaysı saytqa\nCookie: session=7f3a9c     ← «biletim»: men kimmen",
        ru: "GET /profile HTTP/1.1      ← метод, путь и версия\nHost: shop.example         ← на какой сайт\nCookie: session=7f3a9c     ← мой «билет»: кто я",
        en: "GET /profile HTTP/1.1      ← method, path and version\nHost: shop.example         ← which site\nCookie: session=7f3a9c     ← my “ticket”: who I am",
      },
      caption: {
        uz: "Strelkadan keyingi izohlar — tushuntirish uchun, haqiqiy so‘rovda ular bo‘lmaydi.",
        kaa: "Strelkadan keyingi túsindirmeler — túsindiriw ushın, haqıyqıy sorawda olar bolmaydı.",
        ru: "Пояснения после стрелок — для урока, в настоящем запросе их нет.",
        en: "The notes after the arrows are for this lesson; a real request has none.",
      },
    },
    {
      kind: "text",
      text: {
        uz: "Birinchi qator eng muhimi: **nima** qilmoqchisiz (`GET`) va **qayerda** (`/profile`). Keyingi qatorlar — **sarlavhalar**.\n\n`Cookie` sarlavhasi — restorandagi stol raqamingiz. Server sizni har safar «bu kim edi?» deb so‘ramaydi: siz kirganingizda u sizga `session=7f3a9c` degan chipta bergan, brauzer esa uni har bir so‘rovga o‘zi qo‘shib yuboradi.",
        kaa: "Birinshi qatar eń áhmiyetlisi: **ne** qılmaqshısız (`GET`) hám **qay jerde** (`/profile`). Keyingi qatarlar — **sarlawhalar**.\n\n`Cookie` sarlawhası — restorandaǵı stol nomerińiz. Server sizden hár sapar «bul kim edi?» dep soramaydı: siz kirgenińizde ol sizge `session=7f3a9c` degen bilet bergen, brauzer bolsa onı hár bir sorawǵa ózi qosıp jiberedi.",
        ru: "Первая строка главная: **что** вы хотите (`GET`) и **где** (`/profile`). Дальше идут **заголовки**.\n\nЗаголовок `Cookie` — номер вашего столика. Сервер не спрашивает каждый раз «а кто это?»: когда вы вошли, он выдал вам билет `session=7f3a9c`, и браузер сам прикладывает его к каждому запросу.",
        en: "The first line matters most: **what** you want (`GET`) and **where** (`/profile`). The lines after it are **headers**.\n\nThe `Cookie` header is your table number. The server doesn’t ask “who is this?” every time: when you signed in it handed you the ticket `session=7f3a9c`, and the browser attaches it to every request on its own.",
      },
    },

    {
      kind: "heading",
      id: "response",
      text: { uz: "Javob va holat kodlari", kaa: "Juwap hám jaǵday kodları", ru: "Ответ и коды состояния", en: "Responses and status codes" },
    },
    {
      kind: "text",
      text: {
        uz: "Server javobining birinchi qatorida uch xonali **holat kodi** turadi. Uni bilsangiz, sahifaga qaramasdan ham nima bo‘lganini tushunasiz. Xakerlar uchun ayniqsa `403` va `404` farqi qiziq: `403` «sahifa bor, lekin sizga mumkin emas» degani — demak u yerda nimadir yashiringan.",
        kaa: "Server juwabınıń birinshi qatarında úsh xanalı **jaǵday kodı** turadı. Onı bilseńiz, betke qaramastan da ne bolǵanın túsinesiz. Xakerler ushın ásirese `403` hám `404` parqı qızıq: `403` «bet bar, biraq sizge bolmaydı» degeni — demek ol jerde bir nárse jasırınǵan.",
        ru: "В первой строке ответа сервера стоит трёхзначный **код состояния**. Зная его, вы понимаете, что произошло, даже не глядя на страницу. Хакеру особенно интересна разница между `403` и `404`: `403` значит «страница есть, но вам нельзя» — значит, там что-то спрятано.",
        en: "The first line of a server reply holds a three-digit **status code**. Know it and you understand what happened without looking at the page. Attackers care about `403` versus `404`: `403` means “the page exists, but not for you” — so something is hidden there.",
      },
    },
    {
      kind: "code",
      language: "http",
      code: {
        uz: "200 OK                 ← hammasi joyida, mana sahifa\n302 Found              ← boshqa manzilga o‘ting (Location: ...)\n403 Forbidden          ← sizni taniyman, lekin ruxsat yo‘q\n404 Not Found          ← bunday sahifa yo‘q\n405 Method Not Allowed ← bu manzil bunday metodni qabul qilmaydi",
        kaa: "200 OK                 ← hámmesi jayında, mine bet\n302 Found              ← basqa mánzilge ótiń (Location: ...)\n403 Forbidden          ← sizdi tanıyman, biraq ruxsat joq\n404 Not Found          ← bunday bet joq\n405 Method Not Allowed ← bul mánzil bunday metodtı qabıllamaydı",
        ru: "200 OK                 ← всё хорошо, вот страница\n302 Found              ← идите по другому адресу (Location: ...)\n403 Forbidden          ← я вас знаю, но доступа нет\n404 Not Found          ← такой страницы нет\n405 Method Not Allowed ← этот адрес не принимает такой метод",
        en: "200 OK                 ← all good, here is the page\n302 Found              ← go to another address (Location: ...)\n403 Forbidden          ← I know you, but you may not\n404 Not Found          ← no such page\n405 Method Not Allowed ← this address won't take that method",
      },
      caption: {
        uz: "Oddiy qoida: `2xx` — muvaffaqiyat, `3xx` — boshqa joyga yo‘naltirish, `4xx` — siz tomondagi xato, `5xx` — server buzildi.",
        kaa: "Ápiwayı qaǵıyda: `2xx` — tabıs, `3xx` — basqa jerge baǵdarlaw, `4xx` — siz táreptegi qáte, `5xx` — server buzıldı.",
        ru: "Простое правило: `2xx` — успех, `3xx` — перенаправление, `4xx` — ошибка на вашей стороне, `5xx` — сломался сервер.",
        en: "Rule of thumb: `2xx` success, `3xx` go elsewhere, `4xx` your mistake, `5xx` the server broke.",
      },
    },

    {
      kind: "heading",
      id: "journey",
      text: { uz: "So‘rovning to‘liq yo‘li", kaa: "Sorawdıń tolıq jolı", ru: "Полный путь запроса", en: "The full path of a request" },
    },
    {
      kind: "text",
      text: {
        uz: "Bitta tugma bosilishi ortida butun zanjir turadi: brauzer → internet → server → ma’lumotlar bazasi va yana orqaga. Har bir qadamda qizil blokka qarang — hujumchi aynan shu joyni sinab ko‘radi.",
        kaa: "Bir túyme basılıwınıń artında pútkil shınjır tur: brauzer → internet → server → maǵlıwmatlar bazası hám qaytadan artqa. Hár bir qádemde qızıl blokqa qarań — hújimshi dál usı jerdi sınap kóredi.",
        ru: "За одним нажатием кнопки стоит целая цепочка: браузер → интернет → сервер → база данных и обратно. На каждом шаге смотрите на красный блок — именно это место проверяет атакующий.",
        en: "Behind one button press is a whole chain: browser → internet → server → database and back. At every step look at the red box — that is exactly where an attacker pokes.",
      },
    },
    { kind: "widget", widget: "request-journey" },

    {
      kind: "heading",
      id: "live",
      text: { uz: "Jonli misol: do‘konga kirish", kaa: "Janlı mısal: dúkanǵa kiriw", ru: "Живой пример: вход в магазин", en: "Live example: signing in to a shop" },
    },
    {
      kind: "text",
      text: {
        uz: "Quyida `shop.example` degan mashq do‘koni. Avval qadamlarni o‘qing, keyin pastdagi asbobda xuddi shu so‘rovlarni o‘zingiz yuboring va javoblarni solishtiring.",
        kaa: "Tómende `shop.example` degen shınıǵıw dúkanı. Aldın qádemlerdi oqıń, keyin tómendegi ásbapta dál usı sorawlardı ózińiz jiberiń hám juwaplardı salıstırıń.",
        ru: "Ниже — учебный магазин `shop.example`. Сначала прочитайте шаги, затем отправьте те же запросы сами в инструменте ниже и сравните ответы.",
        en: "Below is a practice shop, `shop.example`. Read the steps first, then send the same requests yourself in the tool below and compare the replies.",
      },
    },
    {
      kind: "steps",
      items: [
        {
          text: {
            uz: "**Bosh sahifani so‘raymiz.** Hech qanday cookie kerak emas — bosh sahifa hammaga ochiq.",
            kaa: "**Bas betti soraymız.** Hesh qanday cookie kerek emes — bas bet hámmege ashıq.",
            ru: "**Просим главную страницу.** Cookie не нужен — главная открыта всем.",
            en: "**Ask for the home page.** No cookie needed — the home page is open to all.",
          },
          prompt: "",
          code: "GET / HTTP/1.1\nHost: shop.example",
          output: "HTTP/1.1 200 OK\n\n<h1>Shop</h1>",
        },
        {
          text: {
            uz: "**Profilni cookie’siz so‘raymiz.** Server bizni tanimaydi va kirish sahifasiga jo‘natadi: `302` va `Location: /login`.",
            kaa: "**Profildi cookie’siz soraymız.** Server bizdi tanımaydı hám kiriw betine jiberedi: `302` hám `Location: /login`.",
            ru: "**Просим профиль без cookie.** Сервер нас не знает и отправляет на вход: `302` и `Location: /login`.",
            en: "**Ask for the profile without a cookie.** The server doesn’t know us and sends us to sign in: `302` and `Location: /login`.",
          },
          prompt: "",
          code: "GET /profile HTTP/1.1\nHost: shop.example",
          output: "HTTP/1.1 302 Found\nLocation: /login",
        },
        {
          text: {
            uz: "**Login va parolni yuboramiz.** Bu safar `POST` — chunki biz ma’lumot jo‘natyapmiz. Server parolni tekshiradi va `Set-Cookie` bilan bizga chipta beradi.",
            kaa: "**Login hám paroldi jiberemiz.** Bul sapar `POST` — sebebi biz maǵlıwmat jiberip atırmız. Server paroldi tekseredi hám `Set-Cookie` penen bizge bilet beredi.",
            ru: "**Отправляем логин и пароль.** Теперь `POST` — мы отправляем данные. Сервер проверяет пароль и выдаёт нам билет через `Set-Cookie`.",
            en: "**Send the login and password.** This time `POST`, because we are sending data. The server checks the password and hands us a ticket with `Set-Cookie`.",
          },
          prompt: "",
          code: "POST /login HTTP/1.1\nHost: shop.example",
          output: "HTTP/1.1 302 Found\nLocation: /profile\nSet-Cookie: session=7f3a9c; HttpOnly; Secure",
        },
        {
          text: {
            uz: "**Profilni chipta bilan so‘raymiz.** Endi brauzer `Cookie` sarlavhasini qo‘shadi va server bizni taniydi.",
            kaa: "**Profildi bilet penen soraymız.** Endi brauzer `Cookie` sarlawhasın qosadı hám server bizdi tanıydı.",
            ru: "**Просим профиль с билетом.** Теперь браузер добавляет заголовок `Cookie`, и сервер нас узнаёт.",
            en: "**Ask for the profile with the ticket.** Now the browser adds the `Cookie` header and the server knows us.",
          },
          prompt: "",
          code: "GET /profile HTTP/1.1\nHost: shop.example\nCookie: session=7f3a9c",
          output: "HTTP/1.1 200 OK\n\n<h1>Salom, Aziz</h1>",
        },
        {
          text: {
            uz: "**Admin sahifasini sinab ko‘ramiz.** Server bizni taniydi, lekin biz admin emasmiz — `403`. Diqqat: server buni **har bir so‘rovda** tekshiryapti, tugma ko‘rinish-ko‘rinmasligiga qaramasdan.",
            kaa: "**Admin betin sınap kóremiz.** Server bizdi tanıydı, biraq biz admin emespiz — `403`. Itibar beriń: server bunı **hár bir sorawda** tekserip atır, túymeniń kóriniwine qaramastan.",
            ru: "**Пробуем страницу админа.** Сервер нас знает, но мы не админ — `403`. Обратите внимание: сервер проверяет это **при каждом запросе**, независимо от того, видна ли кнопка.",
            en: "**Try the admin page.** The server knows us, but we are not an admin — `403`. Note that the server checks this **on every request**, whether or not a button is shown.",
          },
          prompt: "",
          code: "GET /admin HTTP/1.1\nHost: shop.example\nCookie: session=7f3a9c",
          output: "HTTP/1.1 403 Forbidden",
        },
      ],
    },
    {
      kind: "text",
      text: {
        uz: "Endi o‘zingiz: metodni, manzilni tanlang va cookie’ni yoqib-o‘chirib ko‘ring. Yuqoridagi beshta javobni qaytara olasizmi? `/backup.zip` ni ham so‘rab ko‘ring.",
        kaa: "Endi ózińiz: metodtı, mánzildi tańlań hám cookie’di qosıp-óshirip kóriń. Joqarıdaǵı bes juwaptı qaytara alasız ba? `/backup.zip` tı da sorap kóriń.",
        ru: "Теперь сами: выбирайте метод и путь, включайте и выключайте cookie. Получится повторить пять ответов выше? Попробуйте и `/backup.zip`.",
        en: "Now you: pick the method and path, toggle the cookie. Can you reproduce the five replies above? Try `/backup.zip` too.",
      },
    },
    { kind: "widget", widget: "http-exchange" },
    {
      kind: "callout",
      tone: "warn",
      text: {
        uz: "**Xavfsizlikning asosiy qoidasi:** so‘rovdagi hamma narsani — manzil, parametrlar, cookie, sarlavhalar — foydalanuvchi o‘zgartira oladi. Server har bir so‘rovni qaytadan tekshirishi shart.",
        kaa: "**Qáwipsizliktiń tiykarǵı qaǵıydası:** sorawdaǵı hámme nárseni — mánzil, parametrler, cookie, sarlawhalar — paydalanıwshı ózgerte aladı. Server hár bir sorawdı qaytadan tekseriwi shárt.",
        ru: "**Главное правило безопасности:** всё в запросе — путь, параметры, cookie, заголовки — пользователь может изменить. Сервер обязан проверять каждый запрос заново.",
        en: "**The core security rule:** everything in a request — path, parameters, cookies, headers — can be changed by the user. The server must re-check every single request.",
      },
    },

    {
      kind: "heading",
      id: "real-life",
      text: { uz: "Haqiqiy hayotda: so‘rovni o‘zgartirish", kaa: "Haqıyqıy turmısta: sorawdı ózgertiw", ru: "В реальной жизни: подмена запроса", en: "For real: tampering with a request" },
    },
    {
      kind: "text",
      text: {
        uz: "Ikki haqiqiy holatni ko‘ring — ikkalasi ham ko‘p uchraydigan zaiflik.\n\n**1. Narx brauzerda.** Onlayn do‘konda «Sotib olish» bosilganda brauzer `POST /buy` bilan `price=1200000` yuboradi. Hujumchi so‘rovni ushlab, `price=1000` ga o‘zgartiradi. Agar server narxni o‘z bazasidan qayta olmasa, telefon 1000 so‘mga sotiladi.\n\n**2. Boshqaning buyurtmasi.** Siz `GET /orders/1001` bilan o‘z buyurtmangizni ko‘ryapsiz. Raqamni `1002` ga o‘zgartirsangiz-chi? Agar server «bu buyurtma shu odamnikimi?» deb tekshirmasa, siz boshqa birovning manzili va telefonini ko‘rasiz. Bu zaiflik **IDOR** deb ataladi va keyingi darslarda uni batafsil o‘rganamiz.\n\nIkkalasida ham xato bitta: server brauzerdan kelgan narsaga ishondi.",
        kaa: "Eki haqıyqıy jaǵdaydı kóriń — ekewi de kóp ushırasatuǵın álsizlik.\n\n**1. Baha brauzerde.** Onlayn dúkanda «Satıp alıw» basılǵanda brauzer `POST /buy` penen `price=1200000` jiberedi. Hújimshi sorawdı uslap, `price=1000` ǵa ózgertedi. Eger server bahanı óz bazasınan qayta almasa, telefon 1000 sumǵa satıladı.\n\n**2. Basqanıń buyırtpası.** Siz `GET /orders/1001` penen óz buyırtpańızdı kórip atırsız. Nomerdi `1002` ge ózgertseńiz-she? Eger server «bul buyırtpa usı adamdıki me?» dep tekseremese, siz basqa birewdiń mánzilin hám telefonın kóresiz. Bul álsizlik **IDOR** dep ataladı hám keyingi sabaqlarda onı tolıq úyrenemiz.\n\nEkewinde de qáte bir: server brauzerden kelgen nársege isendi.",
        ru: "Две реальные ситуации — обе встречаются очень часто.\n\n**1. Цена в браузере.** В интернет-магазине при нажатии «Купить» браузер отправляет `POST /buy` с `price=1200000`. Атакующий перехватывает запрос и меняет на `price=1000`. Если сервер не берёт цену заново из своей базы, телефон уйдёт за 1000 сумов.\n\n**2. Чужой заказ.** Вы смотрите свой заказ через `GET /orders/1001`. А если поменять номер на `1002`? Если сервер не проверяет «это заказ этого человека?», вы увидите чужой адрес и телефон. Такая уязвимость называется **IDOR**, мы подробно разберём её в следующих уроках.\n\nВ обоих случаях ошибка одна: сервер поверил тому, что пришло из браузера.",
        en: "Two real situations — both very common weaknesses.\n\n**1. The price lives in the browser.** In an online shop, pressing “Buy” makes the browser send `POST /buy` with `price=1200000`. An attacker intercepts it and changes it to `price=1000`. If the server doesn’t look the price up again in its own database, the phone sells for 1,000.\n\n**2. Someone else’s order.** You view your order with `GET /orders/1001`. What if you change it to `1002`? If the server never asks “does this order belong to this person?”, you see a stranger’s address and phone number. This is called **IDOR**, and we cover it in detail in later lessons.\n\nBoth share one mistake: the server trusted what came from the browser.",
      },
    },
    {
      kind: "callout",
      tone: "tip",
      text: {
        uz: "**Haqiqiy so‘rovlarni o‘zingiz ko‘ring.** Istalgan saytda **F12** bosing (yoki sichqonchaning o‘ng tugmasi → «Inspect»), **Network** bo‘limini oching va sahifani yangilang. Har bir qator — bitta so‘rov. Birini bosing: metod, manzil, holat kodi va sarlavhalarni ko‘rasiz. Pentesterlar ishni aynan shu oynadan boshlaydi.",
        kaa: "**Haqıyqıy sorawlardı ózińiz kóriń.** Qálegen saytta **F12** basıń (yamasa tışqannıń oń túymesi → «Inspect»), **Network** bólimin ashıń hám betti jańalań. Hár bir qatar — bir soraw. Birin basıń: metod, mánzil, jaǵday kodı hám sarlawhalardı kóresiz. Pentesterler jumıstı dál usı áyneden baslaydı.",
        ru: "**Посмотрите настоящие запросы сами.** На любом сайте нажмите **F12** (или правая кнопка мыши → «Просмотреть код»), откройте вкладку **Network** и обновите страницу. Каждая строка — один запрос. Нажмите на любую: увидите метод, путь, код ответа и заголовки. Пентестеры начинают работу именно с этого окна.",
        en: "**See real requests yourself.** On any site press **F12** (or right-click → “Inspect”), open the **Network** tab and reload the page. Each row is one request. Click one: you’ll see the method, path, status code and headers. Pentesters start their work in exactly this window.",
      },
    },

    {
      kind: "heading",
      id: "ctf",
      text: { uz: "Mini CTF: birinchi flagingiz", kaa: "Mini CTF: birinshi flagıńız", ru: "Мини-CTF: ваш первый флаг", en: "Mini CTF: your first flag" },
    },
    {
      kind: "text",
      text: {
        uz: "**CTF** (*Capture The Flag* — «bayroqni qo‘lga ol») — xakerlar musobaqasi: qayerdadir `FLAG{...}` ko‘rinishidagi yashirin so‘z bor, uni topish kerak.\n\nServer javobi va sahifa kodi oldingizda. Ekranda ko‘rinmaydigan, lekin hammaga ochiq izni toping. Ishoralar ball ayiradi, shuning uchun avval o‘zingiz urinib ko‘ring.",
        kaa: "**CTF** (*Capture The Flag* — «bayraqtı qolǵa al») — xakerler jarısı: qay jerde bolsa da `FLAG{...}` kórinisindegi jasırın sóz bar, onı tabıw kerek.\n\nServer juwabı hám bet kodı aldıńızda. Ekranda kórinbeytuǵın, biraq hámmege ashıq izdi tabıń. Belgiler ball kemitedi, sonlıqtan aldın ózińiz urınıp kóriń.",
        ru: "**CTF** (*Capture The Flag* — «захвати флаг») — хакерское соревнование: где-то спрятано слово вида `FLAG{...}`, его нужно найти.\n\nПеред вами ответ сервера и код страницы. Найдите след, которого не видно на экране, но который открыт всем. Подсказки отнимают очки, так что сначала попробуйте сами.",
        en: "**CTF** (*Capture The Flag*) is a hacking game: a secret word like `FLAG{...}` is hidden somewhere and you have to find it.\n\nThe server response and the page source are in front of you. Find the trace that is invisible on screen but open to everyone. Hints cost points, so try on your own first.",
      },
    },
    { kind: "widget", widget: "flag-hunt" },

    {
      kind: "summary",
      items: [
        {
          uz: "Brauzer **so‘rov** yuboradi, server **javob** qaytaradi — HTTP shu suhbatning qoidalari",
          kaa: "Brauzer **soraw** jiberedi, server **juwap** qaytaradı — HTTP usı sáwbettiń qaǵıydaları",
          ru: "Браузер шлёт **запрос**, сервер возвращает **ответ** — HTTP это правила их разговора",
          en: "The browser sends a **request**, the server sends a **response** — HTTP is the rules of that talk",
        },
        {
          uz: "`GET` — «ber», `POST` — «mana ma’lumot»",
          kaa: "`GET` — «ber», `POST` — «mine maǵlıwmat»",
          ru: "`GET` — «дай», `POST` — «вот данные»",
          en: "`GET` means “give me”, `POST` means “here is data”",
        },
        {
          uz: "`200` — yaxshi, `302` — boshqa joyga, `403` — ruxsat yo‘q, `404` — topilmadi",
          kaa: "`200` — jaqsı, `302` — basqa jerge, `403` — ruxsat joq, `404` — tabılmadı",
          ru: "`200` — хорошо, `302` — в другое место, `403` — нельзя, `404` — не найдено",
          en: "`200` fine, `302` go elsewhere, `403` not allowed, `404` not found",
        },
        {
          uz: "Cookie — server bergan chipta; uni yo‘qotsangiz, server sizni tanimaydi",
          kaa: "Cookie — server bergen bilet; onı joǵaltsańız, server sizdi tanımaydı",
          ru: "Cookie — билет от сервера; без него сервер вас не узнает",
          en: "A cookie is the server’s ticket; lose it and the server forgets you",
        },
        {
          uz: "So‘rovdagi hamma narsani foydalanuvchi o‘zgartira oladi — server har safar tekshirishi shart",
          kaa: "Sorawdaǵı hámme nárseni paydalanıwshı ózgerte aladı — server hár sapar tekseriwi shárt",
          ru: "Пользователь может изменить в запросе всё — сервер обязан проверять каждый раз",
          en: "The user can change anything in a request — the server must check every time",
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
        uz: "Sahifada «Admin» tugmasi yashirilgan. Bu /admin sahifasini himoya qiladimi?",
        kaa: "Bette «Admin» túymesi jasırılǵan. Bul /admin betin qorǵay ma?",
        ru: "Кнопка «Админ» скрыта на странице. Защищает ли это страницу /admin?",
        en: "The “Admin” button is hidden on the page. Does that protect /admin?",
      },
      options: [
        {
          uz: "Ha, tugmasiz u yerga kirib bo‘lmaydi",
          kaa: "Awa, túymesiz ol jerge kirip bolmaydı",
          ru: "Да, без кнопки туда не попасть",
          en: "Yes, without the button nobody can get there",
        },
        {
          uz: "Yo‘q, so‘rovni qo‘lda yuborish mumkin — server tekshirishi kerak",
          kaa: "Yaq, sorawdı qolda jiberiw múmkin — server tekseriwi kerek",
          ru: "Нет, запрос можно отправить вручную — проверять должен сервер",
          en: "No, the request can be sent by hand — the server must check",
        },
      ],
      answer: 1,
      explain: {
        uz: "Brauzer faqat so‘rov yuboruvchi vosita. Har kim `GET /admin` ni qo‘lda yoza oladi, shuning uchun ruxsatni server tekshiradi.",
        kaa: "Brauzer tek soraw jiberiwshi qural. Hár kim `GET /admin` dı qolda jaza aladı, sonlıqtan ruxsattı server tekseredi.",
        ru: "Браузер — лишь инструмент для отправки запросов. Любой может вручную написать `GET /admin`, поэтому доступ проверяет сервер.",
        en: "The browser is only a tool for sending requests. Anyone can type `GET /admin` by hand, so the server checks access.",
      },
    },
    {
      kind: "check",
      question: {
        uz: "Server `403 Forbidden` qaytardi. Bu nimani anglatadi?",
        kaa: "Server `403 Forbidden` qaytardı. Bul neni ańlatadı?",
        ru: "Сервер вернул `403 Forbidden`. Что это значит?",
        en: "The server returned `403 Forbidden`. What does that mean?",
      },
      options: [
        { uz: "Bunday sahifa umuman yo‘q", kaa: "Bunday bet ulıwma joq", ru: "Такой страницы вообще нет", en: "The page doesn’t exist at all" },
        { uz: "Sahifa bor, lekin sizga ruxsat berilmagan", kaa: "Bet bar, biraq sizge ruxsat berilmegen", ru: "Страница есть, но вам доступ закрыт", en: "The page exists, but you are not allowed in" },
        { uz: "Server ishlamay qoldi", kaa: "Server islemey qaldı", ru: "Сервер сломался", en: "The server crashed" },
      ],
      answer: 1,
      explain: {
        uz: "«Yo‘q» — bu `404`, «server buzildi» — `5xx`. `403` esa «bilaman, bu yerda nimadir bor, lekin sizga emas» degani.",
        kaa: "«Joq» — bul `404`, «server buzıldı» — `5xx`. `403` bolsa «bilemen, bul jerde bir nárse bar, biraq sizge emes» degeni.",
        ru: "«Нет такой» — это `404`, «сервер сломался» — `5xx`. А `403` значит «здесь что-то есть, но не для вас».",
        en: "“Doesn’t exist” is `404`, “crashed” is `5xx`. `403` means “there is something here, just not for you”.",
      },
    },
    {
      kind: "check",
      question: {
        uz: "Siz `/login` orqali kirdingiz. Keyingi so‘rovlarda server sizni qanday taniydi?",
        kaa: "Siz `/login` arqalı kirdińiz. Keyingi sorawlarda server sizdi qalay tanıydı?",
        ru: "Вы вошли через `/login`. Как сервер узнаёт вас в следующих запросах?",
        en: "You signed in through `/login`. How does the server recognise you on later requests?",
      },
      options: [
        { uz: "Har safar parolni qayta so‘raydi", kaa: "Hár sapar paroldi qayta soraydı", ru: "Каждый раз заново спрашивает пароль", en: "It asks for the password every time" },
        { uz: "Brauzer har bir so‘rovga cookie’ni qo‘shib yuboradi", kaa: "Brauzer hár bir sorawǵa cookie’di qosıp jiberedi", ru: "Браузер прикладывает cookie к каждому запросу", en: "The browser attaches the cookie to every request" },
        { uz: "Server kompyuteringiz nomini eslab qoladi", kaa: "Server kompyuterińiz atın yadta saqlaydı", ru: "Сервер запоминает имя вашего компьютера", en: "The server remembers your computer’s name" },
      ],
      answer: 1,
      explain: {
        uz: "Kirganingizda server `Set-Cookie` bilan chipta beradi, brauzer esa uni `Cookie:` sarlavhasida har safar qaytaradi. Shuning uchun cookie’ni o‘g‘irlagan odam sizning nomingizdan kira oladi.",
        kaa: "Kirgenińizde server `Set-Cookie` penen bilet beredi, brauzer bolsa onı `Cookie:` sarlawhasında hár sapar qaytaradı. Sonlıqtan cookie’di urlaǵan adam sizdiń atıńızdan kire aladı.",
        ru: "При входе сервер выдаёт билет через `Set-Cookie`, а браузер каждый раз возвращает его в заголовке `Cookie:`. Поэтому тот, кто украл cookie, может войти от вашего имени.",
        en: "On sign-in the server issues a ticket with `Set-Cookie`, and the browser returns it in the `Cookie:` header each time. That is why whoever steals the cookie can act as you.",
      },
    },
    {
      kind: "check",
      question: {
        uz: "Do‘kon «Sotib olish» so‘rovida narxni ham yuboradi: `price=1200000`. Server nima qilishi kerak?",
        kaa: "Dúkan «Satıp alıw» sorawında bahanı da jiberedi: `price=1200000`. Server ne qılıwı kerek?",
        ru: "Магазин в запросе «Купить» отправляет и цену: `price=1200000`. Что должен делать сервер?",
        en: "A shop’s “Buy” request also sends the price: `price=1200000`. What should the server do?",
      },
      options: [
        { uz: "Shu narxni qabul qilish — u sahifadan keldi", kaa: "Usı bahanı qabıllaw — ol betten keldi", ru: "Принять эту цену — она пришла со страницы", en: "Accept it — it came from the page" },
        { uz: "Narxni o‘z bazasidan qayta olish va so‘rovdagisiga ishonmaslik", kaa: "Bahanı óz bazasınan qayta alıw hám sorawdaǵısına isenbew", ru: "Взять цену из своей базы и не верить той, что в запросе", en: "Look the price up in its own database and ignore the one in the request" },
      ],
      answer: 1,
      explain: {
        uz: "Foydalanuvchi so‘rovni ushlab, narxni istalgan songa o‘zgartira oladi. Muhim qarorlar (narx, ruxsat, kimning buyurtmasi) faqat serverdagi ma’lumot asosida qabul qilinadi.",
        kaa: "Paydalanıwshı sorawdı uslap, bahanı qálegen sanǵa ózgerte aladı. Áhmiyetli sheshimler (baha, ruxsat, kimniń buyırtpası) tek serverdegi maǵlıwmat tiykarında qabıl etiledi.",
        ru: "Пользователь может перехватить запрос и поставить любую цену. Важные решения (цена, доступ, чей заказ) принимаются только по данным на сервере.",
        en: "The user can intercept the request and set any price. Important decisions (price, access, whose order) rely only on data held by the server.",
      },
    },
  ],
};

export default lesson;
