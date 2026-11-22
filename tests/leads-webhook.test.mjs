// Tests for integrations/leads-webhook.gs. Run with: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const SOURCE = readFileSync(new URL("../integrations/leads-webhook.gs", import.meta.url), "utf8");

/** Loads the .gs into a fresh context with fake Apps Script services. */
function load({ rows = [], props = {} } = {}) {
  const sent = [];
  const sheet = {
    rows,
    getLastRow: () => rows.length + 1,
    getRange(row, col, numRows, numCols) {
      return {
        getValues: () => rows.slice(row - 2, row - 2 + numRows).map((r) => r.slice(col - 1, col - 1 + numCols)),
        setValue: (value) => {
          rows[row - 2][col - 1] = value;
        },
      };
    },
  };
  const context = vm.createContext({
    console,
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key) => props[key] ?? null }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: (name) => (name === "Leads" ? sheet : null) }) },
    MailApp: { sendEmail: (to, subject, body) => sent.push({ to, subject, body }) },
    Utilities: {
      formatDate: (date) =>
        [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-"),
    },
  });
  vm.runInContext(SOURCE, context, { filename: "leads-webhook.gs" });
  return { gs: context, sent, rows };
}

/** One 16-column Leads row. */
function row({ name = "Jane Smith", phone = "07123 456789", status = "New", quotedOn = "", followUp = "", reviewAsked = "" } = {}) {
  return ["2026-11-01 09:00:00", "Website form", name, phone, "", "", "Socket sparks", "", "", "", "", "/", status, quotedOn, followUp, reviewAsked];
}

const TODAY = new Date(2026, 10, 22); // 22 Nov 2026

test("follow-up selects Quoted rows 3 or more days old only", () => {
  const { gs } = load();
  const rows = [
    row({ name: "Three Days", status: "Quoted", quotedOn: "2026-11-19" }),
    row({ name: "Two Days", status: "Quoted", quotedOn: "2026-11-20" }),
    row({ name: "Ten Days", status: "Quoted", quotedOn: new Date(2026, 10, 12) }),
    row({ name: "Already Chased", status: "Quoted", quotedOn: "2026-11-01", followUp: "2026-11-05" }),
    row({ name: "No Date", status: "Quoted" }),
    row({ name: "Still New", status: "New", quotedOn: "2026-11-01" }),
  ];
  // Array.from: the vm context has its own Array, which deepEqual treats as a different type.
  const picked = Array.from(gs.selectFollowUps(rows, TODAY), (lead) => lead.name);
  assert.deepEqual(picked, ["Three Days", "Ten Days"]);
  assert.equal(gs.selectFollowUps(rows, TODAY)[0].row, 2, "sheet row number is index + 2");
});

test("each line has the name, phone and a wa.me link with a message", () => {
  const { gs } = load();
  const plan = gs.planDailyCheck([row({ status: "Quoted", quotedOn: "2026-11-19" })], TODAY, "");
  assert.match(plan.body, /- Jane Smith, 07123 456789\n {2}https:\/\/wa\.me\/447123456789\?text=Hi%20Jane%2C/);
});

test("no repeat listing: a stamped row is not listed the next day", () => {
  const rows = [
    row({ name: "Quoted Lead", status: "Quoted", quotedOn: "2026-11-18" }),
    row({ name: "Won Lead", phone: "+44 7700 900123", status: "Won" }),
  ];
  const { gs, sent } = load({ rows, props: { NOTIFY_EMAIL: "owner@example.com", REVIEW_URL: "https://example.com/review" } });

  gs.runDailyCheck_(TODAY);
  assert.equal(sent.length, 1);
  assert.match(sent[0].body, /Quoted Lead/);
  assert.match(sent[0].body, /Won Lead, \+44 7700 900123\n {2}https:\/\/wa\.me\/447700900123\?text=/);
  assert.match(sent[0].body, /https%3A%2F%2Fexample\.com%2Freview/);
  assert.equal(rows[0][14], "2026-11-22", "Follow-up sent stamped");
  assert.equal(rows[1][15], "2026-11-22", "Review asked stamped");

  gs.runDailyCheck_(new Date(2026, 10, 23));
  assert.equal(sent.length, 1, "nothing left to list, so no second email");
});

test("REVIEW_URL unset: review section left out, said in the email, Won rows not stamped", () => {
  const rows = [row({ name: "Won Lead", status: "Won" }), row({ name: "Quoted Lead", status: "Quoted", quotedOn: "2026-11-01" })];
  const { gs, sent } = load({ rows, props: { NOTIFY_EMAIL: "owner@example.com" } });

  gs.runDailyCheck_(TODAY);
  assert.equal(sent.length, 1);
  assert.doesNotMatch(sent[0].body, /Won Lead/);
  assert.match(sent[0].body, /REVIEW_URL is not set/);
  assert.match(sent[0].body, /Quoted Lead/);
  assert.equal(rows[0][15], "", "Won row not stamped");
  assert.equal(rows[1][14], "2026-11-22");
});

test("no NOTIFY_EMAIL or nothing to list: no email", () => {
  const quoted = [row({ status: "Quoted", quotedOn: "2026-11-01" })];
  const noTo = load({ rows: quoted });
  noTo.gs.runDailyCheck_(TODAY);
  assert.equal(noTo.sent.length, 0);

  const empty = load({ rows: [row({ status: "Lost" })], props: { NOTIFY_EMAIL: "owner@example.com" } });
  empty.gs.runDailyCheck_(TODAY);
  assert.equal(empty.sent.length, 0);
});
