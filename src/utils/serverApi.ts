// utils/serverApi.ts
// Fetch helper for Server Components / route handlers / sitemap.ts,
// where Next.js `fetch` cache directives (next.revalidate) apply and
// there is no Redux store to dispatch thunks against.

import { url } from "@/utils/url";

// Shares the same backend host as the client axios instance (utils/api.ts)
// so this can never drift onto a different backend than the client targets.
const API_BASE_URL = url.replace(/\/$/, "");
const FETCH_TIMEOUT_MS = 15000;
const REVALIDATE_SECONDS = 3600;
// The backend signs API keys with a 2-minute expiry, so the cached key must
// turn over well inside that window.
const API_KEY_REVALIDATE_SECONDS = 60;

// Next serves a stale cache entry first and refreshes it in the background,
// so a cached key can still arrive already expired. `fresh` puts a unique
// query on the URL to miss the cache, without opting the route out of static
// rendering the way `cache: "no-store"` would.
async function getServerApiKey(fresh = false): Promise<string | null> {
  try {
    const keyUrl = `${API_BASE_URL}/apikey/generate${fresh ? `?t=${Date.now()}` : ""}`;
    const res = await fetch(keyUrl, {
      next: { revalidate: API_KEY_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.apiKey ?? null;
  } catch {
    return null;
  }
}

async function requestWithKey(path: string, apiKey: string | null): Promise<Response> {
  const headers: HeadersInit = apiKey ? { "x-api-key": apiKey } : {};
  return fetch(`${API_BASE_URL}/${path}`, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

export async function fetchServerApi<T>(path: string): Promise<T | null> {
  try {
    let res = await requestWithKey(path, await getServerApiKey());
    // Expired/stale key: fetch a fresh one and retry once.
    if (res.status === 401 || res.status === 403) {
      res = await requestWithKey(path, await getServerApiKey(true));
    }
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
