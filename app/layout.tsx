import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { accreditations, business, contact, services } from "./content";
import { SITE_URL, myBuilderProfile } from "./site-url";

/**
 * Three faces, three roles — deliberately not Inter:
 * Space Grotesk carries the headings (the page's boldness is spent there),
 * IBM Plex Sans carries body copy, and IBM Plex Mono marks technical
 * accents: eyebrow labels and the work-gallery counter.
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const description = `${business.name} — electrical work for homes and businesses${
  contact.serviceArea ? ` in ${contact.serviceArea}` : ""
}. Rewiring, fuse boards, fault-finding, lighting and installations. Free no-obligation quotes.`;

export const metadata: Metadata = {
  /* Absolute base for social images — WhatsApp/Facebook require full URLs. */
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: `${business.name} — Domestic & Commercial Electricians`,
    template: `%s | ${business.name}`,
  },
  description,
  openGraph: {
    title: `${business.name} — Domestic & Commercial Electricians`,
    description,
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    images: [
      {
        url: "/aurora-share.png",
        width: 1200,
        height: 630,
        alt: `${business.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} — Domestic & Commercial Electricians`,
    description,
    images: ["/aurora-share.png"],
  },
  robots: { index: true, follow: true },
};

/** schema.org LocalBusiness. Only confirmed fields are emitted. */
function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    name: business.name,
    description,
    url: SITE_URL,
    image: `${SITE_URL}/aurora-share.png`,
    logo: `${SITE_URL}/aurora-logo.png`,
    ...(contact.telLink ? { telephone: contact.telLink } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.serviceArea ? { areaServed: contact.serviceArea } : {}),
    ...(myBuilderProfile ? { sameAs: [myBuilderProfile] } : {}),
    ...(accreditations.length
      ? {
          hasCredential: accreditations.map((name) => ({
            "@type": "EducationalOccupationalCredential",
            name,
          })),
        }
      : {}),
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service },
    })),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
