/**
 * Google Ads tag and conversions. Client only.
 * The tag loads only from loadGoogleAds(), which components/consent-banner.tsx
 * calls after the visitor accepts. Until then window.gtag does not exist, so
 * every conversion below is a no-op. Each env var unset also means a no-op.
 */

// Literal process.env reads, so Next.js inlines them at build time.
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;
const LABELS = {
  form: process.env.NEXT_PUBLIC_GADS_LABEL_FORM,
  call: process.env.NEXT_PUBLIC_GADS_LABEL_CALL,
  whatsapp: process.env.NEXT_PUBLIC_GADS_LABEL_WHATSAPP,
} as const;

export type Conversion = keyof typeof LABELS;

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** True when an Ads account is configured, so there is a cookie to ask about. */
export const gadsEnabled = Boolean(GADS_ID);

let loaded = false;

/** Call only after the visitor accepts. Safe to call more than once. */
export function loadGoogleAds(): void {
  if (!GADS_ID || loaded || typeof window === "undefined") return;
  loaded = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js reads the arguments object, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GADS_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GADS_ID)}`;
  document.head.appendChild(script);
}

export function trackConversion(kind: Conversion): void {
  const label = LABELS[kind];
  if (!GADS_ID || !label || !loaded || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "conversion", { send_to: `${GADS_ID}/${label}` });
}

/** Which conversion a clicked link counts as, or null. Pure, for testing. */
export function conversionForHref(href: string): Conversion | null {
  if (href.startsWith("tel:")) return "call";
  try {
    const host = new URL(href).hostname.toLowerCase();
    if (host === "wa.me" || host === "api.whatsapp.com") return "whatsapp";
  } catch {
    // Relative or bad URL: not a call or WhatsApp link.
  }
  return null;
}

/**
 * One document listener covers every call and WhatsApp link on the site
 * (StickyCall, Nav, Hero, Footer, WhatsAppButton). Returns a cleanup.
 */
export function installClickTracking(): () => void {
  const onClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a[href]");
    if (!link) return;
    const kind = conversionForHref(link.getAttribute("href") ?? "");
    if (kind) trackConversion(kind);
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
