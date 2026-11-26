import { PRODUCTS, INTENTS, FOR_WHOM, NO_PRODUCT } from './catalog.js';

// Bot formani shu vaqtdan tezroq to'ldira olmaydi (ms)
export const MIN_FILL_MS = 2500;

/** Telefonni +998XXXXXXXXX ko'rinishiga keltiradi yoki null qaytaradi */
export function normalizePhone(raw) {
  if (typeof raw !== 'string') return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 9) digits = '998' + digits;
  if (!/^998\d{9}$/.test(digits)) return null;
  // Uzbekiston operator kodlari: 2 xonali, 0 bilan boshlanmaydi
  if (digits[3] === '0') return null;
  return '+' + digits;
}

export function formatPhone(p) {
  // +998 90 123 45 67
  const d = p.replace(/\D/g, '');
  return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10, 12)}`;
}

function cleanName(raw) {
  if (typeof raw !== 'string') return null;
  const name = raw.normalize('NFC').replace(/\s+/g, ' ').trim();
  if (name.length < 2 || name.length > 60) return null;
  // Harflar (lotin, kirill), bo'sh joy, apostrof va defis
  if (!/^[\p{L}][\p{L}\s'ʻʼ‘’`.-]*$/u.test(name)) return null;
  if (/(https?:|www\.|@|<|>)/i.test(name)) return null;
  return name;
}

/**
 * Natija: { ok: true, lead } | { ok: false, status, error } | { ok: true, spam: true }
 */
export function validateLead(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, error: 'invalid_body' };
  }

  // Honeypot: odam ko'rmaydigan "company" maydoni to'ldirilgan bo'lsa — bot
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return { ok: true, spam: true, reason: 'honeypot' };
  }
  // Juda tez yuborilgan forma — bot
  const started = Number(body.startedAt);
  if (!Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) {
    return { ok: true, spam: true, reason: 'too_fast' };
  }

  if (body.consent !== true) {
    return { ok: false, status: 400, error: 'consent_required' };
  }

  const name = cleanName(body.name);
  if (!name) return { ok: false, status: 400, error: 'invalid_name' };

  const phone = normalizePhone(body.phone);
  if (!phone) return { ok: false, status: 400, error: 'invalid_phone' };

  if (!Object.hasOwn(INTENTS, body.intent)) {
    return { ok: false, status: 400, error: 'invalid_intent' };
  }
  if (!Object.hasOwn(FOR_WHOM, body.forWhom)) {
    return { ok: false, status: 400, error: 'invalid_for_whom' };
  }

  const productCode = Object.hasOwn(PRODUCTS, body.product) ? body.product : null;

  return {
    ok: true,
    lead: {
      name,
      phone,
      productCode,
      product: productCode ? PRODUCTS[productCode] : NO_PRODUCT,
      intentCode: body.intent,
      intent: INTENTS[body.intent],
      forWhomCode: body.forWhom,
      forWhom: FOR_WHOM[body.forWhom]
    }
  };
}
