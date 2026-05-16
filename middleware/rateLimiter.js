/**
 * Express rate limiter middleware for legacy routes.
 * Lightweight in-memory sliding window — no external dependencies.
 */

const store = new Map();

function checkLimit(key, limit, windowMs) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { success: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
    return { success: false, remaining: 0, retryAfter };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, retryAfter: 0 };
}

// Cleanup entries older than 2 hours every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > 2 * 60 * 60 * 1000) store.delete(key);
  }
}, 10 * 60 * 1000);

/**
 * Create an Express rate limit middleware.
 * @param {object} options
 * @param {number} options.limit - Max requests
 * @param {number} options.windowMs - Window duration in ms
 * @param {string} [options.keyPrefix] - Prefix for the rate limit key
 * @param {function} [options.keyFn] - Custom key function (req) => string
 */
function createRateLimiter({ limit, windowMs, keyPrefix = 'rl', keyFn }) {
  return function rateLimiterMiddleware(req, res, next) {
    try {
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'unknown';
      const key = keyFn ? keyFn(req) : `${keyPrefix}:${ip}`;
      const result = checkLimit(key, limit, windowMs);

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);

      if (!result.success) {
        res.setHeader('Retry-After', result.retryAfter);
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please wait before trying again.',
          retryAfter: result.retryAfter
        });
      }

      next();
    } catch (err) {
      // Fail open — never block on limiter error
      next();
    }
  };
}

module.exports = { createRateLimiter };
