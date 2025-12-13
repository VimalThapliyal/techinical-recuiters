"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { COUNTRY_INFO } from "@/lib/subdomain";

export function Footer() {
  return (
    <footer className="relative border-t border-[#e0e0e0] bg-[#f3f2ef] py-12 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0077b5] to-[#00d4ff] flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-[#000000]">
                  Recruiter Directory
                </span>
              </div>
              <p className="text-sm text-[#666666]">
                Your free gateway to finding the perfect technical recruiter for
                your career.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#000000] mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-[#666666]">
                <li>
                  <Link
                    href="/in"
                    className="hover:text-[#0077b5] transition-colors"
                  >
                    Browse Recruiters
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="hover:text-[#0077b5] transition-colors"
                  >
                    Create Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#000000] mb-4">Countries</h4>
              <ul className="space-y-2 text-sm text-[#666666]">
                {Object.values(COUNTRY_INFO).map((country) => (
                  <li key={country.code}>
                    <Link
                      href={`/${country.code}`}
                      className="hover:text-[#0077b5] transition-colors"
                    >
                      {country.flag} {country.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-[#e0e0e0] pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-6 text-sm text-[#666666]">
                <Link
                  href="/privacy"
                  className="hover:text-[#0077b5] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-[#0077b5] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-[#666666]">
                © {new Date().getFullYear()} Recruiter Directory. All rights
                reserved.
              </p>
              <p className="text-sm text-[#666666]">
                Designed and concept by{" "}
                <a
                  href="https://www.linkedin.com/in/vimal-thapliyal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077b5] hover:text-[#004182] font-semibold transition-colors underline decoration-[#0077b5]/50 hover:decoration-[#004182]"
                >
                  Vimal Thapliyal
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
