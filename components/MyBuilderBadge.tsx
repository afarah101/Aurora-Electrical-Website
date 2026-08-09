import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Star } from "lucide-react";

/**
 * MyBuilder verified-rating block, shown directly above the review
 * slideshow: the aggregate number first, then the individual quotes.
 *
 * Every value is read from the "## MyBuilder" section of site.md — nothing
 * is hardcoded here. content.ts doesn't export its field helpers, so this
 * server component carries its own minimal reader (the TrustBar precedent);
 * if the section or its values are missing the block renders nothing rather
 * than inventing a rating.
 *
 * Two-colour discipline: gold marks the proof (eyebrow, stars, chips);
 * blue appears only on the action button that leads to the profile.
 */
function mybuilderField(key: string): string | null {
  try {
    const lines = readFileSync(
      join(process.cwd(), "content", "site.md"),
      "utf8",
    ).split("\n");
    const start = lines.findIndex(
      (l) => l.trim().toLowerCase() === "## mybuilder",
    );
    if (start === -1) return null;
    for (const line of lines.slice(start + 1)) {
      if (line.startsWith("## ")) break;
      const t = line.trim();
      if (t.toLowerCase().startsWith(`- ${key.toLowerCase()}:`)) {
        const value = t.slice(t.indexOf(":") + 1).trim();
        return value && !/\[(PLACEHOLDER|TBC)/i.test(value) ? value : null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function MyBuilderBadge() {
  const rating = mybuilderField("Rating");
  const outOf = mybuilderField("Rating out of");
  const count = mybuilderField("Reviews");
  const verified = mybuilderField("Verified by MyBuilder") === "yes";
  const warranty = mybuilderField("Offers warranty") === "yes";
  const profile = mybuilderField("Profile");

  if (!rating || !count) return null;

  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <p className="font-mono text-sm font-medium uppercase tracking-widest text-trust-bright">
          Verified on MyBuilder
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-4">
          <p className="font-heading text-7xl font-bold leading-none text-white sm:text-8xl">
            {rating}
          </p>
          <div className="pb-2">
            <span
              role="img"
              aria-label={`${rating} out of ${outOf ?? "5"} stars`}
              className="flex items-center gap-1"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className="h-5 w-5 fill-trust-bright text-trust-bright"
                />
              ))}
            </span>
            <p className="mt-2 text-sm text-slate-300">from {count} reviews</p>
          </div>
        </div>

        {(verified || warranty) && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {verified && (
              <li className="rounded-md border border-trust-line bg-trust-soft px-3 py-1.5 text-sm font-semibold text-trust-deep">
                Verified by MyBuilder
              </li>
            )}
            {warranty && (
              <li className="rounded-md border border-trust-line bg-trust-soft px-3 py-1.5 text-sm font-semibold text-trust-deep">
                Offers warranty
              </li>
            )}
          </ul>
        )}

        {profile && (
          <a
            href={profile}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-action px-6 text-base font-semibold text-white transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
          >
            See all {count} reviews on MyBuilder
          </a>
        )}
      </div>
    </section>
  );
}
