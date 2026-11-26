# Halila Landing

Halila saytining nusxasi: **Vue 3 + Vite** (frontend) va **Node.js + Express** (backend).
Arizalar JSON faylga saqlanadi va Telegram guruhiga yuboriladi.

```text
halila-landing/
├── frontend/          Vue 3 + Vite (Vercel)
│   ├── public/img/    Logotip, bosh rasm, mahsulot va tarif rasmlari
│   └── src/
│       ├── data/      Mahsulotlar, tariflar, kontaktlar, sharh videolari
│       ├── i18n.js    UZ / RU matnlari
│       ├── views/     Sahifalar
│       └── components/
├── backend/           Express API (Render yoki Railway)
│   ├── src/           server, validatsiya, JSON saqlash, Telegram
│   ├── test/          API testlari (node --test)
│   └── data/          leads.json (avtomatik yaratiladi)
├── render.yaml
├── .gitignore
└── README.md
```

## Sahifalar

| Manzil | Sahifa |
|---|---|
| `/` (`/index.html`) | Bosh sahifa |
| `/products` (`/products.html`) | Mahsulotlar (6 ta) |
| `/sales` (`/sales.html`) | Tariflar: Silver, Gold, Gold Plus |
| `/reviews` (`/reviews.html`) | Mijozlar video sharhlari |
| `/contact` (`/contact.html`) | Aloqa |
| `/ariza` | 3 bosqichli ariza |

Original saytdagi `.html` manzillar ham ishlaydi.

## Lokal ishga tushirish

Node.js 18.17 yoki undan yangi versiya kerak.

```bash
# 1. Backend
cd backend
cp .env.example .env        # TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni yozing
npm install
npm start                   # http://localhost:8000

# 2. Frontend (yangi terminalda)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Lokal rejimda frontend `/api` so'rovlarini avtomatik `localhost:8000` ga yo'naltiradi.

## Backend `.env`

```env
PORT=8000
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Ixtiyoriy:
- `CORS_ORIGIN` — frontend domeni, masalan `https://halila.vercel.app`. Vergul bilan bir nechta domen yozish mumkin. Bo'sh bo'lsa, barcha domenlarga ruxsat beriladi.
- `LEADS_FILE` — `leads.json` fayl yo'li (standart: `backend/data/leads.json`).

Bot tokeni faqat backendda saqlanadi, frontendga hech qachon yuborilmaydi.

### Telegram botni sozlash

1. [@BotFather](https://t.me/BotFather) → `/newbot` → tokenni `TELEGRAM_BOT_TOKEN` ga yozing.
2. Botni Telegram guruhga qo'shing va guruhda biror xabar yozing.
3. `https://api.telegram.org/bot<TOKEN>/getUpdates` manziliga kiring. `"chat":{"id":-100...}` dagi raqamni `TELEGRAM_CHAT_ID` ga yozing.
4. Tekshirish: `GET /api/health` → `"telegram":"configured"`.

### Guruhga keladigan xabar

```text
🔔 YANGI LID — HALILA

👤 Ism: Dilnoza
📞 Telefon: +998 90 123 45 67
📦 Mahsulot: Halila Geniy
📝 Sotib olish istagi: Ha, sotib olmoqchiman
👥 Kim uchun: Yaqinim uchun
📅 Sana va vaqt: 26.11.2026, 14:05
🌐 Manba: Halila Landing
```

Vaqt Toshkent vaqtida ko'rsatiladi. Mahsulot "Buyurtma berish" tugmasidan olinadi (Mahsulotlar/Tariflar → Aloqa → Ariza). Ariza to'g'ridan-to'g'ri ochilsa, mahsulot "Tanlanmagan" bo'ladi.

## API

`POST /api/leads`

```json
{
  "name": "Dilnoza",
  "phone": "+998901234567",
  "product": "geniy",
  "intent": "now | later | unsure",
  "forWhom": "self | relative",
  "consent": true,
  "company": "",
  "startedAt": 1764150000000
}
```

| Javob | Ma'nosi |
|---|---|
| `201 {ok:true,id}` | Ariza saqlandi (va Telegramga yuborildi) |
| `400 {error}` | `invalid_name`, `invalid_phone`, `invalid_intent`, `invalid_for_whom`, `consent_required` |
| `409 {error:"duplicate"}` | Shu raqamdan 24 soat ichida ariza bor |
| `429` | Juda ko'p so'rov |

## Spam va takroriy arizalardan himoya

- **Honeypot**: ko'rinmaydigan `company` maydoni. Bot uni to'ldirsa, ariza jimgina tashlab yuboriladi.
- **Vaqt tekshiruvi**: forma 2.5 soniyadan tez yuborilsa, spam deb hisoblanadi.
- **Rate limit**: bitta IP manzildan 10 daqiqada 5 tagacha so'rov.
- **Takroriy ariza**: bir xil telefon raqamdan 24 soat ichida ikkinchi ariza qabul qilinmaydi.
- **Validatsiya**: faqat O'zbekiston raqami (+998), ism faqat harflardan; javoblar va mahsulot faqat ruxsat etilgan ro'yxatdan; so'rov hajmi 10 KB gacha.
- **Saqlash**: JSON faylga navbat bilan va atomik yoziladi (bir vaqtdagi so'rovlar faylni buzmaydi).

Telegram ishlamay qolsa ham ariza saqlanadi va mijozga muvaffaqiyat ko'rsatiladi. `leads.json` da `telegram.sent:false` va xato sababi qayd etiladi.

## Testlar

```bash
cd backend && npm test
```

9 ta test: validatsiya, Telegram xabar formati, takroriy ariza, honeypot, vaqt tekshiruvi, rate limit.

## Deploy

### Frontend → Vercel

1. Repozitoriyni Vercel'ga ulang, **Root Directory**: `frontend`.
2. Environment variable: `VITE_API_URL=https://<backend-domeni>` (oxirida `/` siz).
3. Deploy. `vercel.json` barcha sahifa manzillarini SPA'ga yo'naltiradi.

### Backend → Render

- Root dagi `render.yaml` orqali (Blueprint), yoki qo'lda: Root Directory `backend`, Build `npm install`, Start `npm start`.
- Env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CORS_ORIGIN=https://<vercel-domeni>`.
- `leads.json` o'chib ketmasligi uchun **Disk** ulang (`render.yaml` da `/var/data` sozlangan, `LEADS_FILE=/var/data/leads.json`). Disk pullik tariflarda mavjud.

### Backend → Railway

- New Project → GitHub repo → **Root Directory**: `backend`. `railway.json` start buyrug'ini belgilaydi.
- Variables: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CORS_ORIGIN`.
- **Volume** qo'shing (masalan `/data`) va `LEADS_FILE=/data/leads.json` qiling. Aks holda har deployda fayl tozalanadi.
- `PORT` ni Railway o'zi beradi.

## Kontentni o'zgartirish

- **Mahsulot va tariflar**: `frontend/src/data/products.js`.
- **Sharh videolari**: `frontend/src/data/site.js` → `REVIEW_VIDEOS` (YouTube ID). Bosh sahifada birinchi 3 tasi chiqadi.
- **Telefon va ijtimoiy tarmoqlar**: `frontend/src/data/site.js`.
- **Matnlar (UZ/RU)**: `frontend/src/i18n.js`.
- **Rasmlar**: `frontend/public/img/`. Original saytdagi fayl nomlari saqlangan (`bosh-sahifa.jpg`, `products/halila-60.png`, `packages/gold.jpg` va h.k.). Asl fayllarni shu nomlar bilan almashtirsangiz, sifat oshadi.

## Eslatmalar

- Original saytdagi uchib yuruvchi barglar va scroll progress chizig'i olib tashlangan (animatsiyasiz talab).
- Mahsulot tavsiflarida tasdiqlanmagan tibbiy da'volar (davolash, saraton, o'sma va h.k.) yo'q. Rasmiy tasdiqlangan matn bo'lsa, `products.js` ga qo'shing.
