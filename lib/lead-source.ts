/**
 * Where an enquiry came from, read at the moment the form is sent.
 * Nothing is stored in the browser (no cookies, no storage), so no consent
 * banner is needed. The trade-off: if a visitor lands on one page and sends
 * the form from another, only the second page's details are seen.
 */
export type LeadSource = {
  page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: string;
};

const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "gclid"] as const;

export function readLeadSource(): LeadSource {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const source: LeadSource = { page: url.pathname };
  if (document.referrer && !document.referrer.startsWith(url.origin)) {
    source.referrer = document.referrer.slice(0, 300);
  }
  for (const key of PARAMS) {
    const value = url.searchParams.get(key);
    if (value) source[key] = value.slice(0, 200);
  }
  return source;
}

/** One plain label for the enquiry email, so Mohamed can log the job source. */
export function describeLeadSource(source: LeadSource | undefined): string {
  if (!source) return "Unknown";
  if (source.gclid) return "Google Ads";
  if (source.utm_source) {
    return [source.utm_source, source.utm_medium, source.utm_campaign].filter(Boolean).join(" / ");
  }
  const ref = source.referrer ?? "";
  if (/google\./i.test(ref)) return "Google search or Maps";
  if (/mybuilder\./i.test(ref)) return "MyBuilder";
  if (/(facebook|instagram|tiktok)\./i.test(ref)) return "Social media";
  if (ref) return `Link from ${ref.replace(/^https?:\/\//, "").split("/")[0]}`;
  return "Direct visit (typed the address, bookmark or app)";
}
