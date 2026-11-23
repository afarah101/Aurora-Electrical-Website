import { BadgeCheck, ClipboardCheck, Clock, ShieldCheck } from "lucide-react";
import { accreditations, claims } from "@/app/content";
import { mybuilderField } from "@/lib/mybuilder";

type Props = { serviceArea: string | null; positioning: string[] };

/**
 * Trust strip directly beneath the hero. Every item is a claim that
 * content/site.md already makes, read from the same field the rest of the
 * site uses, so nothing here is new and a removed fact disappears here too:
 * - NICEIC: "## Certifications / Accreditations" (also the hero eyebrow).
 * - Same-day callouts, free quote: "## Claims".
 * - Warranty: "Offers warranty: yes" under "## MyBuilder" (also MyBuilderBadge).
 * Deliberately free of numeric claims: no job counts or years in trade.
 */
export function TrustBar({ positioning }: Props) {
  const niceic = accreditations.find((a) => /niceic/i.test(a)) ?? null;
  const sameDay = claims.find((c) => /same-day/i.test(c)) ?? null;
  const freeQuote = claims.find((c) => /no-obligation quote/i.test(c)) ?? null;
  const warranty = mybuilderField("Offers warranty") === "yes" ? "Offers warranty" : null;

  const items = [
    niceic ? { icon: BadgeCheck, label: niceic } : null,
    sameDay ? { icon: Clock, label: sameDay } : null,
    freeQuote ? { icon: ClipboardCheck, label: freeQuote } : null,
    warranty ? { icon: ShieldCheck, label: warranty } : null,
  ].filter((i): i is { icon: typeof BadgeCheck; label: string } => i !== null);

  return (
    <section className="bg-surface-raised">
      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-5 px-5 py-8 sm:grid-cols-2 lg:flex lg:items-center">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0 text-trust-bright" />
            <span className="text-sm font-medium text-ink-soft">{label}</span>
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
