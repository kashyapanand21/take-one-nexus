/**
 * CSRF Protection middleware using csurf
 * 
 * sameSite: "None" + secure: true is required for cross-subdomain cookie sharing.
 * With sameSite: "Lax", the browser will NOT send the CSRF cookie when
 * navigating from admin.takeone-nexus.net.in → takeone-nexus.net.in or vice-versa.
 */

const csrf = require('csurf');

const isProd = process.env.NODE_ENV === 'production';

const rawCsrfProtection = csrf({
  cookie: {
    httpOnly: false,       // Must be readable by JS for double-submit pattern
    secure: isProd,        // HTTPS only in production
    sameSite: isProd ? 'None' : 'Lax', // None required for cross-subdomain; Lax safe for localhost
    domain: isProd ? '.takeone-nexus.net.in' : undefined
  }
});

const csrfProtection = (req, res, next) => {
  if (!isProd) {
    console.log(`[CSRF_DEBUG] Incoming Request: ${req.method} ${req.originalUrl}`);
    console.log(`[CSRF_DEBUG] CSRF Cookie Present: ${Boolean(req.cookies?.['_csrf'] || req.cookies?.['csrf'])}`);
    console.log(`[CSRF_DEBUG] CSRF Header (X-CSRF-Token) Present: ${Boolean(req.headers['x-csrf-token'])}`);
  }
  
  rawCsrfProtection(req, res, (err) => {
    if (err) {
      if (!isProd) {
        console.error(`[CSRF_DEBUG] ❌ CSRF Validation Failed for ${req.method} ${req.originalUrl}`);
        console.error(`[CSRF_DEBUG] Error details: ${err.message}`);
      }
      return next(err);
    }
    
    if (!isProd) {
      console.log(`[CSRF_DEBUG] ✅ CSRF Validation Passed for ${req.method} ${req.originalUrl}`);
    }
    next();
  });
};

module.exports = csrfProtection;
