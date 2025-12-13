import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Privacy Policy - Recruiter Directory",
  description:
    "Read our privacy policy to understand how we collect, use, and protect your information on Recruiter Directory.",
  keywords: ["privacy policy", "data protection", "user privacy"],
  url: `${
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://techinical-recuiters.vercel.app"
  }/privacy`,
  type: "website",
});
