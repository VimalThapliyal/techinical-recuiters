"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CountryCode } from "@/types/recruiter";
import { useState } from "react";

export default function TermsPage() {
  const [currentCountry] = useState<CountryCode>("in");

  return (
    <div className="min-h-screen bg-background">
      <Header currentCountry={currentCountry} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="h1 mb-4">Terms and Conditions</h1>
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
              <h2 className="h2 mb-4">1. Acceptance of Terms</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                By accessing and using Recruiter Directory ("the Service"), you
                accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">2. Description of Service</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                Recruiter Directory is a free platform that connects job seekers
                with technical recruiters. We provide:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-[#666666] ml-4">
                <li>A searchable directory of verified technical recruiters</li>
                <li>
                  Profile matching based on skills, experience, and preferences
                </li>
                <li>Direct links to recruiter LinkedIn profiles</li>
                <li>Country-specific recruiter listings</li>
              </ul>
            </section>

            <section>
              <h2 className="h2 mb-4">3. User Accounts and Profiles</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="h3 mb-2">3.1 User Profiles</h3>
                  <p className="text-base text-[#666666] leading-relaxed">
                    Users may create profiles to receive personalized recruiter
                    matches. Profile information is stored locally in your
                    browser and is not shared with third parties without your
                    consent.
                  </p>
                </div>
                <div>
                  <h3 className="h3 mb-2">3.2 Profile Accuracy</h3>
                  <p className="text-base text-[#666666] leading-relaxed">
                    You are responsible for maintaining the accuracy of your
                    profile information. You agree to provide truthful and
                    accurate information.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="h2 mb-4">4. Recruiter Profile Submissions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="h3 mb-2">4.1 Submission Requirements</h3>
                  <p className="text-base text-[#666666] leading-relaxed mb-2">
                    When submitting a recruiter profile, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-base text-[#666666] ml-4">
                    <li>Provide accurate and truthful information</li>
                    <li>
                      Submit only profiles for which you have authorization
                    </li>
                    <li>
                      Ensure the LinkedIn profile URL is valid and accessible
                    </li>
                    <li>Comply with LinkedIn's terms of service</li>
                  </ul>
                </div>
                <div>
                  <h3 className="h3 mb-2">4.2 Review and Approval</h3>
                  <p className="text-base text-[#666666] leading-relaxed">
                    All recruiter profile submissions are subject to review and
                    approval. We reserve the right to reject or remove any
                    profile that does not meet our standards or violates these
                    terms.
                  </p>
                </div>
                <div>
                  <h3 className="h3 mb-2">4.3 Profile Ownership</h3>
                  <p className="text-base text-[#666666] leading-relaxed">
                    By submitting a recruiter profile, you represent that you
                    have the right to share this information and that it does
                    not infringe on any third-party rights.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="h2 mb-4">5. Acceptable Use</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-[#666666] ml-4">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Submit false, misleading, or fraudulent information</li>
                <li>
                  Attempt to gain unauthorized access to the Service or its
                  systems
                </li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>
                  Use automated systems to scrape or collect data from the
                  Service
                </li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </section>

            <section>
              <h2 className="h2 mb-4">6. Intellectual Property</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                The Service and its original content, features, and
                functionality are owned by Recruiter Directory and are protected
                by international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                Recruiter profile information displayed on the Service is
                provided for informational purposes. We do not claim ownership
                of recruiter profile data submitted by users.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">7. Third-Party Links and Services</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                Our Service contains links to external websites, including
                LinkedIn profiles. We are not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-[#666666] ml-4">
                <li>
                  The content, privacy policies, or practices of external
                  websites
                </li>
                <li>
                  Any transactions or interactions between you and recruiters
                  via LinkedIn or other platforms
                </li>
                <li>The accuracy or availability of external websites</li>
              </ul>
            </section>

            <section>
              <h2 className="h2 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                The Service is provided "as is" and "as available" without any
                warranties of any kind, either express or implied. We do not
                warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-[#666666] ml-4">
                <li>
                  The Service will be uninterrupted, secure, or error-free
                </li>
                <li>
                  The results obtained from using the Service will be accurate
                  or reliable
                </li>
                <li>Recruiter profiles are verified or endorsed by us</li>
                <li>Any defects or errors will be corrected</li>
              </ul>
            </section>

            <section>
              <h2 className="h2 mb-4">9. Limitation of Liability</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                To the fullest extent permitted by law, Recruiter Directory
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or
                revenues, whether incurred directly or indirectly, or any loss
                of data, use, goodwill, or other intangible losses resulting
                from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">10. Indemnification</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                You agree to defend, indemnify, and hold harmless Recruiter
                Directory and its officers, directors, employees, and agents
                from and against any claims, liabilities, damages, losses, and
                expenses, including legal fees, arising out of or in any way
                connected with your use of the Service or violation of these
                Terms.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">11. Modifications to Service</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                We reserve the right to modify, suspend, or discontinue the
                Service, or any part thereof, at any time with or without
                notice. We shall not be liable to you or any third party for any
                modification, suspension, or discontinuation of the Service.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">12. Termination</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                We may terminate or suspend your access to the Service
                immediately, without prior notice or liability, for any reason,
                including if you breach these Terms. Upon termination, your
                right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">13. Governing Law</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction in which the Service operates,
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">14. Changes to Terms</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will
                notify users of any material changes by posting the new Terms on
                this page and updating the "Last updated" date. Your continued
                use of the Service after such modifications constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="h2 mb-4">15. Contact Information</h2>
              <p className="text-base text-[#666666] leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions,
                please contact us through our website or via the contact
                information provided in your recruiter submission.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
