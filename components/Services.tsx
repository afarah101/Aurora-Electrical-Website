type Props = { services: string[]; certificates: string[] };

/**
 * Services come only from the CONFIRMED list in site.md.
 *
 * Reference treatment (reference/21.49.44): a light panel between two dark
 * bands, with the services as a typographic list — mono uppercase, square
 * markers, hairline rules, generous air — instead of an icon-card grid.
 * No per-service imagery: the reference pairs each item with a featured
 * photo, but none of our photos are verified per-service, and a fuse-board
 * photo captioned "Lighting" would be a misrepresentation, not a design.
 */
export function Services({ services, certificates }: Props) {
  if (services.length === 0) return null;

  return (
    // The seam out of the dark hero/TrustBar block: a thin neutral rule marks
    // the boundary on purpose (blue is reserved for actions), and the light
    // panel sits between the dark bands above and below — the same
    // dark-light-dark rhythm the reference uses around its services section.
    <section id="services" className="border-t-2 border-slate-800 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[2fr_3fr] lg:gap-20">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            What we do
          </h2>
          <p className="mt-5 max-w-md text-slate-600">
            The same standard of work whether it&apos;s a single socket or a full
            commercial installation.
          </p>
        </div>

        <div>
          <ul>
            {services.map((service) => (
              <li
                key={service}
                className="group border-b border-slate-200 first:border-t"
              >
                <div className="flex items-center gap-4 py-5">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 bg-slate-300 transition-colors group-hover:bg-slate-900"
                  />
                  <h3 className="font-mono text-sm font-medium uppercase leading-relaxed tracking-widest text-slate-600 transition-colors group-hover:text-slate-900">
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
                  className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
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
