/**
 * Lightweight in-memory sliding-window rate limiter.
 * Works on Vercel Serverless Functions (per-instance).
 * For cross-instance persistence, set RATE_LIMIT_STORE=redis://...
 * 
 * Degrades gracefully — never blocks on an internal error.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to prevent memory leaks
let cleanupScheduled = false;
function scheduleCleanup() {
  if (cleanupScheduled) return;
  cleanupScheduled = true;
  setTimeout(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      // Remove entries older than 2 hours
      if (now - entry.windowStart > 2 * 60 * 60 * 1000) {
        store.delete(key);
      }
    }
    cleanupScheduled = false;
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter: number; // seconds
}

export interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

/**
 * Check and increment rate limit for a given key.
 * @param key - Unique identifier (e.g. "login:192.168.1.1" or "register:user@email.com")
 * @param options - Limit and window configuration
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  try {
    const now = Date.now();
    const existing = store.get(key);

    if (!existing || now - existing.windowStart >= options.windowMs) {
      // New window
      store.set(key, { count: 1, windowStart: now });
      scheduleCleanup();
      return {
        success: true,
        remaining: options.limit - 1,
        resetAt: new Date(now + options.windowMs),
        retryAfter: 0,
      };
    }

    if (existing.count >= options.limit) {
      // Rate limited
      const resetAt = new Date(existing.windowStart + options.windowMs);
      const retryAfter = Math.ceil((existing.windowStart + options.windowMs - now) / 1000);
      return {
        success: false,
        remaining: 0,
        resetAt,
        retryAfter,
      };
    }

    // Within limit — increment
    existing.count += 1;
    store.set(key, existing);
    return {
      success: true,
      remaining: options.limit - existing.count,
      resetAt: new Date(existing.windowStart + options.windowMs),
      retryAfter: 0,
    };
  } catch {
    // Fail open — never block a valid user due to limiter error
    return {
      success: true,
      remaining: 1,
      resetAt: new Date(Date.now() + 60000),
      retryAfter: 0,
    };
  }
}

/**
 * Build a rate limit key from request IP and optional identifier.
 */
export function buildRateLimitKey(prefix: string, ip: string, identifier?: string): string {
  const id = identifier ? `:${identifier}` : '';
  return `${prefix}:${ip}${id}`;
}

/**
 * Extract client IP from Next.js request headers.
 */
export function getClientIP(request: Request): string {
  const headers = request.headers;
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}
