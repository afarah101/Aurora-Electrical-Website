import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Single source of truth for site copy: content/site.md.
 * Parsed server-side at build time so no phone / email / service literal
 * is ever hardcoded into a component.
 *
 * Entries still marked [PLACEHOLDER] or [TBC] in site.md are treated as
 * "not confirmed" and are withheld from the rendered page rather than
 * being invented. See isUnconfirmed().
 */

const SOURCE = join(process.cwd(), "content", "site.md");

function raw(): string {
  return readFileSync(SOURCE, "utf8");
}

/** A value the client has not confirmed yet — never render these. */
function isUnconfirmed(value: string): boolean {
  return /\[(PLACEHOLDER|TBC)/i.test(value);
}

/**
 * Headings in site.md carry editorial suffixes that are meant to be edited away:
 * "## Reviews (PLACEHOLDER — replace with real ones)" becomes "## Reviews" once
 * real reviews land. Matching the full literal heading meant a section silently
 * resolved to [] the moment the file was tidied — so lookup is by stable prefix.
 */
const NEGATED_HEADING = /\b(do not|don't|never)\b/i;

/**
 * Find a `## Heading` by stable prefix. Exact matches win over prefix matches.
 *
 * The negation guard matters: "## Services (CONFIRMED — build only these)" and
 * "## Services — DO NOT list" share a prefix, and the second is an exclusion
 * list. Without this, a reordered file could render EV chargers — which the
 * client does not offer — as a service.
 */
function findHeading(lines: string[], key: string): number {
  const titles = lines.map((l) => {
    const t = l.trim();
    return t.startsWith("## ") ? t.slice(3).trim() : null;
  });
  const usable = (t: string | null): t is string =>
    t !== null && !NEGATED_HEADING.test(t);

  const exact = titles.findIndex((t) => usable(t) && t.toLowerCase() === key);
  if (exact !== -1) return exact;
  return titles.findIndex((t) => usable(t) && t.toLowerCase().startsWith(key));
}

/** Pull the body lines of a `## Heading` section, located by stable prefix. */
function section(heading: string): string[] {
  const lines = raw().split("\n");
  const start = findHeading(lines, heading.trim().toLowerCase());
  if (start === -1) return [];
  const body: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) break;
    if (line.trim()) body.push(line.trim());
  }
  return body;
}

/** `- Key: value` → value, or null when absent/unconfirmed. */
function field(heading: string, key: string): string | null {
  const hit = section(heading).find((l) =>
    l.toLowerCase().startsWith(`- ${key.toLowerCase()}:`),
  );
  if (!hit) return null;
  const value = hit.slice(hit.indexOf(":") + 1).trim();
  return !value || isUnconfirmed(value) ? null : value;
}

/** Bare `- item` bullets, excluding `- Key: value` pairs and placeholders. */
function bullets(heading: string): string[] {
  return section(heading)
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim())
    .filter((l) => l && !isUnconfirmed(l) && !/^[A-Za-z /]+:/.test(l));
}

export type Client = { name: string; descriptor: string; url: string | null; logo: string | null };
export type Review = { name: string; area: string; quote: string };

export const business = {
  name: field("Business", "Name") ?? "Aurora Electrical",
  tagline: field("Business", "Tagline"),
  logo: field("Business", "Logo"),
} as const;

export const contact = {
  phone: field("Contact", "Phone"),
  telLink: field("Contact", "Tel link"),
  whatsapp: field("Contact", "WhatsApp"),
  email: field("Contact", "Email"),
  serviceArea: field("Contact", "Service area"),
} as const;

export const services: string[] = bullets("Services");

/** Accreditations are regulated marks. Rendered only when site.md confirms one. */
export const accreditations: string[] = bullets("Certifications");

/** Certificate/EICR offerings — withheld until confirmed. */
export const certificates: string[] = bullets("Certificates");

export const positioning: string[] = bullets("Positioning");

/**
 * Front-of-site promises (availability, quoting). These are operational
 * commitments on the client's behalf, so they live in site.md rather than in
 * component markup — a claim removed here disappears from the page.
 */
export const claims: string[] = bullets("Claims");

function list(value: string | null): string[] {
  return value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];
}

const pageAreas = list(field("Service pages", "Areas"));

/**
 * Facts for the emergency and landlord EICR pages only. Kept apart from the
 * site-wide Service area / Certifications fields so confirming them here does
 * not change the home page.
 */
export const servicePages = {
  normalHours: field("Service pages", "Normal hours"),
  emergencyHours: field("Service pages", "Emergency hours"),
  areas: pageAreas,
  /** "A, B and C" for running text. */
  areasText:
    pageAreas.length > 1
      ? `${pageAreas.slice(0, -1).join(", ")} and ${pageAreas[pageAreas.length - 1]}`
      : (pageAreas[0] ?? null),
  registration: field("Service pages", "Registration"),
  emergencies: list(field("Service pages", "Common emergencies")),
  safety: field("Service pages", "Safety"),
  eicrMeaning: field("Service pages", "EICR meaning"),
  landlordRule: field("Service pages", "Landlord rule"),
} as const;

/** Only real, confirmed reviews. Placeholder rows resolve to []. */
export const reviews: Review[] = section("Reviews")
  .filter((l) => /^\d+\./.test(l))
  .map((l) => {
    const m = l.match(/^\d+\.\s*Name:\s*(.+?)\s*—\s*Area:\s*(.+?)\s*—\s*"(.*)"$/);
    if (!m) return null;
    const [, name, area, quote] = m;
    if ([name, area, quote].some(isUnconfirmed)) return null;
    return { name, area, quote };
  })
  .filter((r): r is Review => r !== null);

export const aggregateRating: string | null = (() => {
  const line = section("Reviews").find((l) =>
    l.toLowerCase().startsWith("- aggregate:"),
  );
  if (!line) return null;
  const value = line.slice(line.indexOf(":") + 1).trim();
  return isUnconfirmed(value) ? null : value;
})();

/**
 * A logo path is only returned when the file actually exists under public/.
 * Resolving this here means TrustedBy never has to guess, and a named slot
 * degrades to its fallback icon instead of emitting a broken image.
 */
function logoIfPresent(path: string | null): string | null {
  if (!path) return null;
  return existsSync(join(process.cwd(), "public", path.replace(/^\//, "")))
    ? path
    : null;
}

export const clients: Client[] = section("Trusted By")
  .filter((l) => /^\d+\./.test(l))
  .map((l) => {
    const body = l.replace(/^\d+\.\s*/, "");
    const name = body.split("—")[0].trim();
    const descriptor = (body.match(/—\s*([^(—]+?)\s*\(/)?.[1] ?? "").trim();
    const url = body.match(/\((https?:\/\/[^)]+)\)/)?.[1] ?? null;
    const logo = logoIfPresent(body.match(/logo slot:\s*(\/\S+)/)?.[1] ?? null);
    return { name, descriptor, url, logo };
  })
  .filter((c) => c.name.length > 0);

/** Work photos live here; empty until the client supplies them. */
export const workPhotoDir = "/work/";
