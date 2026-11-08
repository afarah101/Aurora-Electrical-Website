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

          <h2>Why we use them</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>To reply to your enquiry and give you a quote.</li>
            <li>To arrange and carry out the job.</li>
            <li>To send you an invoice and keep our business records.</li>
            <li>To remind you when your EICR (electrical safety certificate) is due.</li>
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
      <Footer businessName={business.name} phone={contact.phone} telLink={contact.telLink} email={contact.email} serviceArea={contact.serviceArea} accreditations={accreditations} />
      <StickyCall phone={contact.phone} telLink={contact.telLink} />
    </div>
  );
}
