"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel } from "@/components/FilterPanel";
import { RecruiterGrid } from "@/components/RecruiterGrid";
import { Pagination } from "@/components/ui/pagination";
import { Recruiter } from "@/types/recruiter";
import { CountryCode } from "@/types/recruiter";
import { UserProfile } from "@/types/user";
import { isValidCountryCode } from "@/lib/subdomain";
import {
  getRecruitersByCountry,
  getAllSpecializations,
  getAllCompanies,
  sortRecruiters,
  SortOption,
  getStatistics,
} from "@/lib/data";
import { StatisticsDashboard } from "@/components/StatisticsDashboard";
import { calculateMatchScore } from "@/lib/matching";
import { Footer } from "@/components/Footer";

const ITEMS_PER_PAGE = 12;

export default function CountryPage() {
  const params = useParams();
  const countryParam = params?.country as string;
  const country = (
    isValidCountryCode(countryParam) ? countryParam : "us"
  ) as CountryCode;

  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statistics, setStatistics] = useState(getStatistics(country));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [matchScores, setMatchScores] = useState<Map<string, number>>(
    new Map()
  );

  // Load user profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to load user profile:", e);
      }
    }
  }, []);

  // Calculate match scores when user profile or recruiters change
  useEffect(() => {
    if (userProfile && userProfile.skills.length > 0 && recruiters.length > 0) {
      const scores = new Map<string, number>();
      recruiters.forEach((recruiter) => {
        const match = calculateMatchScore(userProfile, recruiter);
        scores.set(recruiter.id, match.score);
      });
      setMatchScores(scores);
    } else {
      setMatchScores(new Map());
    }
  }, [userProfile, recruiters]);

  useEffect(() => {
    // Load recruiters for the country
    setLoading(true);
    const countryRecruiters = getRecruitersByCountry(country);
    const countrySpecializations = getAllSpecializations(country);
    const countryCompanies = getAllCompanies(country);

    setRecruiters(countryRecruiters);
    setSpecializations(countrySpecializations);
    setCompanies(countryCompanies);
    setStatistics(getStatistics(country));
    setSearchQuery("");
    setSelectedSpecialization("all");
    setSelectedCompany("all");
    setSortBy("name-asc");
    setCurrentPage(1);
    setLoading(false);
  }, [country]);

  // Filter and sort recruiters
  const filteredAndSortedRecruiters = useMemo(() => {
    let filtered = [...recruiters];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.company.toLowerCase().includes(query) ||
          r.bio.toLowerCase().includes(query) ||
          r.specialization.some((s) => s.toLowerCase().includes(query))
      );
    }

    // Apply specialization filter
    if (selectedSpecialization !== "all") {
      filtered = filtered.filter((r) =>
        r.specialization.some((s) =>
          s.toLowerCase().includes(selectedSpecialization.toLowerCase())
        )
      );
    }

    // Apply company filter
    if (selectedCompany !== "all") {
      filtered = filtered.filter(
        (r) => r.company.toLowerCase() === selectedCompany.toLowerCase()
      );
    }

    // Sort recruiters
    let sorted = sortRecruiters(filtered, sortBy);

    // If sorting by match score, sort by match score first
    if (
      sortBy === "match-desc" &&
      userProfile &&
      userProfile.skills.length > 0
    ) {
      sorted = sorted.sort((a, b) => {
        const scoreA = matchScores.get(a.id) || 0;
        const scoreB = matchScores.get(b.id) || 0;
        if (scoreB !== scoreA) {
          return scoreB - scoreA; // Higher scores first
        }
        return a.name.localeCompare(b.name); // Then alphabetically
      });
    }

    return sorted;
  }, [
    recruiters,
    searchQuery,
    selectedSpecialization,
    selectedCompany,
    sortBy,
    userProfile,
    matchScores,
  ]);

  // Paginate results
  const paginatedRecruiters = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedRecruiters.slice(startIndex, endIndex);
  }, [filteredAndSortedRecruiters, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedRecruiters.length / ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSpecialization, selectedCompany, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentCountry={country}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10">
          <div className="mb-8">
            <h1 className="h1 mb-3 text-[#111827]">Technical Recruiters</h1>
            <p className="text-lg text-[#6b7280] leading-relaxed max-w-2xl">
              Connect with top technical recruiters in your region
            </p>
          </div>

          {/* Statistics Dashboard - Compact & Elegant */}
          <div className="mb-8">
            <StatisticsDashboard
              statistics={statistics}
              onCompanyClick={(company) => {
                setSelectedCompany(company);
                setCurrentPage(1);
              }}
              onSpecializationClick={(specialization) => {
                setSelectedSpecialization(specialization);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterPanel
                specializations={specializations}
                selectedSpecialization={selectedSpecialization}
                onSpecializationChange={setSelectedSpecialization}
                companies={companies}
                selectedCompany={selectedCompany}
                onCompanyChange={setSelectedCompany}
                sortBy={sortBy}
                onSortChange={setSortBy}
                hasUserProfile={
                  userProfile !== null && userProfile.skills.length > 0
                }
              />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="mb-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-[#6b7280] font-medium">
                Showing{" "}
                <span className="font-semibold text-[#000000]">
                  {paginatedRecruiters.length > 0
                    ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                    : 0}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-[#000000]">
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredAndSortedRecruiters.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#000000]">
                  {filteredAndSortedRecruiters.length}
                </span>{" "}
                recruiters
                {filteredAndSortedRecruiters.length !== recruiters.length && (
                  <span className="ml-2 text-[#999999]">
                    (filtered from {recruiters.length} total)
                  </span>
                )}
              </div>
            </div>
            <RecruiterGrid
              recruiters={paginatedRecruiters}
              country={country}
              viewMode={viewMode}
              loading={loading}
              matchScores={matchScores}
              showMatchScores={
                userProfile !== null && userProfile.skills.length > 0
              }
            />
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
