import Image from "next/image";
import { ImageBackdrop } from "./image-backdrop";
import { OrganismField } from "./organism-field";
import { PointerProximityField } from "./pointer-proximity-field";
import { VideoPlayer } from "./video-player";

export default function Home() {
  return (
    <PointerProximityField>
      <ImageBackdrop />
      <OrganismField />
      <div className="noiseOverlay" aria-hidden="true" />
      <Image
        className="partnerLogo partnerLogoVyby"
        src="/vyby-logo-v2.png"
        alt="Vyby"
        width={530}
        height={371}
        sizes="(max-aspect-ratio: 4/5) 42vw, 34vw"
      />
      <Image
        className="partnerLogo partnerLogoPti"
        src="/pti-logo.png"
        alt="Positive Technology Institute"
        width={454}
        height={423}
        sizes="(max-aspect-ratio: 4/5) 42vw, 34vw"
      />
      <Image
        className="filmLogo"
        src="/imaginal-logo.png"
        alt="Imaginal"
        width={1254}
        height={143}
        sizes="(max-width: 640px) 84vw, (max-width: 1440px) 56vw, 720px"
        priority
      />
      <VideoPlayer />
    </PointerProximityField>
  );
}
