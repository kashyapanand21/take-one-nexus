'use client';

import { useState, useEffect, useCallback } from 'react';

export default function EmailVerificationBanner() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in and unverified by reading the cookie via API
    const check = async () => {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.user && data.user.email_verified === false) {
          setEmail(data.user.email || '');
          setShow(true);
        }
      } catch {
        // Not logged in or API unavailable — don't show banner
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (sending || cooldown > 0 || !email) return;
    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.status === 429) {
        setError(data.message || 'Too many requests. Please wait.');
        setCooldown(data.retryAfter || 60);
      } else {
        setSent(true);
        setCooldown(60);
      }
    } catch {
      setError('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  }, [sending, cooldown, email]);

  if (!show) return null;

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 9000,
      background: 'linear-gradient(to right, rgba(255,77,26,0.1), rgba(255,122,26,0.08))',
      border: 'none',
      borderBottom: '1px solid rgba(255,77,26,0.3)',
      boxShadow: '0 2px 20px rgba(255,77,26,0.15)',
      fontFamily: 'var(--font-main)',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: 'var(--neon)', fontSize: 14, flexShrink: 0 }}>⚡</span>
        <div>
          <span style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--neon)', fontWeight: 700 }}>
            Email Not Verified
          </span>
          <span style={{ fontSize: 11, color: 'var(--silver)', marginLeft: 12, letterSpacing: '0.05em' }}>
            {sent
              ? 'Verification email sent — check your inbox.'
              : error
              ? error
              : 'Verify your email to access messaging, projects, and tasks.'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        {!sent && (
          <button
            id="resend-verification-btn"
            onClick={handleResend}
            disabled={sending || cooldown > 0}
            style={{
              background: 'var(--neon)',
              color: '#06080A',
              border: 'none',
              padding: '8px 18px',
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: sending || cooldown > 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-main)',
              opacity: sending || cooldown > 0 ? 0.6 : 1,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {sending ? '◌ Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
          </button>
        )}
        {sent && (
          <span style={{ fontSize: 10, color: 'var(--neon)', letterSpacing: '0.15em' }}>✓ Sent!</span>
        )}
        <button
          onClick={() => setShow(false)}
          style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 4px' }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
