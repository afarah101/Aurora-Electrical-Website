import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { MagnetButton } from "@/components/ui/magnet-button";
import { Nav } from "@/components/Nav";
import { StickyCall } from "@/components/StickyCall";
import { Footer } from "@/components/Footer";
import { CTA_ARROW, CTA_CALL, CTA_ICON, WhatsAppButton } from "@/components/WhatsAppButton";
import { accreditations, business, contact, servicePages } from "../content";

const { areasText, registration } = servicePages;

const title = "Emergency Electrician South-West London | Aurora Electrical";
const description =
  "Emergency electrician in South-West London, NICEIC-registered. Call for power loss, a tripping fuse board, a burning smell or sparking sockets.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/emergency-electrician" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_GB",
    url: "/emergency-electrician",
    images: [{ url: "/aurora-share.png", width: 1200, height: 630, alt: `${business.name} logo` }],
  },
};

// No response-time or round-the-clock promise: hours come from site.md only.
export default function EmergencyElectricianPage() {
  const { normalHours, emergencyHours, emergencies, safety } = servicePages;

  return (
    <div id="top">
      <Nav businessName={business.name} phone={contact.phone} telLink={contact.telLink} />
      <main className="bg-surface">
        <article className="mx-auto max-w-3xl space-y-6 px-5 pb-16 pt-28 text-ink-muted sm:pb-20 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Emergency Electrician in South-West London
          </h1>

          {(registration || areasText) && (
            <p className="text-lg">
              {business.name}
              {registration && <> is {registration}</>}
              {areasText && <>{registration ? " and covers" : " covers"} {areasText}</>}.
            </p>
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
          </div>

          {(normalHours || emergencyHours) && (
            <>
              <h2>Hours</h2>
              {/* Fallback 8: state both windows plainly; nothing implies cover outside them. */}
              <p className="text-ink">
                {normalHours && <>Normal hours {normalHours}.</>}
                {normalHours && emergencyHours && " "}
                {emergencyHours && <>Emergency call-outs {emergencyHours}.</>}
              </p>
            </>
          )}

          {emergencies.length > 0 && (
            <>
              <h2>Common emergencies</h2>
              <ul className="list-disc space-y-1 pl-5">
                {emergencies.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </>
          )}

          {safety && (
            <p className="rounded-sm bg-surface-raised p-4 font-medium text-ink ring-1 ring-hairline-strong">
              {safety}
            </p>
          )}

          <p>
            Not an emergency?{" "}
            <Link href="/contact" className="text-action-soft underline underline-offset-2 transition-colors duration-[160ms] ease-out hover-fine:text-ink motion-reduce:transition-none">
              Request a quote
            </Link>
            .
          </p>
        </article>
      </main>
      <Footer businessName={business.name} phone={contact.phone} telLink={contact.telLink} email={contact.email} serviceArea={contact.serviceArea} accreditations={accreditations} whatsapp={contact.whatsapp} />
      <StickyCall phone={contact.phone} telLink={contact.telLink} />
    </div>
  );
}
