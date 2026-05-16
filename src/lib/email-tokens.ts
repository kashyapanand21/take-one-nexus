import crypto from 'crypto';

/** Duration for email verification tokens (24 hours) */
export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/** Duration for password reset tokens (1 hour) */
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

/**
 * Generate a cryptographically secure random token (hex string, 64 chars).
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a token before storing in the DB so raw tokens are never persisted.
 * Uses SHA-256 — fast enough for token lookups, secure for storage.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Returns the expiry DateTime for an email verification token.
 */
export function getVerificationExpiry(): Date {
  return new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
}

/**
 * Returns the expiry DateTime for a password reset token.
 */
export function getResetExpiry(): Date {
  return new Date(Date.now() + RESET_TOKEN_TTL_MS);
}

/**
 * Check whether a given expiry date has passed.
 */
export function isExpired(expiresAt: Date | null | undefined): boolean {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
}
