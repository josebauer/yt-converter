import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", siteConfig.url).href,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}