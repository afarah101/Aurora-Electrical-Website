// Tests for lib/leads-sheet.ts, the sheet step of app/api/contact/route.ts and the
// app/api/cron/leads-retention route. Run with: node --test tests/
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
let columnA; // what the mocked Sheets API returns for Leads!A:A
const realFetch = globalThis.fetch;

beforeEach(() => {
  calls = [];
  sheetFails = false;
  columnA = [];
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
    const path = decodeURIComponent(new URL(url).pathname);
    if (path.endsWith("/test-sheet-id")) {
      return Response.json({ sheets: [{ properties: { sheetId: 0, title: "Other" } }, { properties: { sheetId: 42, title: "Leads" } }] });
    }
    if (path.endsWith("/values/Leads!A:A")) return Response.json({ values: columnA });
    return Response.json({ updates: { updatedRows: 1 } });
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const { appendLead } = await import("../lib/leads-sheet.ts");
const { POST } = await import("../app/api/contact/route.ts");
const { GET: retention } = await import("../app/api/cron/leads-retention/route.ts");

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
  assert.match(append.url, /^https:\/\/sheets\.googleapis\.com\/v4\/spreadsheets\/test-sheet-id\/values\/Leads!A%3AM:append\?valueInputOption=RAW/);
  assert.equal(append.init.headers.Authorization, "Bearer test-token");

  const [row] = JSON.parse(append.init.body).values;
  assert.equal(row.length, COLUMNS.length);
  assert.match(row[0], /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  assert.deepEqual(row.slice(1), [
    "MyBuilder",
    "Jane Test",
    "+44 7700 900123", // RAW stores it as text, not a formula
    "jane@example.com",
    "Fuse board",
    "=HYPERLINK(\"x\") sparks from the board",
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

// Sheets day number for "n days ago" (day 25569 is 1970-01-01).
const daysAgo = (n) => Date.now() / 86_400_000 + 25569 - n;
const cron = (auth) =>
  new Request("http://localhost/api/cron/leads-retention", auth ? { headers: { authorization: auth } } : {});

test("retention: no secret or a wrong secret gets 401 and touches nothing", async () => {
  process.env.CRON_SECRET = "test-secret";
  for (const auth of [undefined, "Bearer wrong", "test-secret", "Bearer undefined"]) {
    const res = await retention(cron(auth));
    assert.equal(res.status, 401, `auth=${auth}`);
  }
  delete process.env.CRON_SECRET;
  assert.equal((await retention(cron("Bearer undefined"))).status, 401, "unset CRON_SECRET never matches");
  assert.equal(calls.length, 0, "no Google call");
});

test("retention: deletes rows older than 365 days, keeps new and undated rows", async () => {
  process.env.CRON_SECRET = "test-secret";
  columnA = [
    ["Date"], // 0 header: kept
    [daysAgo(400)], // 1 old date cell: deleted
    [daysAgo(10)], // 2 new: kept
    ["2024-01-05 10:00:00"], // 3 old date text: deleted
    [], // 4 blank Date: kept
    ["not a date"], // 5 kept
    [daysAgo(366)], // 6 deleted
    [daysAgo(364)], // 7 kept
  ];

  const res = await retention(cron("Bearer test-secret"));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, deleted: 3 });

  const read = calls.find((c) => c.url.includes("/values/"));
  assert.match(read.url, /valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=SERIAL_NUMBER/);
  const batch = calls.find((c) => c.url.endsWith(":batchUpdate"));
  const ranges = JSON.parse(batch.init.body).requests.map((r) => r.deleteDimension.range);
  // Bottom row first, on the Leads tab (id 42), one row each.
  assert.deepEqual(ranges, [6, 3, 1].map((i) => ({ sheetId: 42, dimension: "ROWS", startIndex: i, endIndex: i + 1 })));
});

test("retention: nothing old means no delete call", async () => {
  process.env.CRON_SECRET = "test-secret";
  columnA = [["Date"], [daysAgo(1)]];
  const res = await retention(cron("Bearer test-secret"));
  assert.deepEqual(await res.json(), { ok: true, deleted: 0 });
  assert.ok(!calls.some((c) => c.url.endsWith(":batchUpdate")));
});

test("retention: a Sheets failure returns 500 and is logged", async (t) => {
  process.env.CRON_SECRET = "test-secret";
  sheetFails = true;
  const errors = t.mock.method(console, "error", () => {});
  const res = await retention(cron("Bearer test-secret"));
  assert.equal(res.status, 500);
  assert.equal(errors.mock.calls[0].arguments[0], "leads-retention: failed");
});
