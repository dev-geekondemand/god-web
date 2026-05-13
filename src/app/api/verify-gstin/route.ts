import { NextRequest, NextResponse } from "next/server";
import { pop } from "@/lib/gstSessions";

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function isChecksumValid(gstin: string): boolean {
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const v = CHARS.indexOf(gstin[i]);
    if (v === -1) return false;
    const p = v * (i % 2 === 0 ? 1 : 2);
    sum += Math.floor(p / 36) + (p % 36);
  }
  return CHARS[(36 - (sum % 36)) % 36] === gstin[14];
}

const GST_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://services.gst.gov.in/services/searchtp",
  Origin: "https://services.gst.gov.in",
};

// GET — format + checksum validation only (no network call, always works)
export async function GET(request: NextRequest) {
  const gstin = request.nextUrl.searchParams.get("gstin")?.toUpperCase() ?? "";

  if (!GSTIN_REGEX.test(gstin)) {
    return NextResponse.json({ error: "Invalid GSTIN format" }, { status: 400 });
  }
  if (!isChecksumValid(gstin)) {
    return NextResponse.json(
      { error: "Invalid GSTIN — checksum verification failed. Please double-check the number." },
      { status: 400 }
    );
  }

  return NextResponse.json({ checksumValid: true, gstin });
}

// POST — full GST portal verification using captcha session
export async function POST(request: NextRequest) {
  let body: Record<string, string> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const gstin = (body.gstin ?? "").toUpperCase().trim();
  const sessionId = (body.sessionId ?? "").trim();
  const captcha = (body.captcha ?? "").trim();

  if (!gstin || !sessionId || !captcha) {
    return NextResponse.json(
      { error: "gstin, sessionId and captcha are required" },
      { status: 400 }
    );
  }
  if (!GSTIN_REGEX.test(gstin)) {
    return NextResponse.json({ error: "Invalid GSTIN format" }, { status: 400 });
  }
  if (!isChecksumValid(gstin)) {
    return NextResponse.json(
      { error: "Invalid GSTIN — checksum verification failed" },
      { status: 400 }
    );
  }

  // Pop is atomic: removes the session so the captcha can't be reused
  const cookies = pop(sessionId);
  if (!cookies) {
    return NextResponse.json(
      { error: "Session expired or invalid — fetch a new captcha" },
      { status: 400 }
    );
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 10_000);

  try {
    const res = await fetch(
      "https://services.gst.gov.in/services/api/search/taxpayerDetails",
      {
        method: "POST",
        signal: ac.signal,
        headers: { ...GST_HEADERS, Cookie: cookies },
        body: JSON.stringify({ gstin, captcha }),
      }
    );
    clearTimeout(timer);

    const text = await res.text();
    let data: Record<string, string>;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "GST portal returned an unexpected response — try again" },
        { status: 502 }
      );
    }

    if (data.errorCode || data.error) {
      const msg = data.errorDesc || data.error || "GST portal returned an error";
      const isCaptchaError =
        /captcha/i.test(msg) ||
        data.errorCode === "SWEB_9035" ||
        data.errorCode === "CAPTCHA_INVALID";
      // Return 422 for wrong captcha so the frontend can handle retry separately
      return NextResponse.json(
        { error: msg, captchaError: isCaptchaError },
        { status: isCaptchaError ? 422 : 404 }
      );
    }

    if (!data.lgnm && !data.tradeNam) {
      return NextResponse.json(
        { error: "GST portal returned no company data — the GSTIN may be inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      legalName: data.lgnm ?? "",
      tradeName: data.tradeNam ?? "",
      status: data.sts ?? "",
      gstin: data.gstin ?? gstin,
    });
  } catch {
    clearTimeout(timer);
    return NextResponse.json({ error: "GST portal is unreachable" }, { status: 502 });
  }
}
