const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const detail = text.trim() || res.statusText || 'Request failed';
    throw new Error(`${res.status} ${detail}`);
  }
  return res.json() as Promise<T>;
}
