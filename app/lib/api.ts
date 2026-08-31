// Thin typed fetch client for the live API — used directly by the
// dashboard (always live) and by lib/data.ts in dev mode. Never used by
// the public site in production builds; see lib/data.ts.
//
// Admin requests are authenticated via a bearer token (see lib/auth.ts)
// rather than a cookie — see the comment there for why.

const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  // Fails loudly at build/dev time rather than silently hitting a blank
  // URL at runtime.
  throw new Error("VITE_API_URL is not set — copy .env.example to .env");
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Envelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

function authHeader(): Record<string, string> {
  const token = window.sessionStorage.getItem("portfolio_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...authHeader(), ...init?.headers },
  });

  const body = (await res.json().catch(() => ({}))) as Envelope<T>;

  if (!res.ok) {
    throw new ApiError(res.status, body.error ?? `request failed (${res.status})`);
  }
  return body.data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  // multipart, so it skips the JSON Content-Type header above
  upload: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/api/admin/uploads`, {
      method: "POST",
      headers: authHeader(),
      body: form,
    });
    const body = (await res.json().catch(() => ({}))) as Envelope<{ url: string }>;
    if (!res.ok) throw new ApiError(res.status, body.error ?? "upload failed");
    return body.data as { url: string };
  },
};

export { API_URL };
