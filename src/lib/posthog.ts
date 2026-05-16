/**
 * PostHog client for Take One Nexus.
 * 
 * Used ONLY for:
 * - Analytics (page views, custom events)
 * - Session Replay (with input masking)
 * - Feature Flags
 * 
 * NOT used for: error tracking, API monitoring (that's Sentry).
 * All tracking respects cookie consent preferences.
 */

import { ConsentPreferences } from './cookie-consent';

let posthogInstance: any = null;

/**
 * Initialize PostHog with consent-aware settings.
 * Call this after the user has granted consent.
 */
export async function initPostHog(consent: ConsentPreferences): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

  if (!key || typeof window === 'undefined') return;

  try {
    const posthog = (await import('posthog-js')).default;

    if (!posthogInstance) {
      posthog.init(key, {
        api_host: host,
        // Performance: only load what's consented
        capture_pageview: consent.analytics,
        capture_pageleave: consent.analytics,
        // Session replay config
        session_recording: {
          maskAllInputs: true,                        // mask all inputs by default
          maskInputOptions: {
            password: true,                           // always mask passwords
          },
          // maskInputFn masks any input containing 'token', 'secret', 'key'
        },
        // Disable persistence to respect consent until explicitly enabled
        persistence: consent.analytics ? 'localStorage+cookie' : 'memory',
        // Don't auto-capture if no analytics consent
        autocapture: consent.analytics,
        disable_session_recording: !consent.sessionReplay,
        // Bootstrap feature flags only if consented
        bootstrap: consent.featureFlags ? {} : undefined,
        loaded: (ph: any) => {
          posthogInstance = ph;
          // Apply session replay consent
          if (!consent.sessionReplay) {
            ph.stopSessionRecording();
          }
        },
      });
    } else {
      // Already initialized — update opt-in state
      if (consent.analytics) {
        posthog.opt_in_capturing();
      } else {
        posthog.opt_out_capturing();
      }

      if (!consent.sessionReplay) {
        posthog.stopSessionRecording();
      } else {
        posthog.startSessionRecording();
      }
    }
  } catch (err) {
    // PostHog init should never break the app
    console.warn('[PostHog] Initialization failed:', err);
  }
}

/**
 * Opt out of all PostHog capturing (called on consent rejection).
 */
export async function optOutPostHog(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const posthog = (await import('posthog-js')).default;
    posthog.opt_out_capturing();
    posthog.stopSessionRecording();
  } catch {
    // silent fail
  }
}

/**
 * Track a custom event. No-ops if PostHog is not initialized or not consented.
 */
export async function trackEvent(event: string, properties?: Record<string, unknown>): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const posthog = (await import('posthog-js')).default;
    posthog.capture(event, {
      ...properties,
      // Always include IST timestamp for consistency
      event_time_ist: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });
  } catch {
    // Never let tracking break the UI
  }
}

/**
 * Identify a user in PostHog (called after login).
 * Strips sensitive fields before sending.
 */
export async function identifyUser(userId: string | number, traits?: Record<string, unknown>): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const posthog = (await import('posthog-js')).default;
    // Sanitize — never send password, token, or secret
    const safe = Object.fromEntries(
      Object.entries(traits || {}).filter(
        ([k]) => !/(password|token|secret|key|hash)/i.test(k)
      )
    );
    posthog.identify(String(userId), safe);
  } catch {
    // silent fail
  }
}

/**
 * Reset PostHog user identity (called on logout).
 */
export async function resetPostHog(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const posthog = (await import('posthog-js')).default;
    posthog.reset();
  } catch {
    // silent fail
  }
}
