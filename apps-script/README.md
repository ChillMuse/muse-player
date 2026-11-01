# Muse sign-up (Google Apps Script)

The landing page's "There's more in Muse" form posts to this script. The script saves the address
in a Google Sheet and emails the hidden-feature steps from the Gmail account that deploys it.

## Set up (once, signed in as freefromemotionalloop@gmail.com)

1. Go to https://script.google.com and create a new project named **Muse sign-up**.
2. Replace `Code.gs` with `apps-script/Code.gs`. Add two HTML files (**File › New › HTML**) named
   `Email` and `Unsubscribed`, and paste in `Email.html` and `Unsubscribed.html`.
3. Choose `setup` in the function menu and click **Run**. Allow the permissions it asks for
   (Sheets and sending email). The log prints the link to the new **Muse subscribers** sheet.
4. **Deploy › New deployment › Web app**: *Execute as* **Me**, *Who has access* **Anyone**. Copy the
   web app URL (it ends in `/exec`).
5. Paste that URL into `SIGNUP_URL` in `src/signup.js`.
6. Optional: run `sendTest` to email yourself the message.

After you change the script, use **Deploy › Manage deployments › Edit › New version** so the URL
stays the same.

## Limits

- A free Gmail account can send about 100 emails a day from Apps Script. The form says to try
  again later when the quota runs out.
- Each address gets the email at most once a day.
- The sheet is the newsletter list: column **Newsletter consent** is `FALSE` after someone
  unsubscribes. Use only rows marked `TRUE` when you start the newsletter.
