import { RateLimitOptions } from './rate-limiter';

/**
 * Rate limit configurations per endpoint type.
 * Tuned to be strict enough to block abuse without impacting legitimate users.
 */
export const RATE_LIMITS: Record<string, RateLimitOptions> = {
  // Auth endpoints — strict to prevent brute-force
  login: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 5 attempts per 15 min
  },
  register: {
    limit: 3,
    windowMs: 60 * 60 * 1000, // 3 accounts per hour per IP
  },

  // Email endpoints — prevent spam
  forgotPassword: {
    limit: 3,
    windowMs: 60 * 60 * 1000, // 3 resets per hour per email
  },
  resendVerification: {
    limit: 3,
    windowMs: 60 * 60 * 1000, // 3 resend attempts per hour per email
  },
  verifyEmail: {
    limit: 10,
    windowMs: 60 * 60 * 1000, // 10 token checks per hour per IP
  },
  resetPassword: {
    limit: 5,
    windowMs: 60 * 60 * 1000, // 5 reset attempts per hour per IP
  },

  // Feature endpoints
  chatMessage: {
    limit: 30,
    windowMs: 60 * 1000, // 30 messages per minute per user
  },
  taskCreate: {
    limit: 10,
    windowMs: 60 * 1000, // 10 tasks per minute per user
  },

  // Generic API fallback
  api: {
    limit: 100,
    windowMs: 60 * 1000, // 100 requests per minute per IP
  },
};
