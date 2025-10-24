export const API_URL: string = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";

function withAuth(init: RequestInit = {}): RequestInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    credentials: "include",
    headers: {
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...init,
  };
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
  const res = await fetch(`${API_URL}${path}`, withAuth(init));
  return handle<T>(res);
}

export const get = <T,>(path: string) => http<T>(path);
export const post = <T,>(path: string, body: unknown) =>
  http<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
export const put = <T,>(path: string, body: unknown) =>
  http<T>(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
export const del = <T,>(path: string) => http<T>(path, { method: "DELETE" });

