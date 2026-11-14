import { RatingStars } from "@/components/RatingStars";
import { mybuilderField } from "@/lib/mybuilder";

// Press is deliberate (160ms), release snaps (100ms), hover colour eases 160ms.
const PRESS =
  "[transition:transform_100ms_var(--ease-out),background-color_160ms_var(--ease-out)] active:scale-[0.97] active:[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)] motion-reduce:active:scale-100";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft";

/**
 * MyBuilder verified-rating block, shown directly above the review
 * slideshow: the aggregate number first, then the individual quotes.
 *
 * Every value is read from the "## MyBuilder" section of site.md — nothing
 * is hardcoded here (reader: lib/mybuilder.ts). If the section or its
 * values are missing the block renders nothing rather than inventing a
 * rating.
 *
 * Two-colour discipline: gold marks the proof (eyebrow, stars, chips);
 * blue appears only on the action button that leads to the profile.
 */
export function MyBuilderBadge() {
  const rating = mybuilderField("Rating");
  const outOf = mybuilderField("Rating out of");
  const count = mybuilderField("Reviews");
  const verified = mybuilderField("Verified by MyBuilder") === "yes";
  const warranty = mybuilderField("Offers warranty") === "yes";
  const profile = mybuilderField("Profile");

  if (!rating || !count) return null;

  return (
    <section className="border-b border-hairline bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <p className="font-mono text-sm font-medium uppercase tracking-widest text-trust-bright">
          Verified on MyBuilder
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-4">
          <p className="font-heading text-7xl font-bold leading-none text-ink sm:text-8xl">
            {rating}
          </p>
          <div className="pb-2">
            <RatingStars rating={Number(rating)} outOf={Number(outOf) || 5} className="size-5" />
            <p className="mt-2 text-sm text-ink-muted">from {count} reviews</p>
          </div>
        </div>

        {(verified || warranty) && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {verified && (
              <li className="rounded-full border border-trust-line bg-trust-soft px-3 py-1.5 text-sm font-semibold text-trust-deep">
                Verified by MyBuilder
              </li>
            )}
            {warranty && (
              <li className="rounded-full border border-trust-line bg-trust-soft px-3 py-1.5 text-sm font-semibold text-trust-deep">
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
            className={`mt-8 inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-action px-6 text-base font-semibold text-ink hover-fine:bg-action-hover ${PRESS} ${FOCUS}`}
          >
            See all {count} reviews on MyBuilder
          </a>
        )}
      </div>
    </section>
  );
}
