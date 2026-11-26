/**
 * Oddiy xotiradagi rate limiter (IP bo'yicha).
 * Bitta server instansiyasi uchun yetarli; bir nechta instansiya bo'lsa — Redis kerak bo'ladi.
 */
export function createRateLimiter({ windowMs, max }) {
  const hits = new Map();

  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, arr] of hits) {
      const fresh = arr.filter((t) => now - t < windowMs);
      if (fresh.length) hits.set(key, fresh);
      else hits.delete(key);
    }
  }, windowMs);
  timer.unref();

  return function rateLimit(req, res, next) {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (arr.length >= max) {
      const retry = Math.ceil((windowMs - (now - arr[0])) / 1000);
      res.set('Retry-After', String(retry));
      return res.status(429).json({ ok: false, error: 'too_many_requests' });
    }
    arr.push(now);
    hits.set(key, arr);
    next();
  };
}
