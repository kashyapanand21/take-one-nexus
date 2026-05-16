/**
 * Cookie consent management for Take One Nexus.
 * Persists preferences to localStorage with versioning support.
 * All PostHog features respect this consent state.
 */

export interface ConsentPreferences {
  essential: true; // always true — cannot be disabled
  analytics: boolean;
  sessionReplay: boolean;
  featureFlags: boolean;
}

const CONSENT_KEY = 'ton_cookie_consent';
const CONSENT_VERSION = 1;

interface StoredConsent {
  version: number;
  preferences: ConsentPreferences;
  timestamp: number;
}

/** Check if user has made a consent decision (regardless of what they chose) */
export function hasConsented(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return false;
    const parsed: StoredConsent = JSON.parse(stored);
    return parsed.version === CONSENT_VERSION;
  } catch {
    return false;
  }
}

/** Get current consent preferences. Returns null if no decision made yet. */
export function getConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    const parsed: StoredConsent = JSON.parse(stored);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed.preferences;
  } catch {
    return null;
  }
}

/** Save consent preferences to localStorage */
export function setConsent(preferences: Omit<ConsentPreferences, 'essential'>): void {
  if (typeof window === 'undefined') return;
  try {
    const stored: StoredConsent = {
      version: CONSENT_VERSION,
      preferences: { essential: true, ...preferences },
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
    // Dispatch custom event so PostHogProvider can react
    window.dispatchEvent(new CustomEvent('consentUpdated', { detail: stored.preferences }));
  } catch {
    // localStorage may be blocked (private mode, etc.) — silent fail
  }
}

/** Accept all cookie categories */
export function acceptAll(): void {
  setConsent({ analytics: true, sessionReplay: true, featureFlags: true });
}

/** Reject all non-essential cookies */
export function rejectAll(): void {
  setConsent({ analytics: false, sessionReplay: false, featureFlags: false });
}

/** Clear stored consent (e.g. for testing or re-prompting) */
export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // silent fail
  }
}
