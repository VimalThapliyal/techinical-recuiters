import { MetadataRoute } from "next";
import { COUNTRY_INFO } from "@/lib/subdomain";
import { CountryCode } from "@/types/recruiter";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://techinical-recuiters.vercel.app";

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Add country pages
  Object.values(COUNTRY_INFO).forEach((country) => {
    routes.push({
      url: `${baseUrl}/${country.code}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    });
  });

  return routes;
}
