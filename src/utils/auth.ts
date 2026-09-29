/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// UX-flow-only auth: ONE shared username/password for the whole testing
// circle (no backend, no real accounts). This only gates the UI flow so the
// site hierarchy (Landing -> Login -> App) can be tested with friends before
// a real auth/subscription backend is built (see roadmap: "Data layer nyata").
//
// IMPORTANT: this is NOT secure. The credential lives in client-side code
// and anyone can read it from the browser. Fine for a closed friends test,
// not for a public launch.

export const DEFAULT_CREDENTIAL = {
  username: 'mora',
  password: 'mora2026',
};

const AUTH_KEY = 'morakids_auth_v1';
const PREMIUM_KEY = 'morakids_premium_v1';

// The shared mora/mora2026 test credential is designated as the premium
// tier account, so it bypasses the freemium FREE_TRIAL_LIMIT paywall
// entirely. The freemium/paywall code path itself stays intact — it's
// simply skipped for this account — so it's ready to apply to real,
// individually-tiered accounts once a real auth/subscription backend
// exists (see roadmap: "Data layer nyata").

export function isLoggedIn(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function isPremiumAccount(): boolean {
  try {
    return localStorage.getItem(PREMIUM_KEY) === 'true';
  } catch {
    return false;
  }
}

export function tryLogin(username: string, password: string): boolean {
  const ok =
    username.trim().toLowerCase() === DEFAULT_CREDENTIAL.username &&
    password === DEFAULT_CREDENTIAL.password;
  if (ok) {
    try {
      localStorage.setItem(AUTH_KEY, 'true');
      // DEFAULT_CREDENTIAL is the one and only account right now, and it's
      // premium — every successful login is a premium login.
      localStorage.setItem(PREMIUM_KEY, 'true');
    } catch {
      // ignore — session just won't persist across reloads
    }
  }
  return ok;
}

export function logout() {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(PREMIUM_KEY);
  } catch {
    // ignore
  }
}
