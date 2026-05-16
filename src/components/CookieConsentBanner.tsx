'use client';

import { useState, useEffect, useCallback } from 'react';

interface CookieConsentBannerProps {
  onConsentChange?: (prefs: { analytics: boolean; sessionReplay: boolean; featureFlags: boolean }) => void;
}

export default function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: true, sessionReplay: true, featureFlags: true });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('ton_cookie_consent');
    if (!stored) {
      // Small delay so page loads first
      setTimeout(() => setVisible(true), 1200);
    }
  }, []);

  const save = useCallback((preferences: typeof prefs) => {
    const { setConsent } = require('@/lib/cookie-consent');
    setConsent(preferences);
    setVisible(false);
    onConsentChange?.(preferences);
  }, [onConsentChange]);

  const acceptAll = () => save({ analytics: true, sessionReplay: true, featureFlags: true });
  const rejectAll = () => save({ analytics: false, sessionReplay: false, featureFlags: false });
  const saveCustom = () => save(prefs);

  if (!mounted || !visible) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(6,8,10,0.7)',
        zIndex: 99990, backdropFilter: 'blur(4px)',
        animation: 'consentFadeIn 0.4s ease',
      }} />

      {/* Banner */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 99991,
        background: 'var(--machine)',
        borderTop: '1px solid rgba(255,77,26,0.25)',
        boxShadow: '0 -8px 40px rgba(255,77,26,0.12), 0 -2px 0 rgba(0,212,255,0.15) inset',
        animation: 'consentSlideUp 0.45s cubic-bezier(0.22,1,0.36,1)',
        fontFamily: 'var(--font-main)',
      }}>
        {/* Neon top line */}
        <div style={{ height: 2, background: 'linear-gradient(to right, var(--neon), var(--cyan), var(--amber))', position: 'absolute', top: -1, left: 0, right: 0 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
          {!showCustomize ? (
            /* Default banner */
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.4em', color: 'var(--neon)', textTransform: 'uppercase', marginBottom: 6 }}>
                  🍪 COOKIE PROTOCOL
                </div>
                <p style={{ fontSize: 12, color: 'var(--silver)', lineHeight: 1.7, letterSpacing: '0.04em', margin: 0 }}>
                  TAKE ONE Nexus uses cookies for essential platform features, analytics to improve the experience, session replay to fix bugs, and feature flags for gradual rollouts. Your privacy is respected — analytics and replay only activate with your consent.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  id="cookie-customize"
                  onClick={() => setShowCustomize(true)}
                  style={ghostBtn}
                >
                  Customize
                </button>
                <button
                  id="cookie-reject"
                  onClick={rejectAll}
                  style={secondaryBtn}
                >
                  Reject Non-Essential
                </button>
                <button
                  id="cookie-accept-all"
                  onClick={acceptAll}
                  style={primaryBtn}
                >
                  Accept All →
                </button>
              </div>
            </div>
          ) : (
            /* Customize panel */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: '0.4em', color: 'var(--neon)', textTransform: 'uppercase', marginBottom: 4 }}>COOKIE PREFERENCES</div>
                  <div style={{ fontSize: 14, fontFamily: 'var(--font-title)', letterSpacing: '0.15em', color: 'var(--cream)' }}>CONFIGURE TRACKING</div>
                </div>
                <button onClick={() => setShowCustomize(false)} style={{ background: 'none', border: 'none', color: 'var(--silver)', cursor: 'pointer', fontSize: 18 }}>×</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
                {[
                  { key: 'essential', label: 'Essential', desc: 'Authentication, security, core features', locked: true },
                  { key: 'analytics', label: 'Analytics', desc: 'Page views, events, engagement metrics' },
                  { key: 'sessionReplay', label: 'Session Replay', desc: 'Bug detection with input masking' },
                  { key: 'featureFlags', label: 'Feature Flags', desc: 'Gradual rollout & A/B testing' },
                ].map(cat => (
                  <div key={cat.key} style={{ background: 'var(--panel)', border: `1px solid ${cat.locked || prefs[cat.key as keyof typeof prefs] !== false ? 'rgba(255,77,26,0.18)' : 'rgba(107,122,141,0.2)'}`, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: '0.2em', color: cat.locked ? 'var(--neon)' : (prefs[cat.key as keyof typeof prefs] !== false ? 'var(--cyan)' : 'var(--silver)'), textTransform: 'uppercase', marginBottom: 4 }}>
                        {cat.label} {cat.locked && '(Required)'}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: '0.05em', lineHeight: 1.5 }}>{cat.desc}</div>
                    </div>
                    {!cat.locked && (
                      <button
                        onClick={() => setPrefs(p => ({ ...p, [cat.key]: !p[cat.key as keyof typeof p] }))}
                        style={{
                          width: 40, height: 22, borderRadius: 11,
                          background: prefs[cat.key as keyof typeof prefs] ? 'var(--neon)' : 'var(--rail)',
                          border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                          transition: 'background 0.2s',
                        }}
                        aria-label={`Toggle ${cat.label}`}
                      >
                        <span style={{
                          position: 'absolute', top: 3, width: 16, height: 16, borderRadius: 8,
                          background: '#06080A', transition: 'left 0.2s',
                          left: prefs[cat.key as keyof typeof prefs] ? 20 : 3,
                        }} />
                      </button>
                    )}
                    {cat.locked && <span style={{ fontSize: 14, color: 'var(--neon)' }}>✓</span>}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button id="cookie-save-custom" onClick={saveCustom} style={primaryBtn}>Save Preferences →</button>
                <button id="cookie-accept-all-2" onClick={acceptAll} style={secondaryBtn}>Accept All</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes consentFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes consentSlideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
      `}</style>
    </>
  );
}

const primaryBtn: React.CSSProperties = {
  background: 'var(--neon)', color: '#06080A', border: 'none',
  padding: '12px 24px', fontSize: 10, fontWeight: 900, letterSpacing: '0.25em',
  textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-main)',
  whiteSpace: 'nowrap',
};
const secondaryBtn: React.CSSProperties = {
  background: 'transparent', color: 'var(--silver)',
  border: '1px solid rgba(107,122,141,0.35)',
  padding: '12px 20px', fontSize: 10, letterSpacing: '0.2em',
  textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-main)',
  whiteSpace: 'nowrap',
};
const ghostBtn: React.CSSProperties = {
  background: 'transparent', color: 'var(--cyan)',
  border: '1px solid rgba(0,212,255,0.2)',
  padding: '12px 20px', fontSize: 10, letterSpacing: '0.2em',
  textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-main)',
  whiteSpace: 'nowrap',
};
