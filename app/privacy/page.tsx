// Draft — awaiting approval (Mohamed has not yet approved this wording).
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { StickyCall } from "@/components/StickyCall";
import { Footer } from "@/components/Footer";
import { accreditations, business, contact } from "../content";

const title = "Privacy Notice | How Aurora Electrical Uses Your Details";
const description =
  "How Aurora Electrical uses the details you give us: your name, phone number, address, email and job details, to quote, carry out the job and invoice you.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_GB",
    url: "/privacy",
    images: [{ url: "/aurora-share.png", width: 1200, height: 630, alt: `${business.name} logo` }],
  },
  // TODO: remove this noindex once Mohamed approves the wording (and the Draft comment above).
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  const email = contact.email;

  return (
    <div id="top">
      <Nav businessName={business.name} phone={contact.phone} telLink={contact.telLink} />
      <main className="bg-surface">
        <article className="mx-auto max-w-3xl space-y-6 px-5 py-16 text-ink-muted sm:py-20 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Privacy notice</h1>

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
            We store website enquiries in Google Sheets and delete each enquiry row after 1 year. With each
            website enquiry we also store the page you arrived on and any advert tags in the link (such as
            gclid or utm_source). We keep job and invoice records for as long as tax law requires.
          </p>

          <p>
            If you click Accept on our cookie banner, Google Ads sets a cookie so we can see which adverts
            bring enquiries. If you click Reject, we do not load Google Ads.
          </p>

          <p>
            You can ask to see, correct or delete your details, or complain to the ICO at{" "}
            <a href="https://ico.org.uk" className="text-action-soft underline underline-offset-2 hover:text-ink">
              ico.org.uk
            </a>
            .
            {email && (
              <>
                {" "}Contact us at{" "}
                <a href={`mailto:${email}`} className="text-action-soft underline underline-offset-2 hover:text-ink">
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
