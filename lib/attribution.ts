export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "gclid", "landing_page"] as const;
export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>;

const URL_KEYS = ["utm_source", "utm_medium", "utm_campaign", "gclid"] as const;
const STORAGE_KEY = "aurora-attribution";

/**
 * Traffic source for the form. Client only. The first page load in a tab
 * session wins: later pages without tags do not overwrite it.
 */
export function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = { landing_page: window.location.pathname };
  for (const key of URL_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value;
  }

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : null;
    if (parsed && typeof parsed === "object") return parsed as Attribution;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
  } catch {
    // Storage blocked (private mode) or bad JSON: use this page's URL.
  }
  return fromUrl;
}
