// Session helpers for the dashboard. Originally cookie-based; switched to
// a bearer token stored in sessionStorage after discovering that
// hunafazaky.github.io and the Render API being different sites made the
// session cookie a cross-site cookie, which browsers (Safari by default,
// Chrome/Firefox increasingly) block or drop even with the right
// SameSite/Secure settings. A token attached explicitly via the
// Authorization header isn't subject to that.
//
// Trade-off worth knowing: sessionStorage is readable by any JS running on
// the page, so an XSS bug could steal the token — unlike an httpOnly
// cookie, which JS can't read at all. Accepted here because this is a
// single-admin dashboard, not a multi-user auth system; revisit if that
// ever changes (e.g. a proper same-site custom domain would let cookies
// work reliably again).

import { api, API_URL, ApiError } from "./api";

export type Session = { login: string };

const TOKEN_KEY = "portfolio_admin_token";

export function getToken(): string | null {
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.sessionStorage.removeItem(TOKEN_KEY);
}

/** Resolves with the session if valid, or null if not logged in. Never throws. */
export async function getSession(): Promise<Session | null> {
  if (!getToken()) return null;

  try {
    return await api.get<Session>("/api/auth/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      clearToken(); // stale/invalid token — drop it so we don't keep sending it
      return null;
    }
    throw err;
  }
}

/** Full-page redirect into the GitHub OAuth flow. */
export function loginWithGitHub() {
  window.location.href = `${API_URL}/api/auth/github/login`;
}

export async function logout() {
  clearToken();
  // Sessions are stateless JWTs — this call has nothing to actually
  // revoke server-side yet, but keeping it in case that changes later.
  await api.post("/api/auth/logout").catch(() => {});
}
