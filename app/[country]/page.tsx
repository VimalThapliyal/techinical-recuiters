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
import { sortRecruiters, SortOption, Statistics } from "@/lib/data";
import { StatisticsDashboard } from "@/components/StatisticsDashboard";
import { calculateMatchScore } from "@/lib/matching";
import { Footer } from "@/components/Footer";
import { Statistics as StatisticsType } from "@/lib/data";
import { generateStructuredData } from "@/lib/seo";
import { COUNTRY_INFO } from "@/lib/subdomain";

const ITEMS_PER_PAGE = 12;

export default function CountryPage() {
  const params = useParams();
  const countryParam = params?.country as string;
  const country = (
    isValidCountryCode(countryParam) ? countryParam : "in"
  ) as CountryCode;

  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statistics, setStatistics] = useState<StatisticsType>({
    total: 0,
    withPhotos: 0,
    withoutPhotos: 0,
    topCompanies: [],
    topSpecializations: [],
    experienceDistribution: { "1-3": 0, "3-5": 0, "5-10": 0, "10+": 0 },
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [matchScores, setMatchScores] = useState<Map<string, number>>(
    new Map()
  );

  const countryInfo = COUNTRY_INFO[country];
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://techinical-recuiters.vercel.app";

  // Add structured data for SEO
  useEffect(() => {
    const collectionSchema = generateStructuredData({
      type: "CollectionPage",
      title: `Technical Recruiters in ${countryInfo.name}`,
      description: `Find and connect with technical recruiters in ${countryInfo.name}. Browse verified recruiter profiles by specialization and company.`,
      url: `${siteUrl}/${country}`,
      country,
    });

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(collectionSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [country, countryInfo.name, siteUrl]);

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

  // Debounce search query to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);


  // Fetch recruiters with server-side pagination and filtering
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams({
          country,
          page: String(currentPage),
          limit: String(ITEMS_PER_PAGE),
          sortBy,
        });

        if (debouncedSearchQuery.trim()) {
          params.append("q", debouncedSearchQuery);
        }
        if (selectedSpecialization !== "all") {
          params.append("specialization", selectedSpecialization);
        }
        if (selectedCompany !== "all") {
          params.append("company", selectedCompany);
        }

        const response = await fetch(`/api/recruiters?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();

        setRecruiters(data.recruiters || []);
        setTotalCount(data.total || 0);
        setTotalPages(data.totalPages || 0);

        // Update specializations and companies if provided (only on first page)
        if (data.specializations && data.specializations.length > 0) {
          setSpecializations(data.specializations);
        }
        if (data.companies && data.companies.length > 0) {
          setCompanies(data.companies);
        }

        // Update statistics if provided
        if (data.statistics) {
          setStatistics(data.statistics);
        }
      } catch (error) {
        console.error("Failed to fetch recruiters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [country, currentPage, debouncedSearchQuery, selectedSpecialization, selectedCompany, sortBy]);

  // Calculate match scores for current page of recruiters only
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

  // Reset to page 1 when filters change (but not on initial load)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, selectedSpecialization, selectedCompany, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentCountry={country}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="h1 mb-2">
                Technical Recruiters in {countryInfo.name} {countryInfo.flag}
              </h1>
              <p className="text-large text-[#666666] leading-relaxed">
                Connect with top technical recruiters in {countryInfo.name}.
                Browse {statistics.total} verified recruiter profiles.
              </p>
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-1">
            <div className="sticky top-20">
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
            <div className="mb-8">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-small text-[#666666] font-medium">
                Showing{" "}
                <span className="font-semibold text-[#000000]">
                  {recruiters.length > 0
                    ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                    : 0}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-[#000000]">
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    totalCount
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#000000]">
                  {totalCount}
                </span>{" "}
                recruiters
              </div>
            </div>
            <RecruiterGrid
              recruiters={recruiters}
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
