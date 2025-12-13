import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Terms and Conditions - Recruiter Directory",
  description:
    "Read our terms and conditions for using Recruiter Directory. Understand the rules and guidelines for our platform.",
  keywords: ["terms and conditions", "terms of service", "user agreement"],
  url: `${
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://techinical-recuiters.vercel.app"
  }/terms`,
  type: "website",
});
