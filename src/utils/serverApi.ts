// utils/serverApi.ts
// Fetch helper for Server Components / route handlers / sitemap.ts,
// where Next.js `fetch` cache directives (next.revalidate) apply and
// there is no Redux store to dispatch thunks against.

// const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://god-backend.vercel.app"}/api`;
const API_BASE_URL = `http://localhost:4002/api`;
const FETCH_TIMEOUT_MS = 15000;
const REVALIDATE_SECONDS = 3600;

async function getServerApiKey(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/apikey/generate`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.apiKey ?? null;
  } catch {
    return null;
  }
}

export async function fetchServerApi<T>(path: string): Promise<T | null> {
  try {
    const apiKey = await getServerApiKey();
    const headers: HeadersInit = apiKey ? { "x-api-key": apiKey } : {};
    const res = await fetch(`${API_BASE_URL}/${path}`, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
