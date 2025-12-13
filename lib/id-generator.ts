import { Recruiter } from "@/types/recruiter";

/**
 * Generate a unique, intelligent recruiter ID
 * Format: {country}-{timestamp}-{hash}
 * Example: in-1704067200000-a3f5
 */
export function generateRecruiterId(
  country: string,
  existingRecruiters: Recruiter[]
): string {
  const countryCode = country.toLowerCase();
  const timestamp = Date.now();
  
  // Generate a short hash from timestamp and random
  const hash = Math.random().toString(36).substring(2, 6);
  
  // Check if ID already exists (very unlikely but safe)
  let candidateId = `${countryCode}-${timestamp}-${hash}`;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (
    existingRecruiters.some((r) => r.id === candidateId) &&
    attempts < maxAttempts
  ) {
    const newHash = Math.random().toString(36).substring(2, 6);
    candidateId = `${countryCode}-${timestamp}-${newHash}`;
    attempts++;
  }
  
  return candidateId;
}

/**
 * Alternative: Generate ID based on name and company (more readable)
 * Format: {country}-{name-slug}-{company-slug}-{hash}
 */
export function generateReadableRecruiterId(
  country: string,
  name: string,
  company: string,
  existingRecruiters: Recruiter[]
): string {
  const countryCode = country.toLowerCase();
  
  // Create slugs from name and company
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 20);
  
  const companySlug = company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 15);
  
  const hash = Math.random().toString(36).substring(2, 5);
  
  let candidateId = `${countryCode}-${nameSlug}-${companySlug}-${hash}`;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (
    existingRecruiters.some((r) => r.id === candidateId) &&
    attempts < maxAttempts
  ) {
    const newHash = Math.random().toString(36).substring(2, 5);
    candidateId = `${countryCode}-${nameSlug}-${companySlug}-${newHash}`;
    attempts++;
  }
  
  return candidateId;
}

