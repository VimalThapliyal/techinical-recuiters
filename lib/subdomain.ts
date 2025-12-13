import { CountryCode, CountryInfo } from '@/types/recruiter';

export type { CountryCode, CountryInfo };

export const COUNTRY_MAP: Record<string, CountryCode> = {
  us: 'us',
  uk: 'uk',
  ca: 'ca',
  au: 'au',
  in: 'in',
};

export const COUNTRY_INFO: Record<CountryCode, CountryInfo> = {
  us: { code: 'us', name: 'United States', flag: '🇺🇸' },
  uk: { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
  ca: { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  au: { code: 'au', name: 'Australia', flag: '🇦🇺' },
  in: { code: 'in', name: 'India', flag: '🇮🇳' },
};

export function getCountryFromSubdomain(hostname: string): CountryCode {
  // Remove port if present
  const host = hostname.split(':')[0];
  
  // Extract subdomain
  const parts = host.split('.');
  
  // Handle localhost for development
  if (host === 'localhost' || host.startsWith('127.0.0.1') || host.startsWith('192.168.')) {
    return 'in'; // Default to India for local development
  }
  
  // Check if first part is a valid country code
  const subdomain = parts[0]?.toLowerCase();
  
  if (subdomain && COUNTRY_MAP[subdomain]) {
    return COUNTRY_MAP[subdomain];
  }
  
  // Default to India if no valid subdomain
  return 'in';
}

export function isValidCountryCode(code: string): code is CountryCode {
  return code in COUNTRY_INFO;
}

