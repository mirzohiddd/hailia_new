import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LeadStore } from './storage.js';
import { validateLead } from './validate.js';
import { buildMessage, sendToTelegram, telegramConfigured } from './telegram.js';
import { createRateLimiter } from './rateLimit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Bir xil telefon raqamdan qayta ariza qabul qilinmaydigan muddat
export const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function createApp({
  dataFile = process.env.LEADS_FILE || path.join(__dirname, '..', 'data', 'leads.json'),
  rateLimit = { windowMs: 10 * 60 * 1000, max: 5 }
} = {}) {
  const app = express();
  const store = new LeadStore(dataFile);

  app.disable('x-powered-by');
  // Railway / Render proksi orqali ishlaydi — haqiqiy IP uchun
  app.set('trust proxy', 1);

  const origins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: origins.length ? origins : true,
      methods: ['GET', 'POST'],
      maxAge: 86400
    })
  );

  app.use(express.json({ limit: '10kb' }));

  app.get('/', (_req, res) => res.json({ ok: true, service: 'halila-backend' }));
  app.get('/api/health', (_req, res) =>
    res.json({ ok: true, telegram: telegramConfigured() ? 'configured' : 'not_configured' })
  );

  app.post('/api/leads', createRateLimiter(rateLimit), async (req, res) => {
    const v = validateLead(req.body);

    if (!v.ok) return res.status(v.status).json({ ok: false, error: v.error });

    // Spam: botga muvaffaqiyat ko'rsatamiz, lekin hech narsa saqlamaymiz va yubormaymiz
    if (v.spam) {
      console.warn(`[lead] spam rad etildi (${v.reason}) ip=${req.ip}`);
      return res.json({ ok: true });
    }

    try {
      const result = await store.addIfNotDuplicate(v.lead, DUPLICATE_WINDOW_MS);
      if (result.duplicate) {
        return res.status(409).json({ ok: false, error: 'duplicate' });
      }

      const { record } = result;
      const tg = await sendToTelegram(buildMessage(record));
      await store.update(record.id, {
        telegram: tg.sent ? { sent: true, at: new Date().toISOString() } : { sent: false, error: tg.error }
      });
      if (!tg.sent) console.error(`[lead] ${record.id} Telegramga yuborilmadi: ${tg.error}`);
      else console.log(`[lead] ${record.id} qabul qilindi va Telegramga yuborildi`);

      // Ariza saqlandi — mijoz uchun muvaffaqiyatli
      return res.status(201).json({ ok: true, id: record.id });
    } catch (err) {
      console.error('[lead] xatolik:', err);
      return res.status(500).json({ ok: false, error: 'server_error' });
    }
  });

  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ ok: false, error: 'invalid_json' });
    }
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ ok: false, error: 'too_large' });
    }
    console.error(err);
    res.status(500).json({ ok: false, error: 'server_error' });
  });

  app.use((_req, res) => res.status(404).json({ ok: false, error: 'not_found' }));

  return app;
}
