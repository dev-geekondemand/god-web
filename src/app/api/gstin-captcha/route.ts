import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { purge, store } from "@/lib/gstSessions";

const GST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
};

/** Extract name=value pairs from all Set-Cookie headers in a response. */
function extractCookies(res: Response): Map<string, string> {
  const hdr = res.headers as unknown as { getSetCookie?(): string[] };
  const raw = hdr.getSetCookie?.() ?? [res.headers.get("set-cookie") ?? ""];
  const map = new Map<string, string>();
  for (const c of raw) {
    const pair = c.split(";")[0].trim();
    if (!pair) continue;
    const eq = pair.indexOf("=");
    const name = eq === -1 ? pair : pair.slice(0, eq);
    map.set(name, pair);
  }
  return map;
}

/** Merge two cookie maps into a Cookie header string, later map wins on conflict. */
function mergeCookies(base: Map<string, string>, extra: Map<string, string>): string {
  return Array.from(new Map([...base, ...extra]).values()).join("; ");
}

export async function GET() {
  purge();

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 10_000);

  try {
    // Step 1 — load the search page to get the initial session cookies (JSESSIONID etc.)
    const initRes = await fetch("https://services.gst.gov.in/services/searchtp", {
      signal: ac.signal,
      headers: GST_HEADERS,
    });
    const cookies1 = extractCookies(initRes);

    // Step 2 — fetch the captcha image; the portal sets additional captcha-session cookies here
    const captchaRes = await fetch("https://services.gst.gov.in/services/captcha", {
      signal: ac.signal,
      headers: {
        ...GST_HEADERS,
        Accept: "image/webp,image/png,image/*,*/*",
        Cookie: mergeCookies(new Map(), cookies1),
        Referer: "https://services.gst.gov.in/services/searchtp",
      },
    });
    clearTimeout(timer);

    if (!captchaRes.ok) {
      return NextResponse.json(
        { error: "GST portal did not return a captcha" },
        { status: 502 }
      );
    }

    // Merge cookies from both responses — the POST needs all of them
    const cookies2 = extractCookies(captchaRes);
    const allCookies = mergeCookies(cookies1, cookies2);

    const buf = await captchaRes.arrayBuffer();
    const sessionId = randomUUID();
    store(sessionId, allCookies);          // <-- was only storing cookies1 before

    return NextResponse.json({
      sessionId,
      image: `data:image/png;base64,${Buffer.from(buf).toString("base64")}`,
    });
  } catch {
    clearTimeout(timer);
    return NextResponse.json({ error: "GST portal is unreachable" }, { status: 502 });
  }
}
