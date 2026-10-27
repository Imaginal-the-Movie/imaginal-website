import type { Metadata, Viewport } from "next";
import { StrategyRoom } from "./strategy-room";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: "Imaginal | The strategy room",
  description: "A transmission from 2060. Explore the world, the story and the people bringing Imaginal to life.",
  alternates: { canonical: "/strategy-room" },
  robots: { index: false, follow: false },
};

export default function StrategyRoomPage() {
  return <StrategyRoom />;
}
