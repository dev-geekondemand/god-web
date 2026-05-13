import { NextRequest, NextResponse } from "next/server";

const CIN_REGEX = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}(PLC|PTC|NPL|OPC|GOI|FLC|FTC|FRN)[0-9]{6}$/;

const VALID_STATE_CODES = new Set([
  "AN","AP","AR","AS","BR","CH","CT","DD","DL","DN","GA","GJ","HP","HR",
  "JH","JK","KA","KL","LA","LD","MH","ML","MN","MP","MZ","NL","OR","PB",
  "PY","RJ","SK","TG","TN","TR","UP","UT","WB",
]);

// MCA does not expose a public JSON API — we validate the CIN structurally.
// The structure itself encodes state, year, and company type, making it
// a meaningful check beyond a regex match.
export async function GET(request: NextRequest) {
  const cin = request.nextUrl.searchParams.get("cin")?.toUpperCase() ?? "";

  if (!CIN_REGEX.test(cin)) {
    return NextResponse.json({ error: "Invalid CIN format" }, { status: 400 });
  }

  const stateCode = cin.slice(6, 8);
  if (!VALID_STATE_CODES.has(stateCode)) {
    return NextResponse.json(
      { error: `Invalid CIN — '${stateCode}' is not a recognised Indian state code` },
      { status: 400 }
    );
  }

  const year = parseInt(cin.slice(8, 12), 10);
  if (year < 1800 || year > new Date().getFullYear()) {
    return NextResponse.json(
      { error: `Invalid CIN — incorporation year ${year} is out of range` },
      { status: 400 }
    );
  }

  return NextResponse.json({
    cin,
    formatValid: true,
    stateCode,
    year,
    companyType: cin.slice(13, 16),
    message: "CIN is structurally valid (format, state code, and year verified).",
  });
}
