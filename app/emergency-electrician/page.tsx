import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Nav } from "@/components/Nav";
import { StickyCall } from "@/components/StickyCall";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { accreditations, business, contact, servicePages } from "../content";

const { areasText, registration } = servicePages;

export const metadata: Metadata = {
  title: `Emergency Electrician in ${areasText ?? "South-West London"}`,
  description: `${registration ? `${registration} emergency` : "Emergency"} electrician for ${
    areasText ?? "South-West London"
  }. Call for power loss, a tripping fuse board, a burning smell or sparking sockets.`,
  alternates: { canonical: "/emergency-electrician" },
};

// No response-time or round-the-clock promise: hours come from site.md only.
export default function EmergencyElectricianPage() {
  const { normalHours, emergencyHours, emergencies, safety } = servicePages;

  return (
    <div id="top">
      <Nav businessName={business.name} phone={contact.phone} telLink={contact.telLink} />
      <main className="bg-slate-950">
        <article className="mx-auto max-w-3xl space-y-6 px-5 pb-16 pt-28 text-slate-300 sm:pb-20 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
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
              <a
                href={`tel:${contact.telLink}`}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-action px-6 text-lg font-semibold text-white transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-soft"
              >
                <Phone aria-hidden="true" className="h-5 w-5" />
                Call {contact.phone}
              </a>
            )}
            <WhatsAppButton whatsapp={contact.whatsapp} className="h-14" />
          </div>

          {(normalHours || emergencyHours) && (
            <>
              <h2>Hours</h2>
              <dl className="space-y-2">
                {normalHours && (
                  <div className="flex gap-2">
                    <dt className="font-semibold text-white">Normal hours:</dt>
                    <dd>{normalHours}</dd>
                  </div>
                )}
                {emergencyHours && (
                  <div className="flex gap-2">
                    <dt className="font-semibold text-white">Emergency hours:</dt>
                    <dd>{emergencyHours}</dd>
                  </div>
                )}
              </dl>
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
            <p className="rounded-md border border-slate-700 bg-slate-900 p-4 font-medium text-white">
              {safety}
            </p>
          )}

          <p>
            Not an emergency?{" "}
            <Link href="/contact" className="text-action-soft underline underline-offset-2 hover:text-white">
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
