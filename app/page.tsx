import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { WorkGallery } from "@/components/WorkGallery";
import { Reviews } from "@/components/Reviews";
import { TrustedBy } from "@/components/TrustedBy";
import { ContactForm } from "@/components/ContactForm";
import { MyBuilderBadge } from "@/components/MyBuilderBadge";
import { EicrPricing } from "@/components/EicrPricing";
import { StickyCall } from "@/components/StickyCall";
import { Footer } from "@/components/Footer";

import {
  accreditations,
  aggregateRating,
  business,
  certificates,
  clients,
  contact,
  positioning,
  reviews,
  services,
} from "./content";

export default function Home() {
  return (
    <div id="top">
      <Nav
        businessName={business.name}
        phone={contact.phone}
        telLink={contact.telLink}
      />

      <main>
        <Hero
          businessName={business.name}
          tagline={business.tagline}
          serviceArea={contact.serviceArea}
          phone={contact.phone}
          telLink={contact.telLink}
          accreditations={accreditations}
          aggregateRating={aggregateRating}
          reviews={reviews}
        />
        <TrustBar serviceArea={contact.serviceArea} positioning={positioning} />
        <Services services={services} certificates={certificates} />
        {/* photos omitted until /public/work/ is populated — tiles render instead */}
        <WorkGallery />
        <MyBuilderBadge />
        <Reviews reviews={reviews} aggregateRating={aggregateRating} />
        <TrustedBy clients={clients} />
        <ContactForm
          email={contact.email}
          phone={contact.phone}
          telLink={contact.telLink}
          whatsapp={contact.whatsapp}
        />
        <EicrPricing />
      </main>

      <Footer
        businessName={business.name}
        phone={contact.phone}
        telLink={contact.telLink}
        email={contact.email}
        serviceArea={contact.serviceArea}
        accreditations={accreditations}
        whatsapp={contact.whatsapp}
      />

      <StickyCall phone={contact.phone} telLink={contact.telLink} />
    </div>
  );
}
