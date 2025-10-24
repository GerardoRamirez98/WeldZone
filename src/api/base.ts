export const API_URL: string =
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ||
  "http://localhost:3000";

function withAuth(init: RequestInit = {}): RequestInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = new Headers(init.headers as HeadersInit | undefined);
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  return { ...init, credentials: "include", headers };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("Content-Type");
  if (ct && ct.includes("application/json")) return res.json() as Promise<T>;
  return (await res.text()) as unknown as T;
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;

  const doFetch = () => fetch(url, withAuth(init));

  let res = await doFetch();
  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) res = await doFetch();
  }
  return handle<T>(res);
}

export const get = <T>(path: string) => http<T>(path);
export const post = <T>(path: string, body: unknown) =>
  http<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
export const put = <T>(path: string, body: unknown) =>
  http<T>(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
export const del = <T>(path: string) => http<T>(path, { method: "DELETE" });

let refreshPromise: Promise<string | null> | null = null;
async function tryRefreshToken(): Promise<boolean> {
  const start = () =>
    fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (r) => {
        if (!r.ok) return null;
        const data = (await r.json()) as { access_token?: string };
        const token = data?.access_token ?? null;
        if (token) localStorage.setItem("token", token);
        return token;
      })
      .catch(() => null);

  if (!refreshPromise) refreshPromise = start();
  const token = await refreshPromise.finally(() => (refreshPromise = null));
  return !!token;
}
