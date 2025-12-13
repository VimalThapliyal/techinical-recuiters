import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Add Your Recruiter Profile - Free Directory",
  description:
    "Join our free directory of technical recruiters. Submit your profile to help job seekers find you. Get verified and grow your network.",
  keywords: [
    "add recruiter profile",
    "submit recruiter",
    "recruiter directory",
    "free recruiter listing",
    "technical recruiter profile",
  ],
  url: `${
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://techinical-recuiters.vercel.app"
  }/submit`,
  type: "website",
});
