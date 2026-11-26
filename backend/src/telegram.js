import { formatPhone } from './validate.js';

export function formatDate(iso) {
  // Toshkent vaqti: 26.11.2026, 14:05
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tashkent',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return `${get('day')}.${get('month')}.${get('year')}, ${get('hour')}:${get('minute')}`;
}

/** Telegram guruhiga yuboriladigan matn (oddiy matn, parse_mode yo'q — maxsus belgilar xavfsiz) */
export function buildMessage(record) {
  return [
    '🔔 YANGI LID — HALILA',
    '',
    `👤 Ism: ${record.name}`,
    `📞 Telefon: ${formatPhone(record.phone)}`,
    `📦 Mahsulot: ${record.product}`,
    `📝 Sotib olish istagi: ${record.intent}`,
    `👥 Kim uchun: ${record.forWhom}`,
    `📅 Sana va vaqt: ${formatDate(record.createdAt)}`,
    `🌐 Manba: Halila Landing`
  ].join('\n');
}

export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

/** Xabar yuboradi. Natija: { sent: boolean, error?: string } */
export async function sendToTelegram(text, { attempts = 2 } = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { sent: false, error: 'not_configured' };
  }

  let lastError = 'unknown';
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
        signal: AbortSignal.timeout(10_000)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) return { sent: true };
      lastError = data.description || `HTTP ${res.status}`;
      // 4xx (noto'g'ri token/chat) — qayta urinishdan foyda yo'q
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break;
    } catch (err) {
      lastError = err.name === 'TimeoutError' ? 'timeout' : err.message;
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 1000));
  }
  return { sent: false, error: lastError };
}
