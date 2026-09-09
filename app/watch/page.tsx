import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  VIDEO_DESCRIPTION,
  VIDEO_DURATION,
  VIDEO_THUMBNAIL_URL,
  VIDEO_TITLE,
  VIDEO_UPLOAD_DATE,
  YOUTUBE_EMBED_URL,
  YOUTUBE_URL,
} from "../site-metadata";
import styles from "./watch.module.css";

const WATCH_URL = `${SITE_URL}/watch`;

export const metadata: Metadata = {
  title: VIDEO_TITLE,
  description: VIDEO_DESCRIPTION,
  alternates: {
    canonical: "/watch",
  },
  openGraph: {
    type: "video.other",
    url: "/watch",
    siteName: SITE_NAME,
    title: VIDEO_TITLE,
    description: VIDEO_DESCRIPTION,
    images: [
      {
        url: VIDEO_THUMBNAIL_URL,
        width: 480,
        height: 360,
        alt: VIDEO_TITLE,
      },
    ],
    videos: [YOUTUBE_EMBED_URL],
  },
  twitter: {
    card: "summary_large_image",
    title: VIDEO_TITLE,
    description: VIDEO_DESCRIPTION,
    images: [VIDEO_THUMBNAIL_URL],
  },
};

const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "@id": `${WATCH_URL}#video`,
  name: VIDEO_TITLE,
  description: VIDEO_DESCRIPTION,
  thumbnailUrl: [VIDEO_THUMBNAIL_URL],
  uploadDate: VIDEO_UPLOAD_DATE,
  duration: VIDEO_DURATION,
  embedUrl: YOUTUBE_EMBED_URL,
  url: YOUTUBE_URL,
  mainEntityOfPage: WATCH_URL,
  isPartOf: {
    "@type": "Movie",
    "@id": `${SITE_URL}/#movie`,
    name: SITE_NAME,
    image: VIDEO_THUMBNAIL_URL,
  },
};

export default function WatchPage() {
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <h1 className={styles.title}>{VIDEO_TITLE}</h1>
      <iframe
        className={styles.player}
        src={`${YOUTUBE_EMBED_URL}?controls=1&playsinline=1&rel=0`}
        title={VIDEO_TITLE}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </main>
  );
}
