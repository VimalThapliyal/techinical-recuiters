import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const firaSans = Fira_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fira-sans",
  display: "swap",
});

import {
  generateMetadata as generateSEOMetadata,
  generateStructuredData,
} from "@/lib/seo";

const baseMetadata = generateSEOMetadata({
  title: "Recruiter Directory - Find Technical Recruiters",
  description:
    "Connect with top technical recruiters worldwide. Browse recruiter profiles by country and contact them directly on LinkedIn. Free directory for job seekers.",
  keywords: [
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
    "recruiters in India",
    "recruiters in USA",
    "recruiters in UK",
    "recruiters in Canada",
    "recruiters in Australia",
  ],
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://techinical-recuiters.vercel.app",
  type: "website",
});

export const metadata: Metadata = {
  ...baseMetadata,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://techinical-recuiters.vercel.app";

  const organizationSchema = generateStructuredData({
    type: "Organization",
    title: "Recruiter Directory",
    description: "Free directory of technical recruiters worldwide",
    url: siteUrl,
  });

  const websiteSchema = generateStructuredData({
    type: "WebSite",
    title: "Recruiter Directory",
    description: "Find and connect with technical recruiters",
    url: siteUrl,
  });

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${firaSans.variable} font-sans antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
