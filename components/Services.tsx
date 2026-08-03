type Props = { services: string[]; certificates: string[] };

/**
 * Services come only from the CONFIRMED list in site.md.
 *
 * Reference treatment (reference/21.49.44 for the list, 21.49.22 for the
 * dark canvas): services as a typographic list — mono uppercase, square
 * markers, hairline rules, generous air — on the site's dark band, not an
 * icon-card grid.
 * No per-service imagery: the reference pairs each item with a featured
 * photo, but none of our photos are verified per-service, and a fuse-board
 * photo captioned "Lighting" would be a misrepresentation, not a design.
 */
export function Services({ services, certificates }: Props) {
  if (services.length === 0) return null;

  return (
    // Dark canvas continuous with the hero/TrustBar block above; a neutral
    // hairline marks the section boundary, reference-style — separation by
    // rule, not by surface change.
    <section id="services" className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[2fr_3fr] lg:gap-20">
        {/* Sticky through the list so the tall right column never leaves a
            dead lower-left quadrant; top offset clears the fixed nav. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What we do
          </h2>
          <p className="mt-5 max-w-md text-slate-300">
            The same standard of work whether it&apos;s a single socket or a full
            commercial installation.
          </p>
        </div>

        <div>
          {/* Rows carry no hover states: they are not interactive, and motion
              on them would invite a click that goes nowhere. */}
          <ul>
            {services.map((service) => (
              <li key={service} className="border-b border-slate-800 first:border-t">
                <div className="flex items-center gap-4 py-5">
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-slate-500" />
                  <h3 className="font-mono text-sm font-medium uppercase leading-relaxed tracking-widest text-slate-300">
                    {service}
                  </h3>
                </div>
              </li>
            ))}
          </ul>

          {certificates.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {certificates.map((c) => (
                <li
                  key={c}
                  className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-slate-200"
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
