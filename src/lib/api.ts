export const API_BASE = import.meta?.env?.VITE_API_BASE?.replace(/\/+$/, "") || "";

export async function apiFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    // do not set mode: 'no-cors'
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  let data: unknown = null;
  try {
    // server returns JSON on both success and error
    data = await res.json();
  } catch {
    // ignore parse error; keep data = null
  }

  if (!res.ok) {
    const errorData = data as { error?: string; message?: string } | null;
    const reason = errorData?.error || errorData?.message || res.statusText || "Request failed";
    throw new Error(reason);
  }
  return data as T;
}
