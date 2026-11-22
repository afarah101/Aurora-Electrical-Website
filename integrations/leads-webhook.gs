/**
 * Leads webhook for the client register Google Sheet. Not deployed by the site.
 *
 * Setup (in the Sheet: Extensions > Apps Script):
 * 1. Paste this file. Project Settings > Script properties: add LEADS_WEBHOOK_TOKEN.
 * 2. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 * 3. Put the web app URL in LEADS_WEBHOOK_URL and the same token in
 *    LEADS_WEBHOOK_TOKEN (Vercel env vars).
 *
 * Body: { "token": "...", "row": [13 cells] }. Column order is set in lib/lead-log.ts.
 *
 * Follow-ups (see docs/GO-LIVE.md): run setup() once, then installDailyTrigger() once.
 * Script properties: NOTIFY_EMAIL (who gets the daily list), REVIEW_URL (optional).
 */
var COLUMNS = 13;

// Columns 1-13 come from the website (lib/lead-log.ts). 14-16 are filled by hand or by dailyCheck().
var HEADERS = [
  'Date', 'Source', 'Name', 'Phone', 'Email', 'Job type', 'Details',
  'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'Landing page', 'Status',
  'Quoted on', 'Follow-up sent', 'Review asked'
];
var COL = { source: 2, name: 3, phone: 4, status: 13, quotedOn: 14, followUp: 15, reviewAsked: 16 };
var STATUSES = ['New', 'Quoted', 'Won', 'Lost'];
var SOURCES = ['Website form', 'Phone', 'WhatsApp', 'Email', 'MyBuilder'];
var FOLLOW_UP_DAYS = 3;
var TIME_ZONE = 'Europe/London';
var BUSINESS_NAME = 'Aurora Electrical';

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply_({ ok: false, error: 'bad json' });
  }
  if (!data || typeof data !== 'object') return reply_({ ok: false, error: 'bad json' });

  var expected = PropertiesService.getScriptProperties().getProperty('LEADS_WEBHOOK_TOKEN');
  if (!expected || data.token !== expected) return reply_({ ok: false, error: 'unauthorized' });
  if (!Array.isArray(data.row)) return reply_({ ok: false, error: 'no row' });

  var row = [];
  for (var i = 0; i < COLUMNS; i++) row.push(safeCell_(data.row[i]));

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
  if (!sheet) return reply_({ ok: false, error: 'no Leads tab' });
  sheet.appendRow(row);
  return reply_({ ok: true });
}

// Visitor text must never run as a formula (=, +, -, @). The leading ' keeps it text.
function safeCell_(value) {
  var text = value == null ? '' : String(value).slice(0, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- One-time setup (run by hand from the Apps Script editor) ---------- */

/** Creates or extends the "Leads" and "Summary" tabs. Safe to run again: it never deletes lead rows. */
function setup() {
  var book = SpreadsheetApp.getActiveSpreadsheet();

  var leads = book.getSheetByName('Leads') || book.insertSheet('Leads');
  // Fill only blank header cells, so existing headings are kept.
  var header = leads.getRange(1, 1, 1, HEADERS.length);
  var current = header.getValues()[0];
  header.setValues([HEADERS.map(function (name, i) { return current[i] === '' ? name : current[i]; })]);
  header.setFontWeight('bold');
  leads.setFrozenRows(1);

  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUSES, true)
    .setAllowInvalid(false)
    .build();
  if (leads.getMaxRows() < 2) leads.insertRowsAfter(1, 999);
  leads.getRange(2, COL.status, leads.getMaxRows() - 1, 1).setDataValidation(statusRule);
  leads.getRange(2, COL.quotedOn, leads.getMaxRows() - 1, 3).setNumberFormat('yyyy-mm-dd');

  var summary = book.getSheetByName('Summary') || book.insertSheet('Summary');
  summary.clear();
  var rows = [['Source', 'Leads', 'Won', 'Close rate']];
  SOURCES.forEach(function (source, i) {
    var r = i + 2;
    rows.push([
      source,
      '=COUNTIF(Leads!B2:B, A' + r + ')',
      '=COUNTIFS(Leads!B2:B, A' + r + ', Leads!M2:M, "Won")',
      '=IF(B' + r + '=0, 0, C' + r + '/B' + r + ')'
    ]);
  });
  var total = SOURCES.length + 2;
  rows.push([
    'Total',
    '=SUM(B2:B' + (total - 1) + ')',
    '=SUM(C2:C' + (total - 1) + ')',
    '=IF(B' + total + '=0, 0, C' + total + '/B' + total + ')'
  ]);
  summary.getRange(1, 1, rows.length, 4).setValues(rows);
  summary.getRange(1, 1, 1, 4).setFontWeight('bold');
  summary.getRange(2, 4, rows.length - 1, 1).setNumberFormat('0%');
  summary.setFrozenRows(1);
}

/** Runs dailyCheck() every day at about 08:00 London time. Replaces any earlier copy. */
function installDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'dailyCheck') ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('dailyCheck')
    .timeBased()
    .atHour(8)
    .nearMinute(0)
    .everyDays(1)
    .inTimezone(TIME_ZONE)
    .create();
}

/* ---------- Daily follow-up email ---------- */

/** Trigger entry point. The trigger passes an event object, so the date is taken here. */
function dailyCheck() {
  runDailyCheck_(new Date());
}

function runDailyCheck_(today) {
  var props = PropertiesService.getScriptProperties();
  var to = props.getProperty('NOTIFY_EMAIL');
  if (!to) {
    console.warn('dailyCheck: NOTIFY_EMAIL is not set');
    return;
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
  if (!sheet || sheet.getLastRow() < 2) return;

  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  var plan = planDailyCheck(rows, today, props.getProperty('REVIEW_URL') || '');
  if (!plan) return;

  MailApp.sendEmail(to, plan.subject, plan.body);

  // Stamp only after the email has gone, so each row is listed once.
  var stamp = Utilities.formatDate(today, TIME_ZONE, 'yyyy-MM-dd');
  plan.followUps.forEach(function (lead) { sheet.getRange(lead.row, COL.followUp).setValue(stamp); });
  plan.reviews.forEach(function (lead) { sheet.getRange(lead.row, COL.reviewAsked).setValue(stamp); });
}

/* ---------- Pure functions (tested in tests/leads-webhook.test.mjs) ---------- */

function isBlank_(value) {
  return value === null || value === undefined || String(value).trim() === '';
}

/** A Sheets date cell, a Date, or "YYYY-MM-DD" text. Anything else is null. */
function parseDate_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return isNaN(value.getTime()) ? null : value;
  }
  var match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value == null ? '' : value).trim());
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}

/** Whole calendar days from a to b. Rounding absorbs the 23 or 25 hour days at clock changes. */
function daysBetween_(a, b) {
  var start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  var end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function lead_(row, index) {
  return { row: index + 2, name: String(row[COL.name - 1]).trim(), phone: String(row[COL.phone - 1]).trim() };
}

/** Quoted rows whose "Quoted on" date is 3 or more days before today and "Follow-up sent" is empty. */
function selectFollowUps(rows, today) {
  var picked = [];
  rows.forEach(function (row, i) {
    if (String(row[COL.status - 1]).trim() !== 'Quoted') return;
    if (!isBlank_(row[COL.followUp - 1])) return;
    var quoted = parseDate_(row[COL.quotedOn - 1]);
    if (!quoted || daysBetween_(quoted, today) < FOLLOW_UP_DAYS) return;
    picked.push(lead_(row, i));
  });
  return picked;
}

/** Won rows where "Review asked" is empty. */
function selectReviewAsks(rows) {
  var picked = [];
  rows.forEach(function (row, i) {
    if (String(row[COL.status - 1]).trim() !== 'Won') return;
    if (!isBlank_(row[COL.reviewAsked - 1])) return;
    picked.push(lead_(row, i));
  });
  return picked;
}

/** wa.me wants international digits only. UK numbers that start with 0 get 44. */
function waNumber_(phone) {
  var digits = String(phone).replace(/\D/g, '');
  if (digits.indexOf('00') === 0) digits = digits.slice(2);
  else if (digits.indexOf('0') === 0) digits = '44' + digits.slice(1);
  return digits;
}

function waLink(phone, message) {
  var number = waNumber_(phone);
  return number ? 'https://wa.me/' + number + '?text=' + encodeURIComponent(message) : '';
}

function firstName_(name) {
  return name.split(/\s+/)[0] || 'there';
}

function followUpMessage(name) {
  return 'Hi ' + firstName_(name) + ', it is ' + BUSINESS_NAME + '. We wanted to check you received our quote. ' +
    'We are happy to answer any questions. Thank you.';
}

function reviewMessage(name, reviewUrl) {
  return 'Hi ' + firstName_(name) + ', thank you for choosing ' + BUSINESS_NAME + '. ' +
    'If you were happy with the work, a short review would help us a lot: ' + reviewUrl + ' Thank you.';
}

function line_(lead, message) {
  var link = waLink(lead.phone, message);
  return '- ' + (lead.name || '(no name)') + ', ' + (lead.phone || '(no phone)') + (link ? '\n  ' + link : '');
}

/**
 * The daily email, or null when there is nothing to list.
 * With no REVIEW_URL, Won rows are not listed or stamped, and the email says so.
 */
function planDailyCheck(rows, today, reviewUrl) {
  var followUps = selectFollowUps(rows, today);
  var pendingReviews = selectReviewAsks(rows);
  var reviews = reviewUrl ? pendingReviews : [];
  if (!followUps.length && !pendingReviews.length) return null;

  var body = ['Leads to chase today.', '', '1. Quotes sent ' + FOLLOW_UP_DAYS + ' or more days ago, no follow-up yet:'];
  if (followUps.length) {
    followUps.forEach(function (lead) { body.push(line_(lead, followUpMessage(lead.name))); });
  } else {
    body.push('- None today.');
  }
  body.push('');
  if (reviewUrl) {
    body.push('2. Won jobs, no review asked yet:');
    if (reviews.length) {
      reviews.forEach(function (lead) { body.push(line_(lead, reviewMessage(lead.name, reviewUrl))); });
    } else {
      body.push('- None today.');
    }
  } else {
    body.push('2. Review requests are left out: REVIEW_URL is not set in Script Properties.');
  }
  body.push('', 'Each row listed here is now date-stamped in the Leads tab, so it will not be listed again.');

  var count = followUps.length + reviews.length;
  return {
    subject: count
      ? BUSINESS_NAME + ' - ' + count + ' lead' + (count === 1 ? '' : 's') + ' to chase'
      : BUSINESS_NAME + ' - review link not set',
    body: body.join('\n'),
    followUps: followUps,
    reviews: reviews
  };
}
