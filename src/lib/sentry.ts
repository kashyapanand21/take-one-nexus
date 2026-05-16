/**
 * Sentry server-side configuration for Take One Nexus.
 * 
 * Used ONLY for:
 * - API route failures
 * - Database errors
 * - Server exceptions
 * - Authentication failures
 * 
 * NOT used for: frontend analytics, user behavior, session replay.
 */

import * as Sentry from '@sentry/nextjs';

let initialized = false;

/**
 * Initialize Sentry for server-side error monitoring.
 * Safe to call multiple times — only initializes once.
 */
export function initSentry(): void {
  if (initialized || !process.env.SENTRY_DSN) return;
  initialized = true;

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',

    // Sample 10% of transactions in production, 100% in dev
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Sanitize sensitive data before sending to Sentry
    beforeSend(event) {
      // Scrub request bodies
      if (event.request?.data) {
        const data = event.request.data as Record<string, unknown>;
        const sensitive = ['password', 'token', 'secret', 'key', 'hash', 'reset_token', 'verification_token'];
        sensitive.forEach(field => {
          if (data[field]) data[field] = '[REDACTED]';
        });
      }

      // Scrub cookies
      if (event.request?.cookies) {
        const cookies = event.request.cookies as Record<string, string>;
        if (cookies.token) cookies.token = '[REDACTED]';
      }

      return event;
    },

    // Reduce noise — ignore common expected errors
    ignoreErrors: [
      'AbortError',
      'Network request failed',
      'Failed to fetch',
    ],
  });
}

/**
 * Capture an exception with optional context.
 * Safe to call even if Sentry is not initialized.
 */
export function captureError(
  error: unknown,
  context?: {
    endpoint?: string;
    userId?: number;
    action?: string;
    extra?: Record<string, unknown>;
  }
): void {
  if (!process.env.SENTRY_DSN) return;

  try {
    Sentry.withScope(scope => {
      if (context?.endpoint) scope.setTag('endpoint', context.endpoint);
      if (context?.action) scope.setTag('action', context.action);
      if (context?.userId) scope.setUser({ id: String(context.userId) });
      if (context?.extra) scope.setExtras(context.extra);
      Sentry.captureException(error);
    });
  } catch {
    // Sentry must never crash the app
  }
}

/**
 * Wrap an async route handler with Sentry error capturing.
 */
export function withSentry<T>(
  fn: (...args: any[]) => Promise<T>,
  context?: { endpoint?: string; action?: string }
) {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error, context);
      throw error;
    }
  };
}
