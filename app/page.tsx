import Image from "next/image";
import { Countdown } from "./countdown";
import { ImageBackdrop } from "./image-backdrop";
import { OrganismField } from "./organism-field";
import { PartnerLinks } from "./partner-links";
import { PointerProximityField } from "./pointer-proximity-field";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  YOUTUBE_URL,
} from "./site-metadata";
import { VideoPlayer } from "./video-player";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: "Imaginal",
    },
    {
      "@type": "Movie",
      "@id": `${SITE_URL}/#movie`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/imaginal-background.jpg`,
      sameAs: [YOUTUBE_URL],
      creator: [
        {
          "@type": "Organization",
          name: "Vyby",
          url: "https://vyby.com",
        },
        {
          "@type": "Organization",
          name: "Positive Technology Institute",
          url: "https://www.positivetechinstitute.org",
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <PointerProximityField>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <ImageBackdrop />
      <OrganismField />
      <div className="noiseOverlay" aria-hidden="true" />
      <section className="seoIntroduction">
        <h1>{SITE_NAME}</h1>
        <p>{SITE_DESCRIPTION}</p>
      </section>
      <PartnerLinks />
      <Image
        className="filmLogo"
        src="/imaginal-logo.png"
        alt="Imaginal"
        width={1254}
        height={143}
        sizes="(max-width: 640px) 84vw, (max-width: 1440px) 56vw, 720px"
        priority
      />
      <Countdown />
      <VideoPlayer />
    </PointerProximityField>
  );
}
