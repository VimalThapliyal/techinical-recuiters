export interface Recruiter {
  id: string;
  name: string;
  country: string;
  company: string;
  specialization: string[];
  experience: string;
  bio: string;
  linkedinUrl: string;
  imageUrl?: string;
}

export type CountryCode = "us" | "uk" | "ca" | "au" | "in";

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
}
