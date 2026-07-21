import { MapPin, Users, Wrench } from "lucide-react";

type Props = { serviceArea: string | null; positioning: string[] };

/**
 * Reinforces range (domestic + commercial) directly beneath the hero.
 * Deliberately free of numeric claims — no job counts or years-in-trade,
 * since site.md confirms neither.
 */
export function TrustBar({ serviceArea, positioning }: Props) {
  return (
    <section className="border-b border-slate-200 bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <Users aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-300" />
          <span className="text-sm font-medium text-slate-100">
            Homeowners &amp; businesses
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Wrench aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-300" />
          <span className="text-sm font-medium text-slate-100">
            Quoted before work starts
          </span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-300" />
          <span className="text-sm font-medium text-slate-100">
            {serviceArea ?? "London"}
          </span>
        </div>
      </div>

      {positioning.length > 0 && (
        <div className="sr-only">
          {positioning.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}
    </section>
  );
}
