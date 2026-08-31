// Session helpers for the dashboard. There's no client-side token to
// manage — the session lives entirely in the httpOnly cookie the API set
// after GitHub OAuth — so this just wraps the two auth endpoints.

import { api, API_URL, ApiError } from "./api";

export type Session = { login: string };

/** Resolves with the session if valid, or null if not logged in. Never throws. */
export async function getSession(): Promise<Session | null> {
  try {
    return await api.get<Session>("/api/auth/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

/** Full-page redirect into the GitHub OAuth flow. */
export function loginWithGitHub() {
  window.location.href = `${API_URL}/api/auth/github/login`;
}

export async function logout() {
  await api.post("/api/auth/logout");
}
