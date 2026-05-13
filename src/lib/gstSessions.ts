// Module-level singleton — survives between requests in a long-running Next.js process.
// Uses globalThis so hot-reloads in dev don't reset the map.

const SESSION_TTL_MS = 5 * 60 * 1000; // 5 min — GST captcha sessions expire quickly

interface GSTSession {
  cookies: string;
  ts: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __gstSessions: Map<string, GSTSession> | undefined;
}

const sessions: Map<string, GSTSession> =
  globalThis.__gstSessions ?? (globalThis.__gstSessions = new Map());

export function purge(): void {
  const cutoff = Date.now() - SESSION_TTL_MS;
  for (const [id, s] of sessions) {
    if (s.ts < cutoff) sessions.delete(id);
  }
}

export function store(id: string, cookies: string): void {
  sessions.set(id, { cookies, ts: Date.now() });
}

/** Returns cookies and removes the session (one-time use). Returns null if missing/expired. */
export function pop(id: string): string | null {
  const entry = sessions.get(id);
  sessions.delete(id);
  if (!entry) return null;
  if (Date.now() - entry.ts > SESSION_TTL_MS) return null;
  return entry.cookies;
}
