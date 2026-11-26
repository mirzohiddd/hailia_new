import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createApp } from '../src/app.js';
import { buildMessage } from '../src/telegram.js';
import { normalizePhone } from '../src/validate.js';

// Telegram API ni soxtalashtiramiz: haqiqiy so'rov yuborilmaydi
const realFetch = globalThis.fetch;
const sentMessages = [];
globalThis.fetch = async (url, opts) => {
  if (String(url).startsWith('https://api.telegram.org/')) {
    sentMessages.push(JSON.parse(opts.body));
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  return realFetch(url, opts);
};
process.env.TELEGRAM_BOT_TOKEN = 'TEST_TOKEN';
process.env.TELEGRAM_CHAT_ID = '-100123';

let server, base, dataFile;

before(async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'halila-'));
  dataFile = path.join(dir, 'leads.json');
  const app = createApp({ dataFile, rateLimit: { windowMs: 60_000, max: 20 } });
  await new Promise((r) => (server = app.listen(0, r)));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const valid = (over = {}) => ({
  name: 'Aziza',
  phone: '+998 90 123 45 67',
  product: 'halila-60',
  intent: 'now',
  forWhom: 'relative',
  consent: true,
  company: '',
  startedAt: Date.now() - 10_000,
  ...over
});
const post = (body) =>
  realFetch(`${base}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });

test('telefon normalizatsiyasi', () => {
  assert.equal(normalizePhone('+998 90 123 45 67'), '+998901234567');
  assert.equal(normalizePhone('901234567'), '+998901234567');
  assert.equal(normalizePhone('+998 00 123 45 67'), null);
  assert.equal(normalizePhone('12345'), null);
});

test('to\'g\'ri ariza saqlanadi va Telegramga to\'g\'ri formatda yuboriladi', async () => {
  const res = await post(valid());
  assert.equal(res.status, 201);
  const leads = JSON.parse(await fs.readFile(dataFile, 'utf8'));
  assert.equal(leads.length, 1);
  assert.equal(leads[0].phone, '+998901234567');
  assert.equal(leads[0].product, 'Halila 60+');
  assert.equal(leads[0].telegram.sent, true);

  const msg = sentMessages.at(-1);
  assert.equal(msg.chat_id, '-100123');
  const lines = msg.text.split('\n');
  assert.equal(lines[0], '🔔 YANGI LID — HALILA');
  assert.equal(lines[1], '');
  assert.equal(lines[2], '👤 Ism: Aziza');
  assert.equal(lines[3], '📞 Telefon: +998 90 123 45 67');
  assert.equal(lines[4], '📦 Mahsulot: Halila 60+');
  assert.equal(lines[5], '📝 Sotib olish istagi: Ha, sotib olmoqchiman');
  assert.equal(lines[6], '👥 Kim uchun: Yaqinim uchun');
  assert.match(lines[7], /^📅 Sana va vaqt: \d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}$/);
  assert.equal(lines[8], '🌐 Manba: Halila Landing');
});

test('takroriy ariza (shu raqam, 24 soat ichida) rad etiladi', async () => {
  const res = await post(valid({ name: 'Boshqa ism', phone: '901234567' }));
  assert.equal(res.status, 409);
  assert.equal((await res.json()).error, 'duplicate');
});

test('honeypot to\'ldirilsa — saqlanmaydi, yuborilmaydi', async () => {
  const before = sentMessages.length;
  const res = await post(valid({ phone: '+998 91 111 11 11', company: 'Spam LLC' }));
  assert.equal(res.status, 200);
  const leads = JSON.parse(await fs.readFile(dataFile, 'utf8'));
  assert.equal(leads.some((l) => l.phone === '+998911111111'), false);
  assert.equal(sentMessages.length, before);
});

test('juda tez yuborilgan forma — spam', async () => {
  const res = await post(valid({ phone: '+998 91 222 22 22', startedAt: Date.now() }));
  assert.equal(res.status, 200);
  const leads = JSON.parse(await fs.readFile(dataFile, 'utf8'));
  assert.equal(leads.some((l) => l.phone === '+998912222222'), false);
});

test('noto\'g\'ri maydonlar rad etiladi', async () => {
  assert.equal((await post(valid({ phone: '123' }))).status, 400);
  assert.equal((await post(valid({ name: 'A' }))).status, 400);
  assert.equal((await post(valid({ name: 'http://spam.com' }))).status, 400);
  assert.equal((await post(valid({ intent: 'no' }))).status, 400);
  assert.equal((await post(valid({ consent: false }))).status, 400);
  assert.equal((await post('{bad json')).status, 400);
});

test('noma\'lum mahsulot "Tanlanmagan" bo\'lib saqlanadi', async () => {
  const res = await post(valid({ phone: '+998 93 333 33 33', product: '<script>' }));
  assert.equal(res.status, 201);
  const leads = JSON.parse(await fs.readFile(dataFile, 'utf8'));
  assert.equal(leads.find((l) => l.phone === '+998933333333').product, 'Tanlanmagan');
});

test('rate limit: ko\'p so\'rov — 429', async () => {
  let last;
  for (let i = 0; i < 25; i++) last = await post(valid({ phone: '1' }));
  assert.equal(last.status, 429);
});

test('xabar matnida maxsus belgilar buzilmaydi', () => {
  const text = buildMessage({
    name: "O'g'iloy <b>",
    phone: '+998901234567',
    product: 'Halila 60+',
    intent: 'Ha, sotib olmoqchiman',
    forWhom: "O'zim uchun",
    createdAt: '2026-11-26T09:05:00Z'
  });
  assert.match(text, /👤 Ism: O'g'iloy <b>/);
  assert.match(text, /📅 Sana va vaqt: 26\.11\.2026, 14:05/);
});
