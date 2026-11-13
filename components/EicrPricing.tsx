/**
 * EICR pricing, linked from the EICRs row in Services. Copy is limited to
 * the prices the client supplied — nothing invented. Neutral
 * palette throughout: pricing is information, not proof, so the gold stays
 * unused here; labels take the body face and figures take the mono face.
 */
const PRICES: Array<{ label: string; price: string }> = [
  { label: "1-2 Bedroom", price: "£160" },
  { label: "3 Bedroom", price: "£220" },
  { label: "4 Bedroom", price: "£260" },
  { label: "5 Bedroom", price: "£300" },
  { label: "6+ Bedroom", price: "call for quote" },
];

export function EicrPricing() {
  return (
    <section id="eicr-pricing" className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          EICR pricing
        </h2>

        {/*
          Full-width two-column ledger, reference-style (the stats grid in
          reference/21.49.53 translated to hairlines): column-flow so the
          five tiers split 3/2 and both columns read top-to-bottom. One
          top rule spans the whole width; each row closes with its own
          hairline — separation by rule, never boxes.
        */}
        <dl className="mt-10 grid gap-x-16 border-t border-slate-800 sm:grid-flow-col sm:grid-rows-3">
          {PRICES.map(({ label, price }) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-4 border-b border-slate-800 py-5"
            >
              <dt className="text-base text-slate-200">{label}</dt>
              <dd className="font-mono text-base tabular-nums text-white">
                {price}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
