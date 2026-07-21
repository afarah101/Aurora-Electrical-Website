import { readFileSync } from "node:fs";
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

/** Pull the body lines of a `## Heading` section. */
function section(heading: string): string[] {
  const lines = raw().split("\n");
  const start = lines.findIndex(
    (l) => l.trim().toLowerCase() === `## ${heading}`.toLowerCase(),
  );
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
  name: field("Business", "Name") ?? "Aurora Electricals",
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

export const services: string[] = bullets("Services (CONFIRMED — build only these)");

/** Accreditations are regulated marks. Rendered only when site.md confirms one. */
export const accreditations: string[] = bullets("Certifications / Accreditations");

/** Certificate/EICR offerings — withheld until confirmed. */
export const certificates: string[] = bullets("Certificates / EICR");

export const positioning: string[] = bullets("Positioning");

/** Only real, confirmed reviews. Placeholder rows resolve to []. */
export const reviews: Review[] = section("Reviews (PLACEHOLDER — replace with real ones)")
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
  const line = section("Reviews (PLACEHOLDER — replace with real ones)").find((l) =>
    l.toLowerCase().startsWith("- aggregate:"),
  );
  if (!line) return null;
  const value = line.slice(line.indexOf(":") + 1).trim();
  return isUnconfirmed(value) ? null : value;
})();

export const clients: Client[] = section("Trusted By / Past Clients (logo strip)")
  .filter((l) => /^\d+\./.test(l))
  .map((l) => {
    const body = l.replace(/^\d+\.\s*/, "");
    const name = body.split("—")[0].trim();
    const descriptor = (body.match(/—\s*([^(—]+?)\s*\(/)?.[1] ?? "").trim();
    const url = body.match(/\((https?:\/\/[^)]+)\)/)?.[1] ?? null;
    const logo = body.match(/logo slot:\s*(\/\S+)/)?.[1] ?? null;
    return { name, descriptor, url, logo };
  })
  .filter((c) => c.name.length > 0);

/** Work photos live here; empty until the client supplies them. */
export const workPhotoDir = "/work/";
