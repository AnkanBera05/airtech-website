import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://airtech-website-gules.vercel.app";

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/leadership",
    "/careers",
    "/contact",
    "/portal-access",
    "/privacy",
    "/terms",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/services" || route === "/projects" ? 0.9 : 0.8,
  }));
}
