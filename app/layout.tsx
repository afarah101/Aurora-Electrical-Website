import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { accreditations, business, contact, services } from "./content";
import { SITE_URL, myBuilderProfile } from "./site-url";

/**
 * Ledger type: headings use a book serif (Georgia stack, set in
 * globals.css), IBM Plex Sans carries body copy, IBM Plex Mono marks
 * figures such as ratings and the gallery counter.
 *
 * Both faces are self-hosted from app/fonts (latin subset, from
 * @fontsource, SIL OFL 1.1 — see app/fonts/OFL.txt), so the build
 * never calls Google's font servers.
 */
const plexSans = localFont({
  variable: "--font-plex-sans",
  src: [
    { path: "./fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
});

const plexMono = localFont({
  variable: "--font-plex-mono",
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
});

const description = `${business.name} - electrical work for homes and businesses${
  contact.serviceArea ? ` in ${contact.serviceArea}` : ""
}. Rewiring, fuse boards, fault-finding, lighting and installations. Free no-obligation quotes.`;

export const metadata: Metadata = {
  /* Absolute base for social images — WhatsApp/Facebook require full URLs. */
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: `${business.name} - Domestic & Commercial Electricians`,
    template: `%s | ${business.name}`,
  },
  description,
  openGraph: {
    title: `${business.name} - Domestic & Commercial Electricians`,
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
    title: `${business.name} - Domestic & Commercial Electricians`,
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
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
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
