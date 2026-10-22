import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The exam and results screens are personal; everything else may be indexed.
    rules: { userAgent: "*", allow: "/", disallow: ["/exam", "/results", "/practice/session"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
