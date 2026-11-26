import 'dotenv/config';
import { createApp } from './app.js';
import { telegramConfigured } from './telegram.js';

const PORT = Number(process.env.PORT) || 8000;

createApp().listen(PORT, () => {
  console.log(`Halila backend: http://localhost:${PORT}`);
  if (!telegramConfigured()) {
    console.warn('DIQQAT: TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID berilmagan — arizalar faqat JSON faylga saqlanadi.');
  }
});
