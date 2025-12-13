import { Recruiter, CountryCode } from "@/types/recruiter";

// Use static imports - Next.js will handle tree-shaking and code splitting
// For very large files, Vercel will handle them appropriately
import usData from "@/data/us.json";
import ukData from "@/data/uk.json";
import caData from "@/data/ca.json";
import auData from "@/data/au.json";
import inData from "@/data/in.json";

const dataMap: Record<CountryCode, Recruiter[]> = {
  us: usData as Recruiter[],
  uk: ukData as Recruiter[],
  ca: caData as Recruiter[],
  au: auData as Recruiter[],
  in: inData as Recruiter[],
};

// Data is now loaded statically at build time
// This is more reliable for Vercel serverless functions

export function getRecruitersByCountry(country: CountryCode): Recruiter[] {
  return dataMap[country] || [];
}

export function getRecruiterById(
  id: string,
  country?: CountryCode
): Recruiter | undefined {
  if (country) {
    const recruiters = getRecruitersByCountry(country);
    return recruiters.find((r) => r.id === id);
  }

  // Search across all countries if no country specified
  for (const countryCode of Object.keys(dataMap) as CountryCode[]) {
    const recruiter = dataMap[countryCode].find((r) => r.id === id);
    if (recruiter) return recruiter;
  }

  return undefined;
}

export function searchRecruiters(
  query: string,
  country: CountryCode,
  specialization?: string
): Recruiter[] {
  let recruiters = getRecruitersByCountry(country);

  // Filter by specialization if provided
  if (specialization) {
    recruiters = recruiters.filter((r) =>
      r.specialization.some((s) =>
        s.toLowerCase().includes(specialization.toLowerCase())
      )
    );
  }

  // Search by query
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    recruiters = recruiters.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.company.toLowerCase().includes(lowerQuery) ||
        r.bio.toLowerCase().includes(lowerQuery) ||
        r.specialization.some((s) => s.toLowerCase().includes(lowerQuery))
    );
  }

  return recruiters;
}

export function getAllSpecializations(country: CountryCode): string[] {
  const recruiters = getRecruitersByCountry(country);
  if (!recruiters || !Array.isArray(recruiters)) {
    return [];
  }

  const specializations = new Set<string>();

  recruiters.forEach((recruiter) => {
    if (
      recruiter &&
      recruiter.specialization &&
      Array.isArray(recruiter.specialization)
    ) {
      recruiter.specialization.forEach((spec) => specializations.add(spec));
    }
  });

  return Array.from(specializations).sort();
}

export function getAllCompanies(country: CountryCode): string[] {
  const recruiters = getRecruitersByCountry(country);
  const companies = new Set<string>();

  recruiters.forEach((recruiter) => {
    if (recruiter.company && recruiter.company !== "Unknown Company") {
      companies.add(recruiter.company);
    }
  });

  return Array.from(companies).sort();
}

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "company-asc"
  | "company-desc"
  | "experience-asc"
  | "experience-desc"
  | "match-desc";

export function sortRecruiters(
  recruiters: Recruiter[],
  sortBy: SortOption,
  matchScores?: Map<string, number>
): Recruiter[] {
  const sorted = [...recruiters];

  switch (sortBy) {
    case "name-asc":
      return sorted.sort((a, b) => {
        const aName = a?.name || "";
        const bName = b?.name || "";
        return aName.localeCompare(bName);
      });
    case "name-desc":
      return sorted.sort((a, b) => {
        const aName = a?.name || "";
        const bName = b?.name || "";
        return bName.localeCompare(aName);
      });
    case "company-asc":
      return sorted.sort((a, b) => {
        const aCompany = a?.company || "";
        const bCompany = b?.company || "";
        return aCompany.localeCompare(bCompany);
      });
    case "company-desc":
      return sorted.sort((a, b) => {
        const aCompany = a?.company || "";
        const bCompany = b?.company || "";
        return bCompany.localeCompare(aCompany);
      });
    case "experience-asc":
      return sorted.sort((a, b) => {
        const aYears = extractYears(a?.experience);
        const bYears = extractYears(b?.experience);
        return aYears - bYears;
      });
    case "experience-desc":
      return sorted.sort((a, b) => {
        const aYears = extractYears(a?.experience);
        const bYears = extractYears(b?.experience);
        return bYears - aYears;
      });
    case "match-desc":
      if (matchScores) {
        return sorted.sort((a, b) => {
          const scoreA = matchScores.get(a.id) || 0;
          const scoreB = matchScores.get(b.id) || 0;
          return scoreB - scoreA;
        });
      }
      return sorted;
    default:
      return sorted;
  }
}

function extractYears(experience: string | undefined): number {
  // Extract number from strings like "5+ years", "3-5 years", "10+ years"
  if (!experience || typeof experience !== "string") {
    return 0;
  }
  const match = experience.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export interface Statistics {
  total: number;
  withPhotos: number;
  withoutPhotos: number;
  topCompanies: Array<{ company: string; count: number }>;
  topSpecializations: Array<{ specialization: string; count: number }>;
  experienceDistribution: {
    "1-3": number;
    "3-5": number;
    "5-10": number;
    "10+": number;
  };
}

export function getStatistics(country: CountryCode): Statistics {
  const recruiters = getRecruitersByCountry(country);
  if (!recruiters || !Array.isArray(recruiters)) {
    return {
      total: 0,
      withPhotos: 0,
      withoutPhotos: 0,
      topCompanies: [],
      topSpecializations: [],
      experienceDistribution: { "1-3": 0, "3-5": 0, "5-10": 0, "10+": 0 },
    };
  }

  const total = recruiters.length;

  // Count recruiters with/without photos
  const withPhotos = recruiters.filter((r) => r.imageUrl).length;
  const withoutPhotos = total - withPhotos;

  // Top companies
  const companyCounts: Record<string, number> = {};
  recruiters.forEach((r) => {
    if (r.company && r.company !== "Unknown Company") {
      companyCounts[r.company] = (companyCounts[r.company] || 0) + 1;
    }
  });
  const topCompanies = Object.entries(companyCounts)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top specializations
  const specializationCounts: Record<string, number> = {};
  recruiters.forEach((r) => {
    if (r && r.specialization && Array.isArray(r.specialization)) {
      r.specialization.forEach((spec) => {
        specializationCounts[spec] = (specializationCounts[spec] || 0) + 1;
      });
    }
  });
  const topSpecializations = Object.entries(specializationCounts)
    .map(([specialization, count]) => ({ specialization, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Experience distribution
  const experienceDistribution = {
    "1-3": 0,
    "3-5": 0,
    "5-10": 0,
    "10+": 0,
  };

  recruiters.forEach((r) => {
    if (!r || !r.experience) return;
    const years = extractYears(r.experience);
    if (years >= 1 && years < 3) {
      experienceDistribution["1-3"]++;
    } else if (years >= 3 && years < 5) {
      experienceDistribution["3-5"]++;
    } else if (years >= 5 && years < 10) {
      experienceDistribution["5-10"]++;
    } else if (years >= 10) {
      experienceDistribution["10+"]++;
    }
  });

  return {
    total,
    withPhotos,
    withoutPhotos,
    topCompanies,
    topSpecializations,
    experienceDistribution,
  };
}
