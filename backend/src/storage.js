import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Arizalarni JSON faylda saqlaydi.
 * Yozish navbat orqali bajariladi (bir vaqtda ikki so'rov faylni buzmasligi uchun)
 * va vaqtinchalik fayl + rename orqali atomik.
 */
export class LeadStore {
  constructor(file) {
    this.file = file;
    this.queue = Promise.resolve();
  }

  async #read() {
    try {
      const raw = await fs.readFile(this.file, 'utf8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      if (err instanceof SyntaxError) {
        // Buzilgan faylni zaxiraga olib, yangisini boshlaymiz
        const backup = `${this.file}.corrupt-${Date.now()}`;
        await fs.rename(this.file, backup).catch(() => {});
        console.error(`[storage] leads.json buzilgan, zaxira: ${backup}`);
        return [];
      }
      throw err;
    }
  }

  async #write(list) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(list, null, 2), 'utf8');
    await fs.rename(tmp, this.file);
  }

  #enqueue(fn) {
    const run = this.queue.then(fn, fn);
    this.queue = run.catch(() => {});
    return run;
  }

  all() {
    return this.#enqueue(() => this.#read());
  }

  /**
   * Takroriy arizani tekshirib, yangisini qo'shadi.
   * Natija: { duplicate: true } | { duplicate: false, record }
   */
  addIfNotDuplicate(lead, windowMs) {
    return this.#enqueue(async () => {
      const list = await this.#read();
      const since = Date.now() - windowMs;
      const dup = list.find(
        (l) => l.phone === lead.phone && Date.parse(l.createdAt) >= since
      );
      if (dup) return { duplicate: true };

      const record = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...lead,
        source: 'Halila Landing',
        telegram: { sent: false }
      };
      list.push(record);
      await this.#write(list);
      return { duplicate: false, record };
    });
  }

  update(id, patch) {
    return this.#enqueue(async () => {
      const list = await this.#read();
      const item = list.find((l) => l.id === id);
      if (!item) return;
      Object.assign(item, patch);
      await this.#write(list);
    });
  }
}
