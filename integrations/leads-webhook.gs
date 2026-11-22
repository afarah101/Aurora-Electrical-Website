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
 */
var COLUMNS = 13;

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
