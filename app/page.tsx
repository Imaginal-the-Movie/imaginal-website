import Image from "next/image";
import { Countdown } from "./countdown";
import { ImageBackdrop } from "./image-backdrop";
import { OrganismField } from "./organism-field";
import { PartnerLinks } from "./partner-links";
import { PointerProximityField } from "./pointer-proximity-field";
import { VideoPlayer } from "./video-player";

export default function Home() {
  return (
    <PointerProximityField>
      <ImageBackdrop />
      <OrganismField />
      <div className="noiseOverlay" aria-hidden="true" />
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
