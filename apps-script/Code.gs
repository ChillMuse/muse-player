/**
 * Muse sign-up: saves the address to a Google Sheet and emails the hidden-feature steps.
 * Deploy as a web app from freefromemotionalloop@gmail.com (see README.md).
 */
const SENDER_NAME = 'Muse';
const SITE_URL = 'https://chillmuse.github.io/muse-player/';
const SUBJECT = 'The hidden feature in Muse';
const RESEND_AFTER_MS = 24 * 60 * 60 * 1000; // one secret email per address per day
const COLUMNS = ['Email', 'Name', 'Signed up', 'Newsletter consent', 'Last secret sent', 'Unsubscribed'];
const COL = { email: 1, name: 2, signedUp: 3, consent: 4, lastSent: 5, unsubscribed: 6 };

/** Run once from the editor: creates the sheet and the unsubscribe secret, and asks for permissions. */
function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SHEET_ID')) {
    const book = SpreadsheetApp.create('Muse subscribers');
    book.getSheets()[0].setName('Subscribers').appendRow(COLUMNS).setFrozenRows(1);
    props.setProperty('SHEET_ID', book.getId());
  }
  if (!props.getProperty('UNSUBSCRIBE_SECRET')) props.setProperty('UNSUBSCRIBE_SECRET', Utilities.getUuid());
  Logger.log('Sheet: https://docs.google.com/spreadsheets/d/' + props.getProperty('SHEET_ID'));
}

/** Send yourself a test email: set TEST_TO and run from the editor. */
function sendTest() {
  const TEST_TO = 'freefromemotionalloop@gmail.com';
  sendSecret(TEST_TO, 'Muse');
}

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: 'invalid_email' });
    const name = String(body.name || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    if (!name) return json({ ok: false, error: 'no_name' });
    if (body.consent !== true) return json({ ok: false, error: 'no_consent' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet();
      const now = new Date();
      let row = findRow(sheet, email);
      if (!row) {
        sheet.appendRow([email, cell(name), now, true, '', '']);
        row = sheet.getLastRow();
      } else {
        sheet.getRange(row, COL.name).setValue(cell(name));
        sheet.getRange(row, COL.consent).setValue(true); // signed up again: consent renewed
        sheet.getRange(row, COL.unsubscribed).setValue('');
      }
      const lastSent = sheet.getRange(row, COL.lastSent).getValue();
      // Same answer either way, so the form can't be used to probe who signed up.
      if (lastSent && now - new Date(lastSent) < RESEND_AFTER_MS) return json({ ok: true });
      if (MailApp.getRemainingDailyQuota() < 1) return json({ ok: false, error: 'quota' });
      sendSecret(email, name);
      sheet.getRange(row, COL.lastSent).setValue(now);
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'server' });
  }
}

/** Unsubscribe link from the email: ?unsubscribe=<email>&token=<hmac>. */
function doGet(e) {
  const email = String((e.parameter && e.parameter.unsubscribe) || '').toLowerCase();
  let done = false;
  if (email && e.parameter.token === token(email)) {
    const sheet = getSheet();
    const row = findRow(sheet, email);
    if (row) {
      sheet.getRange(row, COL.consent).setValue(false);
      sheet.getRange(row, COL.unsubscribed).setValue(new Date());
    }
    done = true;
  }
  const page = HtmlService.createTemplateFromFile('Unsubscribed');
  page.done = done;
  page.siteUrl = SITE_URL;
  return page.evaluate().setTitle('Muse');
}

function sendSecret(email, name) {
  const unsubscribeUrl = ScriptApp.getService().getUrl() + '?unsubscribe=' + encodeURIComponent(email) + '&token=' + token(email);
  const template = HtmlService.createTemplateFromFile('Email');
  template.name = name;
  template.siteUrl = SITE_URL;
  template.unsubscribeUrl = unsubscribeUrl;
  MailApp.sendEmail({
    to: email,
    name: SENDER_NAME,
    subject: SUBJECT,
    htmlBody: template.evaluate().getContent(),
    body: [
      'THE HIDDEN FEATURE',
      '',
      'Thanks for signing up, ' + name + '. Here is the feature we keep off the website: Muse can search for a song or an album, download it in the background and add it to your library. It stays hidden until you unlock it.',
      '',
      '1. Open Muse and choose Settings in the sidebar.',
      '2. Press the secret key.',
      '   macOS: Ctrl + Shift + Option + D',
      '   Windows: Ctrl + Shift + Alt + D',
      '3. In the Administrator password box, enter: download-enjoy',
      '',
      'Add appears in the sidebar. Search by song, album or artist, and follow the progress in Downloading.',
      '',
      'While you are in Settings, install Smart features too, so Muse can choose better next songs. In Settings > Smart features, click Install. It is a one-time download of about 3.6 GB, and everything runs on your computer. Smart features need a Mac with Apple silicon or Windows.',
      '',
      SITE_URL,
      '',
      'Unsubscribe: ' + unsubscribeUrl
    ].join('\n')
  });
}

function getSheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Run setup() first.');
  return SpreadsheetApp.openById(id).getSheetByName('Subscribers');
}

function findRow(sheet, email) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const emails = sheet.getRange(2, 1, last - 1, 1).getValues();
  const index = emails.findIndex(([value]) => String(value).toLowerCase() === email);
  return index < 0 ? 0 : index + 2;
}

function token(email) {
  const secret = PropertiesService.getScriptProperties().getProperty('UNSUBSCRIBE_SECRET');
  const bytes = Utilities.computeHmacSha256Signature(email, secret);
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '');
}

/** Stops a name like "=HYPERLINK(...)" from running as a formula in the sheet. */
function cell(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
