import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/success", "/cancel"],
    },
    sitemap: "https://www.laime3d.com/sitemap.xml",
  };
}
