'use client';

import { useEffect, useCallback } from 'react';
import { getConsent, hasConsented } from '@/lib/cookie-consent';
import { initPostHog, optOutPostHog } from '@/lib/posthog';

interface PostHogProviderProps {
  children: React.ReactNode;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  const applyConsent = useCallback(async () => {
    if (!hasConsented()) return;
    const consent = getConsent();
    if (!consent) return;

    if (consent.analytics || consent.sessionReplay || consent.featureFlags) {
      await initPostHog(consent);
    } else {
      await optOutPostHog();
    }
  }, []);

  useEffect(() => {
    // Apply consent on initial load
    applyConsent();

    // Listen for consent changes (from CookieConsentBanner dispatching custom events)
    const handleConsentUpdate = () => applyConsent();
    window.addEventListener('consentUpdated', handleConsentUpdate);
    return () => window.removeEventListener('consentUpdated', handleConsentUpdate);
  }, [applyConsent]);

  return <>{children}</>;
}
