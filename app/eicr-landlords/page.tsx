import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { MagnetButton } from "@/components/ui/magnet-button";
import { Nav } from "@/components/Nav";
import { StickyCall } from "@/components/StickyCall";
import { Footer } from "@/components/Footer";
import { CTA_ARROW, CTA_CALL, CTA_ICON, WhatsAppButton } from "@/components/WhatsAppButton";
import { EicrPricing } from "@/components/EicrPricing";
import { accreditations, business, contact, servicePages } from "../content";

// Press is deliberate (160ms), release snaps (100ms), hover colour eases 160ms.
const PRESS =
  "[transition:transform_100ms_var(--ease-out),background-color_160ms_var(--ease-out)] active:scale-[0.97] active:[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)] motion-reduce:active:scale-100";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft";

const { areasText, registration } = servicePages;

export const metadata: Metadata = {
  title: `EICR for Landlords in ${areasText ?? "South-West London"}`,
  description: `${registration ? `${registration} electrician` : "Electrician"} carrying out landlord EICRs in ${
    areasText ?? "South-West London"
  }. Prices by number of bedrooms.`,
  alternates: { canonical: "/eicr-landlords" },
};

export default function EicrLandlordsPage() {
  const { eicrMeaning, landlordRule } = servicePages;

  return (
    <div id="top">
      <Nav businessName={business.name} phone={contact.phone} telLink={contact.telLink} />
      <main className="bg-surface">
        <article className="mx-auto max-w-3xl space-y-6 px-5 pb-12 pt-28 text-ink-muted [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            EICR for Landlords in South-West London
          </h1>

          {(registration || areasText) && (
            <p className="text-lg">
              {business.name}
              {registration && <> is {registration}</>}
              {areasText && <>{registration ? " and covers" : " covers"} {areasText}</>}.
            </p>
          )}

          {(eicrMeaning || landlordRule) && (
            <>
              <h2>What landlords need</h2>
              {eicrMeaning && <p>{eicrMeaning}</p>}
              {landlordRule && <p>{landlordRule}</p>}
            </>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            {contact.telLink && (
              <MagnetButton
                href={`tel:${contact.telLink}`}
                className={CTA_CALL}
              >
                <Phone aria-hidden="true" strokeWidth={1.75} className={CTA_ICON} />
                Call {contact.phone}
                <ArrowRight aria-hidden="true" strokeWidth={1.75} className={CTA_ARROW} />
              </MagnetButton>
            )}
            <WhatsAppButton whatsapp={contact.whatsapp} />
            <Link
              href="/contact"
              className={`inline-flex h-12 items-center justify-center rounded-sm border border-ink-faint bg-transparent px-6 text-base font-semibold text-ink hover-fine:border-trust-bright ${PRESS} ${FOCUS}`}
            >
              Request a quote
            </Link>
          </div>
        </article>
        {/* Same component as the home page, so the prices cannot drift. */}
        <EicrPricing />
      </main>
      <Footer businessName={business.name} phone={contact.phone} telLink={contact.telLink} email={contact.email} serviceArea={contact.serviceArea} accreditations={accreditations} whatsapp={contact.whatsapp} />
      <StickyCall phone={contact.phone} telLink={contact.telLink} />
    </div>
  );
}
