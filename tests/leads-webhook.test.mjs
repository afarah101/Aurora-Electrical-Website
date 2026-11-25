// Tests for lib/leads-sheet.ts and the sheet step of app/api/contact/route.ts. Run with: node --test tests/
// Node strips the TypeScript types. The hooks below resolve "@/" imports and swap in mocks for
// next/server and resend. Google is mocked by stubbing global fetch.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { generateKeyPairSync, createVerify } from "node:crypto";

const ROOT = new URL("../", import.meta.url);
const MOCKS = {
  "next/server": `
    export const NextResponse = { json: (body, init) => Response.json(body, init) };
    export const after = (fn) => globalThis.__after.push(fn);`,
  resend: `
    export class Resend { emails = { send: async (msg) => { globalThis.__sent.push(msg); return { error: null }; } }; }`,
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier in MOCKS) {
      return { url: `data:text/javascript,${encodeURIComponent(MOCKS[specifier])}`, shortCircuit: true };
    }
    if (specifier.startsWith("@/")) specifier = new URL(`${specifier.slice(2)}.ts`, ROOT).href;
    return nextResolve(specifier, context);
  },
});

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const PEM = privateKey.export({ type: "pkcs8", format: "pem" });

const COLUMNS = [
  "Date", "Source", "Name", "Phone", "Email", "Job type", "Details",
  "utm_source", "utm_medium", "utm_campaign", "gclid", "Landing page", "Status",
];

let calls;
let sheetFails;
const realFetch = globalThis.fetch;

beforeEach(() => {
  calls = [];
  sheetFails = false;
  globalThis.__after = [];
  globalThis.__sent = [];
  process.env.GOOGLE_SHEETS_ID = "test-sheet-id";
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "leads@test-project.iam.gserviceaccount.com";
  // Stored as Vercel stores it: line breaks as the two characters \n.
  process.env.GOOGLE_PRIVATE_KEY = PEM.replace(/\n/g, "\\n");
  process.env.RESEND_API_KEY = "test-resend-key";
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).startsWith("https://oauth2.googleapis.com/token")) {
      return Response.json({ access_token: "test-token" });
    }
    if (sheetFails) throw new Error("Sheets API down");
    return Response.json({ updates: { updatedRows: 1 } });
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const { appendLead } = await import("../lib/leads-sheet.ts");
const { POST } = await import("../app/api/contact/route.ts");

test("appendLead sends 13 columns in the sheet's order", async () => {
  await appendLead({
    name: "Jane Test",
    phone: "+44 7700 900123",
    email: "jane@example.com",
    jobType: "Fuse board",
    message: "=HYPERLINK(\"x\") sparks from the board",
    source: "MyBuilder",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "eicr",
    gclid: "abc123",
    landing_page: "/eicr-landlords",
  });

  assert.equal(calls.length, 2);
  const append = calls[1];
  assert.match(append.url, /^https:\/\/sheets\.googleapis\.com\/v4\/spreadsheets\/test-sheet-id\/values\/Leads!A%3AM:append\?valueInputOption=USER_ENTERED/);
  assert.equal(append.init.headers.Authorization, "Bearer test-token");

  const [row] = JSON.parse(append.init.body).values;
  assert.equal(row.length, COLUMNS.length);
  assert.match(row[0], /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  assert.deepEqual(row.slice(1), [
    "MyBuilder",
    "Jane Test",
    "'+44 7700 900123", // leading ' keeps it text, not a formula
    "jane@example.com",
    "Fuse board",
    "'=HYPERLINK(\"x\") sparks from the board",
    "google",
    "cpc",
    "eicr",
    "abc123",
    "/eicr-landlords",
    "New",
  ]);
});

test("appendLead signs the token request with the service-account key", async () => {
  await appendLead({ name: "Jane Test", phone: "07700900123", message: "A fault" });
  const assertion = new URLSearchParams(String(calls[0].init.body)).get("assertion");
  const [header, claims, signature] = assertion.split(".");
  const ok = createVerify("RSA-SHA256").update(`${header}.${claims}`).verify(publicKey, signature, "base64url");
  assert.ok(ok, "JWT signature verifies with the public key");
  const claim = JSON.parse(Buffer.from(claims, "base64url").toString());
  assert.equal(claim.iss, "leads@test-project.iam.gserviceaccount.com");
  assert.equal(claim.scope, "https://www.googleapis.com/auth/spreadsheets");
});

test("appendLead defaults Source to 'Website form' and blanks empty fields", async () => {
  await appendLead({ name: "Jane Test", phone: "07700900123", message: "A fault" });
  const [row] = JSON.parse(calls[1].init.body).values;
  assert.deepEqual(row.slice(1), ["Website form", "Jane Test", "07700900123", "", "", "A fault", "", "", "", "", "", "New"]);
});

function enquiry(extra = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}` },
    body: JSON.stringify({
      name: "Jane Test",
      phone: "07700 900123",
      address: "1 Test Street, London",
      fault: "Lights keep tripping the fuse box",
      email: "",
      jobType: "Lighting",
      heardAbout: "Google",
      ...extra,
    }),
  });
}

test("sheet write throws: route still returns 200 and the email still sends", async (t) => {
  sheetFails = true;
  const errors = t.mock.method(console, "error", () => {});

  const res = await POST(enquiry());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(globalThis.__sent.length, 1, "enquiry email sent");
  assert.match(globalThis.__sent[0].text, /Job type: Lighting/);
  assert.match(globalThis.__sent[0].text, /Heard about us: Google/);

  // The sheet step runs after the response and must not reject.
  assert.equal(globalThis.__after.length, 1);
  await globalThis.__after[0]();
  assert.ok(
    errors.mock.calls.some((c) => c.arguments[0] === "contact: lead sheet write failed"),
    "failure is logged",
  );
});

test("route writes the dropdown answers into Source and Job type", async () => {
  const res = await POST(enquiry());
  assert.equal(res.status, 200);
  await globalThis.__after[0]();
  const [row] = JSON.parse(calls[1].init.body).values;
  assert.equal(row[1], "Google");
  assert.equal(row[5], "Lighting");
});

test("a bad dropdown value never blocks the enquiry", async () => {
  const res = await POST(enquiry({ jobType: "<script>", heardAbout: "" }));
  assert.equal(res.status, 200);
  await globalThis.__after[0]();
  const [row] = JSON.parse(calls[1].init.body).values;
  assert.equal(row[1], "Website form");
  assert.equal(row[5], "");
});
