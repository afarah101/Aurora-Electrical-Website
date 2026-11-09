import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Nav } from "@/components/Nav";
import { StickyCall } from "@/components/StickyCall";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { EicrPricing } from "@/components/EicrPricing";
import { accreditations, business, contact, servicePages } from "../content";

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
      <main className="bg-slate-950">
        <article className="mx-auto max-w-3xl space-y-6 px-5 pb-12 pt-28 text-slate-300 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
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
              <a
                href={`tel:${contact.telLink}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-action px-6 text-base font-semibold text-white transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
              >
                <Phone aria-hidden="true" className="h-5 w-5" />
                Call {contact.phone}
              </a>
            )}
            <WhatsAppButton whatsapp={contact.whatsapp} />
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
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
