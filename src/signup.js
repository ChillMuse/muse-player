// Paste the Apps Script web app URL here after deploying apps-script/ (see apps-script/README.md).
export const SIGNUP_URL = 'https://script.google.com/macros/s/AKfycbw2tg9HtVAZ_5R-sMXDbmsn9XyWT1tQqQS0JVKOMQ6hxRuqYUtHYxgC658NPYQm-mXt/exec';

const form = document.getElementById('signup-form');
if (form) {
  const status = document.getElementById('signup-status');
  const button = form.querySelector('button[type="submit"]');
  const say = (text, error = false) => { status.textContent = text; status.classList.toggle('error', error); };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    if (!name) { say('Enter your name.', true); form.elements.name.focus(); return; }
    if (!form.elements.email.checkValidity()) { say('Enter a valid email address.', true); form.elements.email.focus(); return; }
    if (!data.get('consent')) { say('Tick the box to sign up for the newsletter.', true); return; }
    if (data.get('website')) return; // bots fill the hidden field
    if (!SIGNUP_URL) { say('Sign-up isn’t connected yet. Try again soon.', true); return; }

    button.disabled = true;
    say('Sending…');
    try {
      // text/plain keeps this a simple request, so Apps Script needs no CORS preflight.
      const response = await fetch(SIGNUP_URL, { method: 'POST', body: JSON.stringify({ name, email, consent: true }) });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || 'failed');
      form.reset();
      say(`Thanks, ${name}. Check ${email} for the secret.`);
    } catch {
      say('That didn’t go through. Try again in a minute.', true);
    } finally {
      button.disabled = false;
    }
  });
}
