import { API_URL } from "./client";

export interface UploadResponse {
  message: string;
  url: string; // URL pública en Supabase
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: form,
    credentials: "include",
    headers: (() => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      return token ? { Authorization: `Bearer ${token}` } : {};
    })(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Upload failed (${res.status})`);
  }
  return res.json() as Promise<UploadResponse>;
}
