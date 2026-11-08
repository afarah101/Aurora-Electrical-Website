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

          <h2>Who holds your details</h2>
          <p>
            Your details are held by Mohamed, a sole trader trading as {business.name}. He decides how
            they are used and is responsible for keeping them safe.
          </p>

          <h2>What we collect</h2>
          <p>
            When you contact us or we work for you, we collect your name, phone number, address, email
            address (if you give it) and details of the job.
          </p>

          <h2>Why we use them, and our legal basis</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              To give you a quote, carry out the job and send you an invoice. Legal basis: contract
              (we need your details to agree and do the work you asked for).
            </li>
            <li>
              To keep our business and tax records. Legal basis: legal obligation (the law requires us
              to keep them).
            </li>
            <li>
              To remind you when your EICR (electrical safety certificate) is due. Legal basis:
              legitimate interests (keeping your property safe and compliant). You can stop these at any
              time by replying STOP.
            </li>
          </ul>

          <h2>Who else receives your details</h2>
          <p>We use these services to run the business. They handle your details only for us:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Vercel, which hosts this website.</li>
            <li>Resend, which delivers the emails sent from our contact form.</li>
            <li>Google, where we keep our client records.</li>
            <li>Zoho, which we use to send invoices.</li>
            <li>WhatsApp, which we use to message you.</li>
          </ul>

          <h2>Stopping messages</h2>
          <p>
            We may message you when your EICR is due. Reply STOP to any message, any time, and we will
            not message you again.
          </p>

          <h2>How long we keep them</h2>
          <p>
            We keep your details only as long as we need them for the job, and for as long as the law
            requires us to keep business and tax records.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask to see the details we hold about you, ask us to correct them, or ask us to delete
            them.
            {email && (
              <>
                {" "}To do any of these, email{" "}
                <a href={`mailto:${email}`} className="text-action-soft underline underline-offset-2 hover:text-white">
                  {email}
                </a>
                .
              </>
            )}
          </p>

          <h2>Complaints</h2>
          <p>
            If you are unhappy with how we use your details, you can complain to the Information
            Commissioner&apos;s Office (ICO) at{" "}
            <a href="https://ico.org.uk" className="text-action-soft underline underline-offset-2 hover:text-white">
              ico.org.uk
            </a>
            .
          </p>
        </article>
      </main>
      <Footer businessName={business.name} phone={contact.phone} telLink={contact.telLink} email={contact.email} serviceArea={contact.serviceArea} accreditations={accreditations} whatsapp={contact.whatsapp} />
      <StickyCall phone={contact.phone} telLink={contact.telLink} />
    </div>
  );
}
