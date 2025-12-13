"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CountryCode } from "@/types/recruiter";
import { useState } from "react";

export default function PrivacyPolicyPage() {
  const [currentCountry] = useState<CountryCode>("in");

  return (
    <div className="min-h-screen bg-background">
      <Header currentCountry={currentCountry} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="h1 mb-4">Privacy Policy</h1>
            <p className="text-large text-[#666666]">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="h2 mb-4">1. Introduction</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                Welcome to Recruiter Directory ("we," "our," or "us"). We are
                committed to protecting your privacy and ensuring the security
                of your personal information. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when
                you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="h3 mb-2">2.1 Information You Provide</h3>
                  <p className="text-base text-[#666666] leading-relaxed">
                    When you use our services, you may provide us with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-base text-[#666666] ml-4 mt-2">
                    <li>
                      Profile information (name, skills, experience, location,
                      preferences) when creating a user profile
                    </li>
                    <li>
                      Contact information (email address) when submitting a
                      recruiter profile
                    </li>
                    <li>
                      Information submitted through our recruiter submission
                      form
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="h3 mb-2">
                    2.2 Automatically Collected Information
                  </h3>
                  <p className="text-base text-[#666666] leading-relaxed">
                    We automatically collect certain information when you visit
                    our website:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-base text-[#666666] ml-4 mt-2">
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>IP address</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="h2 mb-4">3. How We Use Your Information</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-[#666666] ml-4">
                <li>
                  Provide, maintain, and improve our recruiter directory
                  services
                </li>
                <li>
                  Match job seekers with relevant recruiters based on skills and
                  preferences
                </li>
                <li>Process and review recruiter profile submissions</li>
                <li>Communicate with you about your submissions and account</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Ensure the security and integrity of our platform</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="h2 mb-4">4. Data Storage and Security</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                Your user profile information is stored locally in your browser
                using localStorage. We do not store your personal profile data
                on our servers unless you submit a recruiter profile for review.
              </p>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                We implement appropriate technical and organizational measures
                to protect your information. However, no method of transmission
                over the Internet or electronic storage is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">5. Information Sharing and Disclosure</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-[#666666] ml-4">
                <li>
                  <strong>Public Directory:</strong> Approved recruiter profiles
                  are displayed publicly in our directory
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share information
                  with trusted service providers who assist in operating our
                  website
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information if required by law or to protect our rights
                </li>
              </ul>
            </section>

            <section>
              <h2 className="h2 mb-4">6. Third-Party Links</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                Our website contains links to external websites, including
                LinkedIn profiles. We are not responsible for the privacy
                practices of these external sites. We encourage you to review
                their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">7. Your Rights and Choices</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-[#666666] ml-4">
                <li>
                  Access, update, or delete your user profile information stored
                  in your browser
                </li>
                <li>
                  Request information about your submitted recruiter profile
                </li>
                <li>Withdraw consent for data processing where applicable</li>
                <li>Opt out of certain data collection practices</li>
              </ul>
            </section>

            <section>
              <h2 className="h2 mb-4">8. Cookies and Local Storage</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                We use localStorage to store your user profile preferences
                locally in your browser. This allows us to provide personalized
                matching features without requiring server-side authentication.
                You can clear this data at any time through your browser
                settings.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">9. Children's Privacy</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personal information from
                children. If you believe we have collected information from a
                child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">11. Contact Us</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us through our website or via the
                contact information provided in your recruiter submission.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
