import { NextRequest, NextResponse } from "next/server";
import {
  getRecruitersByCountry,
  searchRecruiters,
  getAllSpecializations,
  getStatistics,
  sortRecruiters,
  SortOption,
  getAllCompanies,
} from "@/lib/data";
import { getCountryFromSubdomain, isValidCountryCode } from "@/lib/subdomain";
import { CountryCode } from "@/types/recruiter";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryParam = searchParams.get("country");
    const query = searchParams.get("q") || "";
    const specialization = searchParams.get("specialization") || "";
    const company = searchParams.get("company") || "";
    const sortBy = (searchParams.get("sortBy") || "name-asc") as SortOption;
    const page = parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10);
    const limit = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10);

    // Get country from subdomain or query param
    const hostname = request.headers.get("host") || "";
    let country: CountryCode = getCountryFromSubdomain(hostname);

    if (countryParam && isValidCountryCode(countryParam)) {
      country = countryParam;
    }

    // Get all recruiters for the country
    let recruiters = getRecruitersByCountry(country);

    // Apply search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      recruiters = recruiters.filter(
        (r) =>
          r.name?.toLowerCase().includes(lowerQuery) ||
          r.company?.toLowerCase().includes(lowerQuery) ||
          r.bio?.toLowerCase().includes(lowerQuery) ||
          r.specialization?.some((s) => s.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply specialization filter
    if (specialization && specialization !== "all") {
      recruiters = recruiters.filter((r) =>
        r.specialization?.some((s) =>
          s.toLowerCase().includes(specialization.toLowerCase())
        )
      );
    }

    // Apply company filter
    if (company && company !== "all") {
      recruiters = recruiters.filter(
        (r) => r.company?.toLowerCase() === company.toLowerCase()
      );
    }

    // Get total count before pagination
    const total = recruiters.length;

    // Sort recruiters
    recruiters = sortRecruiters(recruiters, sortBy);

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecruiters = recruiters.slice(startIndex, endIndex);

    // Get metadata (only on first page with no filters to avoid repeated calculations)
    let specializations: string[] = [];
    let companies: string[] = [];
    let statistics = null;

    const isFirstPageNoFilters = page === DEFAULT_PAGE && !query && specialization === "" && company === "";
    
    if (isFirstPageNoFilters) {
      // Only calculate expensive metadata on first page with no filters
      specializations = getAllSpecializations(country);
      companies = getAllCompanies(country);
      statistics = getStatistics(country);
    } else {
      // For filtered/paginated requests, extract from all recruiters (not just paginated)
      const allRecruiters = getRecruitersByCountry(country);
      const specSet = new Set<string>();
      const companySet = new Set<string>();
      
      allRecruiters.forEach((r) => {
        r.specialization?.forEach((spec) => specSet.add(spec));
        if (r.company && r.company !== "Unknown Company") {
          companySet.add(r.company);
        }
      });
      
      specializations = Array.from(specSet).sort();
      companies = Array.from(companySet).sort();
    }

    const response = NextResponse.json({
      recruiters: paginatedRecruiters,
      country,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
      specializations,
      companies,
      statistics,
    });

    // Add cache headers for better performance
    // Cache filtered results for 5 minutes, unfiltered for 1 hour
    const cacheMaxAge = isFirstPageNoFilters ? 3600 : 300;
    response.headers.set(
      "Cache-Control",
      `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=600`
    );

    return response;
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch recruiters",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
