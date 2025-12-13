import { Recruiter, CountryCode } from "@/types/recruiter";

// Use dynamic imports to avoid bundling large JSON files
// This only works server-side, so client components should use the API route
let dataMap: Record<CountryCode, Recruiter[]> | null = null;

async function loadDataMap(): Promise<Record<CountryCode, Recruiter[]>> {
  if (dataMap) return dataMap;

  // Only load on server-side (Node.js environment)
  if (typeof window === "undefined") {
    try {
      const { readFileSync } = await import("fs");
      const { join } = await import("path");

      const countries: CountryCode[] = ["us", "uk", "ca", "au", "in"];
      dataMap = {} as Record<CountryCode, Recruiter[]>;

      for (const country of countries) {
        try {
          const filePath = join(process.cwd(), "data", `${country}.json`);
          const fileContents = readFileSync(filePath, "utf8");
          dataMap[country] = JSON.parse(fileContents) as Recruiter[];
        } catch (error) {
          console.error(`Error loading data for ${country}:`, error);
          dataMap[country] = [];
        }
      }

      return dataMap;
    } catch (error) {
      console.error("Error loading data files:", error);
      return {
        us: [],
        uk: [],
        ca: [],
        au: [],
        in: [],
      };
    }
  }

  // Client-side: return empty, should use API route
  return {
    us: [],
    uk: [],
    ca: [],
    au: [],
    in: [],
  };
}

// Synchronous version for server-side use (API routes, server components)
function getDataMapSync(): Record<CountryCode, Recruiter[]> {
  if (dataMap) return dataMap;

  if (typeof window === "undefined") {
    try {
      const { readFileSync } = require("fs");
      const { join } = require("path");

      const countries: CountryCode[] = ["us", "uk", "ca", "au", "in"];
      dataMap = {} as Record<CountryCode, Recruiter[]>;

      for (const country of countries) {
        try {
          // Try multiple possible paths for Vercel/serverless environments
          const cwd = process.cwd();
          const possiblePaths = [
            join(cwd, "data", `${country}.json`),
            join(cwd, "..", "data", `${country}.json`),
            // For Vercel/serverless, files might be in a different location
            join("/var/task", "data", `${country}.json`), // AWS Lambda
            join("/var/runtime", "data", `${country}.json`), // AWS Lambda alternative
          ];

          // Also try __dirname if available (CommonJS)
          try {
            const dirname = __dirname;
            possiblePaths.unshift(join(dirname, "..", "data", `${country}.json`));
          } catch (e) {
            // __dirname not available (ESM), skip
          }

          let fileContents: string | null = null;
          let filePath: string | null = null;
          let lastError: Error | null = null;

          for (const path of possiblePaths) {
            try {
              fileContents = readFileSync(path, "utf8");
              filePath = path;
              break;
            } catch (e) {
              lastError = e instanceof Error ? e : new Error(String(e));
              // Try next path
              continue;
            }
          }

          if (!fileContents) {
            console.error(`❌ Could not find ${country}.json. Tried paths:`, possiblePaths);
            console.error(`   Last error:`, lastError?.message);
            console.error(`   Current working directory: ${cwd}`);
            throw new Error(`Could not find ${country}.json in any expected location. CWD: ${cwd}`);
          }

          const parsed = JSON.parse(fileContents) as Recruiter[];
          dataMap[country] = parsed;
          console.log(`✅ Loaded ${parsed.length} recruiters for ${country} from ${filePath}`);
        } catch (error) {
          console.error(`❌ Error loading data for ${country}:`, error);
          dataMap[country] = [];
        }
      }

      return dataMap;
    } catch (error) {
      console.error("❌ Error loading data files:", error);
      return {
        us: [],
        uk: [],
        ca: [],
        au: [],
        in: [],
      };
    }
  }

  return {
    us: [],
    uk: [],
    ca: [],
    au: [],
    in: [],
  };
}

export function getRecruitersByCountry(country: CountryCode): Recruiter[] {
  try {
    const dataMap = getDataMapSync();
    const recruiters = dataMap[country];
    if (!recruiters || !Array.isArray(recruiters)) {
      console.warn(`⚠️  No recruiters found for ${country} in dataMap`);
      return [];
    }
    return recruiters;
  } catch (error) {
    console.error(`❌ Error in getRecruitersByCountry for ${country}:`, error);
    return [];
  }
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
  const dataMap = getDataMapSync();
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
    if (recruiter && recruiter.specialization && Array.isArray(recruiter.specialization)) {
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
  sortBy: SortOption
): Recruiter[] {
  const sorted = [...recruiters];

  switch (sortBy) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "company-asc":
      return sorted.sort((a, b) => a.company.localeCompare(b.company));
    case "company-desc":
      return sorted.sort((a, b) => b.company.localeCompare(a.company));
    case "experience-asc":
      return sorted.sort((a, b) => {
        const aYears = extractYears(a.experience);
        const bYears = extractYears(b.experience);
        return aYears - bYears;
      });
    case "experience-desc":
      return sorted.sort((a, b) => {
        const aYears = extractYears(a.experience);
        const bYears = extractYears(b.experience);
        return bYears - aYears;
      });
    case "match-desc":
      // Match score sorting is handled in the component with matchScores Map
      // Return as-is here, will be sorted in the component
      return sorted;
    default:
      return sorted;
  }
}

function extractYears(experience: string): number {
  // Extract number from strings like "5+ years", "3-5 years", "10+ years"
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
