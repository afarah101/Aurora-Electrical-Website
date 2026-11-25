# Lead system go-live

Do these steps in order. Steps 1 to 5 are in Google. Steps 6 to 8 are in Vercel and Google Ads. Each click for steps 1 to 5 is in `docs/LEAD-SHEET-SETUP.md`.

## A. Leads sheet (Google service account)

1. Open the client register Google Sheet. Make sure it has a tab named **Leads** with these 13 headers in row 1, in this order: Date, Source, Name, Phone, Email, Job type, Details, utm_source, utm_medium, utm_campaign, gclid, Landing page, Status. Columns N onward are free for your own notes (for example Quoted on).
2. In Google Cloud Console, make a project and turn on the **Google Sheets API**.
3. In that project, make a service account. Download one **JSON key** for it.
4. In the Sheet, click **Share** (top right). Add the service account email (`client_email` in the JSON key) as **Editor**.
5. Delete the JSON key file from your computer after step 6. Empty the Bin.

Daily use in the sheet: when you send a quote, set Status to **Quoted**. When a job is won, set Status to **Won**. The site sets Source from "How did you hear about us?" (Google, MyBuilder, Facebook, TikTok, Friend, Other), or `Website form` if the visitor leaves it empty. Add phone, WhatsApp, email and MyBuilder leads by hand, with Source set to `Phone`, `WhatsApp`, `Email` or `MyBuilder`.

Privacy: the privacy notice says each enquiry row is deleted after 1 year. The site does not delete rows. Once a month, delete the Leads rows with a Date more than 1 year old.

## B. Vercel

6. In the Vercel dashboard, open the project. Click **Settings** (top tabs) > **Environment Variables** (left menu). Add each key for **Production** and **Preview**:
   - `GOOGLE_SHEETS_ID`: the part of the Sheet URL between `/d/` and `/edit`.
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: `client_email` from the JSON key.
   - `GOOGLE_PRIVATE_KEY`: `private_key` from the JSON key, from `-----BEGIN` to `-----END PRIVATE KEY-----\n`. Tick **Sensitive**.
   - `NEXT_PUBLIC_GADS_ID`: the Google Ads tag ID, `AW-` followed by numbers (from step 8).
   - `NEXT_PUBLIC_GADS_LABEL_FORM`, `NEXT_PUBLIC_GADS_LABEL_CALL`, `NEXT_PUBLIC_GADS_LABEL_WHATSAPP`: the conversion labels from step 8.
   - Click **Save** after each one.
7. Redeploy so the new values are built in: **Deployments** (top tabs) > the latest deployment > **...** menu (right) > **Redeploy**. `NEXT_PUBLIC_` values are fixed at build time, so a redeploy is needed after each change.

Without `NEXT_PUBLIC_GADS_ID`, the site shows no cookie banner and loads no Google Ads code. Each conversion with no label does nothing.

## C. Google Ads conversion actions

8. In Google Ads, click **Goals** (left menu) > **Conversions** > **Summary** > **+ Create conversion action** (blue button). Choose **Website**, then **Add a conversion action manually**. Create these 3:

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

9. Open the live site in a private window. The cookie banner shows at the bottom. Click **Accept**, then send a test enquiry.
    - A new row shows in **Leads** with the Source you picked (or `Website form`).
    - No row? In Vercel, open **Logs** (top tabs) and search for `lead sheet`.
    - In Google Ads, the conversion status changes from "Unverified" within about 24 hours.
