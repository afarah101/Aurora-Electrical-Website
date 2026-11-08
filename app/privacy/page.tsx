// Draft — awaiting approval (Mohamed has not yet approved this wording).
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { StickyCall } from "@/components/StickyCall";
import { Footer } from "@/components/Footer";
import { accreditations, business, contact } from "../content";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${business.name} uses the details you give us.`,
  alternates: { canonical: "/privacy" },
  // TODO: remove this noindex once Mohamed approves the wording (and the Draft comment above).
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  const email = contact.email;

  return (
    <div id="top">
      <Nav businessName={business.name} phone={contact.phone} telLink={contact.telLink} />
      <main className="bg-slate-950">
        <article className="mx-auto max-w-3xl space-y-6 px-5 py-16 text-slate-300 sm:py-20 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Privacy notice</h1>

          <p>
            {business.name} holds the details you give us: your name, phone number, address, email and
            job details.
          </p>

          <p>
            We use them to quote, carry out the job, invoice you and keep our business records, and to
            remind you when your EICR is due. We do this to carry out our work for you, to meet our legal
            record-keeping duties, and, for EICR reminders, because it is in our legitimate interest.
            Reply STOP to any message to opt out.
          </p>

          <p>
            Our website host, email service, Google (client records) and WhatsApp handle your details for
            us. Some may store them outside the UK, with legal safeguards in place.
          </p>

          <p>
            We delete enquiries that do not become a job after 1 year. We keep job and invoice records for
            as long as tax law requires.
          </p>

          <p>
            You can ask to see, correct or delete your details, or complain to the ICO at{" "}
            <a href="https://ico.org.uk" className="text-action-soft underline underline-offset-2 hover:text-white">
              ico.org.uk
            </a>
            .
            {email && (
              <>
                {" "}Contact us at{" "}
                <a href={`mailto:${email}`} className="text-action-soft underline underline-offset-2 hover:text-white">
                  {email}
                </a>
                .
              </>
            )}
          </p>
        </article>
      </main>
      <Footer businessName={business.name} phone={contact.phone} telLink={contact.telLink} email={contact.email} serviceArea={contact.serviceArea} accreditations={accreditations} whatsapp={contact.whatsapp} />
      <StickyCall phone={contact.phone} telLink={contact.telLink} />
    </div>
  );
}
