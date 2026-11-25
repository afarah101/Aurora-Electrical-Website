# Lead sheet setup

Each website enquiry is sent by email first. Then the site adds one row to the **Leads** tab of a Google Sheet. If the sheet write fails, the email has already gone and the visitor still sees "Thanks". The error shows in the Vercel logs as `contact: lead sheet write failed`.

The site signs in to Google with a **service account**: a robot Google user that has edit access to this one Sheet only. Code: `lib/leads-sheet.ts`.

Do the steps in order. You need about 15 minutes.

## 1. The Sheet

1. Open the client register Google Sheet (or make one at https://sheets.new).
2. At the bottom left, find the tab named **Leads**. If there is none, click **+** (bottom left) and rename the new tab to `Leads` (double-click the tab name).
3. In row 1 of **Leads**, type these 13 headers, one per cell, from A1 to M1:

   | A | B | C | D | E | F | G | H | I | J | K | L | M |
   |---|---|---|---|---|---|---|---|---|---|---|---|---|
   | Date | Source | Name | Phone | Email | Job type | Details | utm_source | utm_medium | utm_campaign | gclid | Landing page | Status |

   If the tab already has these headers, change nothing. Columns N onward are free for your own notes.
4. Look at the address bar. The URL looks like `https://docs.google.com/spreadsheets/d/1AbC...xyz/edit`. The part between `/d/` and `/edit` is the **Sheet ID**. Keep this tab open for step 4.

## 2. Google Cloud project and Sheets API

1. Go to https://console.cloud.google.com and sign in with the same Google account that owns the Sheet.
2. In the top bar, next to the Google Cloud logo, click the **project picker**. In the window, click **New project** (top right). Name it `aurora-leads`. Click **Create**. Wait for the notice, then select the new project in the project picker.
3. In the **search bar** at the top, type `Google Sheets API`. Click the result with that name. Click the blue **Enable** button.

## 3. Service account and key

1. Click the **menu** icon (three lines, top left) > **IAM & Admin** > **Service accounts**.
2. Click **+ Create service account** (top of the page).
3. Service account name: `aurora-leads`. Click **Create and continue**. Leave the role empty. Click **Continue**, then **Done**.
4. In the list, click the new service account's email (it ends in `.iam.gserviceaccount.com`). Copy this email. You need it in steps 4 and 5.
5. Click the **Keys** tab (top of the page) > **Add key** > **Create new key**. Pick **JSON**. Click **Create**. A `.json` file downloads to your Downloads folder.
   - If Google says "Service account key creation is disabled", your account is under a Google Workspace organisation policy. Use a project in a personal Google account, or ask the Workspace admin to allow keys for this project.

Keep the JSON file secret. It is a password for the Sheet. Never put it in the repo, an email or a chat.

## 4. Share the Sheet with the service account

1. Go back to the Sheet tab.
2. Click **Share** (top right).
3. Paste the service account email from step 3.4. Set the role to **Editor**.
4. Untick **Notify people** (the robot has no inbox). Click **Share**.

## 5. Add the 3 values in Vercel

1. Open https://vercel.com, then the Aurora project.
2. Click **Settings** in the top tab bar, then **Environment Variables** in the left menu.
3. Add each key. For each one, tick **Production** (and **Preview** if you also want test enquiries from preview links in this Sheet). Click **Save**.

   | Key | Value |
   |---|---|
   | `GOOGLE_SHEETS_ID` | The Sheet ID from step 1.4 |
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The email from step 3.4 (also `client_email` in the JSON file) |
   | `GOOGLE_PRIVATE_KEY` | Open the JSON file in TextEdit. Copy the `private_key` value: everything between the quotes, from `-----BEGIN PRIVATE KEY-----` to `-----END PRIVATE KEY-----\n`. Do not copy the quotes. Tick **Sensitive**. |

   The `\n` characters in the key are correct. The site changes them back into line breaks.
4. If the old keys `LEADS_WEBHOOK_URL` and `LEADS_WEBHOOK_TOKEN` are in the list, delete them: click the **...** menu at the right of each row > **Remove**. The site no longer reads them.
5. Delete the JSON file from Downloads, then empty the Bin.

## 6. Redeploy and test

1. Click **Deployments** in the top tab bar. On the latest Production deployment, click the **...** menu (right) > **Redeploy** > **Redeploy**.
2. When the status is **Ready**, open the live site in a private window. Send a test enquiry. Pick a Job type and "How did you hear about us?".
3. A new row shows in **Leads** within a few seconds. Source is your "How did you hear about us?" answer, or `Website form` if you left it empty. Status is `New`.
4. No row? In Vercel, click **Logs** in the top tab bar and search for `lead sheet` or `leads-sheet`.
   - `GOOGLE_* env vars not set`: a key is missing or misspelled. Check step 5, then redeploy.
   - `token request failed (400)`: the private key or email is wrong. Copy the key again.
   - `append failed (403)`: the Sheet is not shared with the service account (step 4), or the Sheets API is off (step 2.3).
   - `append failed (400)`: the tab is not named exactly `Leads`.
5. Delete the test row.

## Old Apps Script

The site no longer calls the Apps Script web app. If you set it up before:

- Its daily follow-up email and 1-year delete still run from inside the Sheet, because the 13 columns did not change. Leave them, or remove the trigger: in the Sheet, **Extensions** > **Apps Script** > **clock icon** (Triggers, left bar) > **...** on the row > **Delete trigger**.
- Turn off the web app: **Deploy** (blue button, top right) > **Manage deployments** > **Archive** (box icon).

If you never set it up: nothing deletes old rows. The privacy notice says each enquiry row is deleted after 1 year. Once a month, delete the Leads rows with a Date more than 1 year old.

---

# Phase 2 (research only, no code)

Checked on 2026-11-25. Meta changed these pages often in 2026. Check them again before you build.

## A. WhatsApp Coexistence

**Can Mohamed keep the WhatsApp Business app and send inbound-message webhooks to a Vercel route on the same number?** Yes. "Coexistence" connects a WhatsApp Business app number to the Cloud API. He keeps using the app. Inbound messages go as webhooks to the callback URL that you set (this can be a Vercel route). Messages that he sends from the app arrive as `smb_message_echoes` webhooks. Since 23 Oct 2025, UK numbers are supported.

Limits:
- He needs app version 2.24.17 or later.
- Throughput is fixed at 20 messages per second. This is not a problem for this business.
- Up to 6 months of chat history can sync. Media syncs only for the last 14 days. The sync must start within 24 hours of onboarding.
- Group chats do not sync.
- Disappearing messages, view-once, live location, voice and video calls, and channels do not work on the API side. Broadcast lists become read-only.
- If his phone is not used for about 14 days, Meta can disconnect the number.

Sources:
- https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users/
- https://developers.facebook.com/documentation/business-messaging/whatsapp/changelog

**Can one small business onboard directly with Meta, or is a partner (BSP) required?** In practice, a partner is required. Meta's Coexistence guide says that you must already be a Solution Partner or Tech Provider. To become a Tech Provider yourself, you must pass Meta business verification and App Review. App Review needs a screen recording of the app. No official Meta page says that a business can use Coexistence on its own number through its own app. Status: no official page says yes, and none says no.

Sources:
- https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users/
- https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers

**Cost per inbound message?**
- Inbound messages (customer to business) are free. Meta says it does not charge for messages from users to businesses.
- Replies in the 24-hour customer-service window: from 1 Oct 2026, each number gets 1,000 free delivered service messages per month. After that, Meta charges for each one. Unused messages do not carry over. Before 1 Oct 2026, these replies were free.
- Meta charges per delivered message (since 1 Jul 2025).
- UK rates for marketing and utility templates: not checked. The GBP rate card did not load. Get the numbers from the rate card link on the pricing page.
- A partner (BSP) may add its own monthly fee on top of Meta's fees. That is not on Meta's pages.

Sources:
- https://developers.facebook.com/docs/whatsapp/pricing
- https://whatsappbusiness.com/products/platform-pricing/

## B. MyBuilder

**Is there an official API or feed?** None found. Searches of mybuilder.com showed no public API, partner API or data feed for profiles, reviews or leads. To be sure, ask MyBuilder support.

**Do the terms allow automated reading of the public profile page?** Most probably not.
- Terms page: https://www.mybuilder.com/terms-conditions. The page blocked automated fetch (HTTP 403), so the full text was not read. Search results show a clause that bans "spiders, robots, scrapers, crawlers" and similar tools from use to scrape or download data. Ahmed: open the page in a normal browser and confirm the clause before any decision.
- https://www.mybuilder.com/robots.txt does not block `/profile/` for general bots. But robots.txt does not give permission when the terms say no.
- The 403 shows that the site blocks bots.

Recommendation: do not scrape MyBuilder. Keep the link to the profile and reviews (this is how the site works now). Add MyBuilder leads to the sheet by hand, with Source `MyBuilder`.
