"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { RecruiterSubmissionForm } from "@/components/RecruiterSubmissionForm";
import { Footer } from "@/components/Footer";
import { CountryCode } from "@/types/recruiter";

export default function SubmitPage() {
  const [currentCountry] = useState<CountryCode>("in"); // Default country

  return (
    <div className="min-h-screen bg-background">
      <Header currentCountry={currentCountry} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="h1 mb-4">Add Your Recruiter Profile</h1>
            <p className="text-large text-[#666666] max-w-2xl mx-auto">
              Join our directory of verified technical recruiters. Help job
              seekers find you and grow your network. Your submission will be
              reviewed and approved before going live.
            </p>
          </div>

          <RecruiterSubmissionForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
