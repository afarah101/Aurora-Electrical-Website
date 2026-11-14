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

function sameOrigin(referrer: string, origin: string): boolean {
  try {
    return new URL(referrer).origin === origin;
  } catch {
    return false;
  }
}

function hostOf(referrer: string): string {
  try {
    return new URL(referrer).hostname.toLowerCase();
  } catch {
    return "";
  }
}

const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "gclid"] as const;

export function readLeadSource(): LeadSource {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const source: LeadSource = { page: url.pathname };
  if (document.referrer && sameOrigin(document.referrer, url.origin) === false) {
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
  const host = hostOf(ref);
  const on = (name: string) => host.split(".").includes(name);
  if (on("google")) return "Google search or Maps";
  if (on("mybuilder")) return "MyBuilder";
  if (on("facebook") || on("instagram") || on("tiktok")) return "Social media";
  if (host) return `Link from ${host}`;
  if (ref) return "Link from another site";
  return "Direct visit (typed the address, bookmark or app)";
}
