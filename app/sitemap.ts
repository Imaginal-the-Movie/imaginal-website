import type { MetadataRoute } from "next";
import {
  SITE_URL,
  VIDEO_DESCRIPTION,
  VIDEO_THUMBNAIL_URL,
  VIDEO_TITLE,
  VIDEO_UPLOAD_DATE,
  YOUTUBE_EMBED_URL,
} from "./site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE_URL}/imaginal-background.jpg`],
    },
    {
      url: `${SITE_URL}/watch`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      videos: [
        {
          title: VIDEO_TITLE,
          thumbnail_loc: VIDEO_THUMBNAIL_URL,
          description: VIDEO_DESCRIPTION,
          player_loc: YOUTUBE_EMBED_URL,
          duration: 199,
          publication_date: VIDEO_UPLOAD_DATE,
          family_friendly: "yes",
          uploader: {
            content: "Imaginal The Movie",
            info: "https://www.youtube.com/@imaginalthemovie",
          },
          tag: "AI film",
        },
      ],
    },
  ];
}
