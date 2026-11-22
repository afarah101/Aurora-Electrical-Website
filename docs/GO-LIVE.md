# Lead system go-live

Do these steps in order. Steps 1 to 6 are in Google. Steps 7 to 9 are in Vercel and Google Ads.

## A. Apps Script (the Leads sheet)

1. Open the client register Google Sheet. In the top menu, click **Extensions > Apps Script**.
2. In the editor, open `Code.gs`. Delete its text. Paste all of `integrations/leads-webhook.gs`. Click the **Save** icon (disk, top bar).
3. Click the **gear icon** (Project Settings, left bar).
   - Under **General settings**, set **Time zone** to `(GMT+00:00) London`.
   - Scroll to **Script properties**. Click **Add script property** for each one:
     - `LEADS_WEBHOOK_TOKEN`: a long random string. Keep a copy for step 7.
     - `NOTIFY_EMAIL`: the address that gets the daily list.
     - `REVIEW_URL`: the review link (for example the MyBuilder review page). Optional. If it is empty, the daily email leaves out review requests and says so.
   - Click **Save script properties**.
4. Click the **< >** icon (Editor, left bar). In the function list next to **Run** (top bar), select `setup`. Click **Run**. Allow the permissions Google asks for.
   - Result: tab **Leads** with 16 columns (the last 3 are Quoted on, Follow-up sent, Review asked), a Status dropdown (New, Quoted, Won, Lost), and tab **Summary** with leads, won and close rate per source.
5. In the same function list, select `installDailyTrigger`. Click **Run**.
   - Result: click the **clock icon** (Triggers, left bar). One trigger for `dailyCheck` shows, "Day timer, 8am to 9am", London time.
6. Click **Deploy > New deployment** (blue button, top right). Click the **gear** next to "Select type" and pick **Web app**.
   - **Execute as**: Me. **Who has access**: Anyone. Click **Deploy**.
   - Copy the **Web app URL** for step 7.
   - If you change the script later, use **Deploy > Manage deployments > Edit (pencil) > Version: New version**, so the URL stays the same.

Daily use in the sheet: when you send a quote, set Status to **Quoted** and type the date in **Quoted on** (`YYYY-MM-DD`). When a job is won, set Status to **Won**. The daily email stamps **Follow-up sent** and **Review asked**, so each person is listed once. Add phone, WhatsApp, email and MyBuilder leads by hand, with Source set to `Phone`, `WhatsApp`, `Email` or `MyBuilder`.

## B. Vercel

7. In the Vercel dashboard, open the project. Click **Settings** (top tabs) > **Environment Variables** (left menu). Add each key for **Production** and **Preview**:
   - `LEADS_WEBHOOK_URL`: the Web app URL from step 6.
   - `LEADS_WEBHOOK_TOKEN`: the same token as in step 3.
   - `NEXT_PUBLIC_GADS_ID`: the Google Ads tag ID, `AW-` followed by numbers (from step 9).
   - `NEXT_PUBLIC_GADS_LABEL_FORM`, `NEXT_PUBLIC_GADS_LABEL_CALL`, `NEXT_PUBLIC_GADS_LABEL_WHATSAPP`: the conversion labels from step 9.
   - Click **Save** after each one.
8. Redeploy so the new values are built in: **Deployments** (top tabs) > the latest deployment > **...** menu (right) > **Redeploy**. `NEXT_PUBLIC_` values are fixed at build time, so a redeploy is needed after each change.

Without `NEXT_PUBLIC_GADS_ID`, the site shows no cookie banner and loads no Google Ads code. Each conversion with no label does nothing.

## C. Google Ads conversion actions

9. In Google Ads, click **Goals** (left menu) > **Conversions** > **Summary** > **+ Create conversion action** (blue button). Choose **Website**, then **Add a conversion action manually**. Create these 3:

   | Name | Goal category | Vercel key for its label |
   | --- | --- | --- |
   | Website form | Submit lead form | `NEXT_PUBLIC_GADS_LABEL_FORM` |
   | Call click | Phone call lead | `NEXT_PUBLIC_GADS_LABEL_CALL` |
   | WhatsApp click | Contact | `NEXT_PUBLIC_GADS_LABEL_WHATSAPP` |

   - Value: **Don't use a value**. Count: **One**. Click **Done**, then **Save and continue**.
   - On the tag setup screen, pick **Use Google Tag Manager**. It shows the **Conversion ID** (numbers) and the **Conversion label**.
   - `NEXT_PUBLIC_GADS_ID` is `AW-` plus the Conversion ID. It is the same for all 3. Each label is different.
   - Do not paste Google's tag code into the site. The site loads the tag itself, and only after a visitor clicks **Accept**.

## D. Check

10. Open the live site in a private window. The cookie banner shows at the bottom. Click **Accept**, then send a test enquiry.
    - A new row shows in **Leads** with Source `Website form`.
    - In Google Ads, the conversion status changes from "Unverified" within about 24 hours.
