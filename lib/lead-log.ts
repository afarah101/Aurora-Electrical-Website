type Lead = {
  name: string;
  phone: string;
  email?: string;
  fault: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: string;
  landing_page?: string;
};

/**
 * Appends one row to the "Leads" tab through integrations/leads-webhook.gs.
 * Never throws: the enquiry email has already gone, so a failure here only warns.
 */
export async function logLead(lead: Lead): Promise<void> {
  const url = process.env.LEADS_WEBHOOK_URL;
  const token = process.env.LEADS_WEBHOOK_TOKEN;
  if (!url || !token) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const row = [
      // sv-SE gives "YYYY-MM-DD HH:mm:ss", which Sheets reads as a date in any locale.
      new Date().toLocaleString("sv-SE", { timeZone: "Europe/London" }),
      "Website form",
      lead.name,
      lead.phone,
      lead.email ?? "",
      "", // Job type: the form has no such field.
      lead.fault,
      lead.utm_source ?? "",
      lead.utm_medium ?? "",
      lead.utm_campaign ?? "",
      lead.gclid ?? "",
      lead.landing_page ?? "",
      "New",
    ];
    // Apps Script cannot read request headers, so the token goes in the body.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, row }),
      signal: controller.signal,
    });
    const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !body?.ok) console.warn("lead-log: webhook did not accept the row", res.status);
  } catch (err) {
    console.warn("lead-log: could not log lead", err);
  } finally {
    clearTimeout(timer);
  }
}
