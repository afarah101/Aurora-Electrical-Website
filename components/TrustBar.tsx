import { MapPin, Users, Wrench } from "lucide-react";
import { claims } from "@/app/content";

type Props = { serviceArea: string | null; positioning: string[] };

/**
 * Reinforces range (domestic + commercial) directly beneath the hero.
 * Deliberately free of numeric claims — no job counts or years-in-trade,
 * since site.md confirms neither.
 *
 * The quoting line and the service area render only when site.md provides
 * them: the quote claim comes from the same Claims pipeline the hero reads,
 * and there is no fallback area — a service area we haven't confirmed is not
 * ours to invent.
 */
export function TrustBar({ serviceArea, positioning }: Props) {
  const quoteClaim =
    claims.find((c) => /quoted before/i.test(c)) ?? null;

  const items = [
    { icon: Users, label: "Homeowners & businesses" },
    quoteClaim ? { icon: Wrench, label: quoteClaim } : null,
    serviceArea ? { icon: MapPin, label: serviceArea } : null,
  ].filter((i): i is { icon: typeof Users; label: string } => i !== null);

  return (
    <section className="bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:gap-12">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-300" />
            <span className="text-sm font-medium text-slate-100">{label}</span>
          </div>
        ))}
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
