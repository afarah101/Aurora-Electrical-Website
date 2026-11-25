import { createSign } from "node:crypto";

export type Lead = {
  name: string;
  phone: string;
  email?: string;
  jobType?: string;
  message: string;
  /** "How did you hear about us?" answer. Empty means the form only. */
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: string;
  landing_page?: string;
};

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

// Visitor text must never run as a formula (=, +, -, @). The leading ' keeps it text.
function safeCell(value?: string): string {
  const text = (value ?? "").slice(0, 5000);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

/** Service-account sign-in: a signed JWT is swapped for a 1-hour access token. */
async function accessToken(email: string, key: string, signal: AbortSignal): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const part = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned = `${part({ alg: "RS256", typ: "JWT" })}.${part({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key, "base64url");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`leads-sheet: token request failed (${res.status})`);
  return ((await res.json()) as { access_token: string }).access_token;
}

/**
 * Appends one row to the "Leads" tab. Column order is the 13 website columns
 * of the existing sheet. Throws on failure: the caller decides what to do.
 */
export async function appendLead(lead: Lead): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Vercel keeps the key's line breaks as the two characters \n.
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!sheetId || !email || !key) {
    console.warn("leads-sheet: GOOGLE_* env vars not set, lead not logged");
    return;
  }

  const row = [
    // sv-SE gives "YYYY-MM-DD HH:mm:ss", which Sheets reads as a date in any locale.
    new Date().toLocaleString("sv-SE", { timeZone: "Europe/London" }),
    ...[
      lead.source || "Website form",
      lead.name,
      lead.phone,
      lead.email,
      lead.jobType,
      lead.message,
      lead.utm_source,
      lead.utm_medium,
      lead.utm_campaign,
      lead.gclid,
      lead.landing_page,
    ].map(safeCell),
    "New",
  ];

  const signal = AbortSignal.timeout(5000);
  const token = await accessToken(email, key, signal);
  const range = encodeURIComponent("Leads!A:M");
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [row] }),
      signal,
    },
  );
  if (!res.ok) throw new Error(`leads-sheet: append failed (${res.status}) ${await res.text()}`);
}
