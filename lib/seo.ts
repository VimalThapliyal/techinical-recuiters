import { Metadata } from "next";
import { CountryCode } from "@/types/recruiter";
import { COUNTRY_INFO } from "@/lib/subdomain";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://techinical-recuiters.vercel.app";
const SITE_NAME = "Recruiter Directory";
const DEFAULT_DESCRIPTION =
  "Find and connect with top technical recruiters worldwide. Browse verified recruiter profiles by country, specialization, and company. Free directory for job seekers.";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  country?: CountryCode;
  noindex?: boolean;
}

export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [
    "technical recruiters",
    "IT recruiters",
    "software engineering recruiters",
    "tech recruitment",
    "job recruiters",
    "recruiter directory",
    "find recruiters",
    "technical hiring",
    "IT jobs",
    "software jobs",
  ],
  image = `${SITE_URL}/og-image.png`,
  url,
  type = "website",
  country,
  noindex = false,
}: SEOProps): Metadata {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Find Technical Recruiters Worldwide`;

  const countryInfo = country ? COUNTRY_INFO[country] : null;
  const countryDescription = countryInfo
    ? `Find technical recruiters in ${countryInfo.name}. ${description}`
    : description;

  const fullUrl = url || SITE_URL;

  return {
    title: fullTitle,
    description: countryDescription,
    keywords: keywords.join(", "),
    authors: [{ name: "Vimal Thapliyal" }],
    creator: "Vimal Thapliyal",
    publisher: SITE_NAME,
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type,
      url: fullUrl,
      title: fullTitle,
      description: countryDescription,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: countryDescription,
      images: [image],
      creator: "@recruiterdir",
    },
    alternates: {
      canonical: fullUrl,
    },
    metadataBase: new URL(SITE_URL),
    verification: {
      // Add Google Search Console verification if you have it
      // google: "your-google-verification-code",
    },
  };
}

export function generateStructuredData(props: {
  type: "Organization" | "WebSite" | "CollectionPage" | "ProfilePage";
  title: string;
  description: string;
  url: string;
  country?: CountryCode;
}) {
  const { type, title, description, url, country } = props;
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url,
  };

  if (type === "Organization") {
    return {
      ...baseData,
      "@type": "Organization",
      logo: `${SITE_URL}/icon.svg`,
      sameAs: ["https://www.linkedin.com/in/vimal-thapliyal/"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        availableLanguage: ["English"],
      },
    };
  }

  if (type === "WebSite") {
    return {
      ...baseData,
      "@type": "WebSite",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/{country}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };
  }

  if (type === "CollectionPage" && country) {
    const countryInfo = COUNTRY_INFO[country];
    return {
      ...baseData,
      "@type": "CollectionPage",
      about: {
        "@type": "Thing",
        name: `Technical Recruiters in ${countryInfo.name}`,
      },
      mainEntity: {
        "@type": "ItemList",
        name: `Recruiters in ${countryInfo.name}`,
      },
    };
  }

  return baseData;
}
