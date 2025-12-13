import { NextRequest, NextResponse } from "next/server";
import {
  getRecruitersByCountry,
  searchRecruiters,
  getAllSpecializations,
  getStatistics,
} from "@/lib/data";
import { getCountryFromSubdomain, isValidCountryCode } from "@/lib/subdomain";
import { CountryCode } from "@/types/recruiter";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryParam = searchParams.get("country");
    const query = searchParams.get("q") || "";
    const specialization = searchParams.get("specialization") || undefined;

    // Get country from subdomain or query param
    const hostname = request.headers.get("host") || "";
    let country: CountryCode = getCountryFromSubdomain(hostname);

    if (countryParam && isValidCountryCode(countryParam)) {
      country = countryParam;
    }

    // If search query or specialization filter, use search function
    if (query || specialization) {
      const results = searchRecruiters(query, country, specialization);
      return NextResponse.json({
        recruiters: results,
        country,
        total: results.length,
      });
    }

    // Otherwise return all recruiters for the country
    console.log(`📊 Fetching recruiters for country: ${country}`);
    const recruiters = getRecruitersByCountry(country);
    console.log(`✅ Found ${recruiters.length} recruiters for ${country}`);
    
    if (recruiters.length === 0) {
      console.warn(`⚠️  No recruiters found for ${country}. This might indicate a data loading issue.`);
    }
    
    const specializations = getAllSpecializations(country);
    const statistics = getStatistics(country);

    return NextResponse.json({
      recruiters,
      country,
      total: recruiters.length,
      specializations,
      statistics,
    });
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
