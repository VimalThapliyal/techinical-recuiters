/**
 * Script to parse LinkedIn HTML and extract recruiter data
 * Updates JSON files with real LinkedIn profile URLs and images
 * 
 * Usage: node scripts/parse-linkedin-html.js <input-file> <country-code>
 * Example: node scripts/parse-linkedin-html.js recuiter.txt in
 */

const fs = require('fs');
const path = require('path');

// Country mapping
const COUNTRY_MAP = {
  us: 'US',
  uk: 'UK',
  ca: 'CA',
  au: 'AU',
  in: 'IN',
};

// Location to country mapping (for auto-detection)
const LOCATION_TO_COUNTRY = {
  'india': 'in',
  'united states': 'us',
  'usa': 'us',
  'united kingdom': 'uk',
  'uk': 'uk',
  'canada': 'ca',
  'australia': 'au',
  'meerut': 'in',
  'gurugram': 'in',
  'delhi': 'in',
  'mumbai': 'in',
  'bangalore': 'in',
  'hyderabad': 'in',
  'pune': 'in',
  'chennai': 'in',
  'kolkata': 'in',
};

function extractRecruitersFromHTML(htmlContent) {
  const recruiters = [];
  
  // Split by HR tags or data-view-name="people-search-result" sections
  const sections = htmlContent.split(/<hr[^>]*>|<div[^>]*data-view-name="people-search-result"[^>]*>/);
  
  sections.forEach((section, index) => {
    if (index === 0) return; // Skip first section
    
    try {
      const recruiter = {};
      
      // CRITICAL: First check if this profile contains "recruiter" terms
      // This ensures we only extract actual recruiters, not random LinkedIn profiles
      const sectionLower = section.toLowerCase();
      const hasRecruiterTerm = sectionLower.includes('recruiter') || 
                               sectionLower.includes('talent acquisition') ||
                               sectionLower.includes('recruitment') ||
                               sectionLower.includes('hiring') ||
                               sectionLower.includes('staffing');
      
      if (!hasRecruiterTerm) {
        // Try to get name for logging
        const nameMatch = section.match(/aria-label="([^"]+)"/) || 
                         section.match(/data-view-name="search-result-lockup-title">([^<]+)</);
        const profileName = nameMatch ? nameMatch[1].trim() : 'Unknown';
        console.log(`⏭️  Skipping ${profileName} - not a recruiter profile`);
        return; // Skip this profile - not a recruiter
      }
      
      // Extract LinkedIn profile URL - look for href with linkedin.com/in/
      const profileMatch = section.match(/href="(https:\/\/www\.linkedin\.com\/in\/[^"]+)"/);
      if (!profileMatch) return; // Skip if no LinkedIn URL found
      
      recruiter.linkedinUrl = profileMatch[1];
      
      // Extract name from aria-label (most reliable)
      const nameMatch = section.match(/aria-label="([^"]+)"/);
      if (nameMatch) {
        recruiter.name = nameMatch[1].trim();
      } else {
        // Fallback: extract from link text
        const nameLinkMatch = section.match(/data-view-name="search-result-lockup-title">([^<]+)</);
        if (nameLinkMatch) {
          recruiter.name = nameLinkMatch[1].trim();
        }
      }
      
      // Extract profile image - look for the main profile image (not mutual connections)
      // The main image is usually in a figure with aria-label matching the name
      const imageMatches = section.matchAll(/src="(https:\/\/media\.licdn\.com\/dms\/image\/[^"]+)"/g);
      let imageArray = Array.from(imageMatches);
      if (imageArray.length > 0) {
        // Use the first image (main profile image)
        recruiter.imageUrl = imageArray[0][1]
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"');
      }
      
      // Extract title/role - look for patterns like "Technical Recruiter at @Company"
      const titleMatch = section.match(/(Technical Recruiter|Talent Acquisition[^<]*|Recruiter[^<]*)/i);
      if (titleMatch) {
        recruiter.title = titleMatch[1].trim();
      }
      
      // Extract company - multiple patterns
      // Pattern 1: "Current: <strong>Technical</strong> <strong>Recruiter</strong> at COMPANY"
      let companyMatch = section.match(/Current:.*?<strong>.*?<\/strong>.*?at\s+([A-Z][^<]+)/i);
      
      // Pattern 2: "Technical Recruiter at @Company" or "at Company"
      if (!companyMatch) {
        companyMatch = section.match(/(?:Technical Recruiter|Talent Acquisition[^<]*)\s+at\s+@?([A-Z][^<&]+?)(?:\s|,|&amp;|<\/|\.)/i);
      }
      
      // Pattern 3: "Talent Acquisition Specialist - Deloitte - Technical Recruiter"
      if (!companyMatch) {
        companyMatch = section.match(/Talent Acquisition Specialist[^<]*-\s*([A-Z][^<]+?)(?:\s*-\s*Technical Recruiter)/i);
      }
      
      // Pattern 4: "Senior Specialist Recruitment at AMH Group & Faculty at..."
      if (!companyMatch) {
        companyMatch = section.match(/Senior Specialist Recruitment at\s+([A-Z][^<&]+?)(?:\s*&amp;|\s*&|<\/)/i);
      }
      
      if (companyMatch) {
        recruiter.company = companyMatch[1].trim().replace(/&amp;/g, '&').replace(/@/g, '').replace(/\s+/g, ' ');
      }
      
      // Extract location - look for patterns like "City, State, Country"
      const locationMatch = section.match(/([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)*),\s*([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)*),\s*(India|United States|UK|Canada|Australia)/i) ||
                           section.match(/([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)*),\s*(India|United States|UK|Canada|Australia)/i);
      if (locationMatch) {
        recruiter.location = locationMatch[0].trim();
      }
      
      // Determine country from location
      if (recruiter.location) {
        const locationLower = recruiter.location.toLowerCase();
        for (const [key, countryCode] of Object.entries(LOCATION_TO_COUNTRY)) {
          if (locationLower.includes(key)) {
            recruiter.country = COUNTRY_MAP[countryCode];
            recruiter.countryCode = countryCode;
            break;
          }
        }
      }
      
      // Extract specializations/skills - be careful not to pick up mutual connections
      // Look for "Skills:" followed by a strong tag, but avoid if it's near "mutual connections"
      const skillsSection = section.split(/mutual connections/i)[0]; // Only look before mutual connections
      const skillsMatch = skillsSection.match(/Skills:.*?<strong>([^<]+)<\/strong>/i);
      
      if (skillsMatch) {
        const skill = skillsMatch[1].trim();
        // Only use if it doesn't look like a person's name or connection text
        if (!skill.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/) && 
            !skill.toLowerCase().includes('mutual') && 
            !skill.toLowerCase().includes('connection') &&
            !skill.match(/^\d+/)) {
          recruiter.skills = [skill + ' Recruiting'];
        } else {
          // Default specializations based on title
          if (recruiter.title && recruiter.title.toLowerCase().includes('technical')) {
            recruiter.skills = ['Technical Recruiting', 'IT Recruitment', 'Talent Acquisition'];
          } else {
            recruiter.skills = ['Technical Recruiting', 'Talent Acquisition'];
          }
        }
      } else {
        // Default specializations based on title
        if (recruiter.title && recruiter.title.toLowerCase().includes('technical')) {
          recruiter.skills = ['Technical Recruiting', 'IT Recruitment', 'Talent Acquisition'];
        } else {
          recruiter.skills = ['Technical Recruiting', 'Talent Acquisition'];
        }
      }
      
      // Only add if we have essential data
      if (recruiter.name && recruiter.linkedinUrl) {
        recruiters.push(recruiter);
      }
    } catch (error) {
      console.error(`Error parsing section ${index}:`, error.message);
    }
  });
  
  return recruiters;
}

// Normalize LinkedIn URL to handle variations (trailing slashes, query params, etc.)
function normalizeLinkedInUrl(url) {
  if (!url) return '';
  // Remove trailing slash, query params, and hash
  return url.split('?')[0].split('#')[0].replace(/\/$/, '').toLowerCase();
}

// Check if a recruiter is a duplicate
function isDuplicate(recruiter, existingData) {
  const normalizedUrl = normalizeLinkedInUrl(recruiter.linkedinUrl);
  const normalizedName = recruiter.name ? recruiter.name.toLowerCase().trim() : '';
  
  return existingData.some((existing) => {
    // Check by normalized LinkedIn URL (most reliable)
    const existingNormalizedUrl = normalizeLinkedInUrl(existing.linkedinUrl);
    if (normalizedUrl && existingNormalizedUrl && normalizedUrl === existingNormalizedUrl) {
      return true;
    }
    
    // Check by exact name match (case-insensitive)
    const existingName = existing.name ? existing.name.toLowerCase().trim() : '';
    if (normalizedName && existingName && normalizedName === existingName) {
      // Also check if company matches (to avoid false positives with common names)
      const existingCompany = existing.company ? existing.company.toLowerCase().trim() : '';
      const recruiterCompany = recruiter.company ? recruiter.company.toLowerCase().trim() : '';
      if (recruiterCompany && existingCompany && recruiterCompany === existingCompany) {
        return true;
      }
    }
    
    return false;
  });
}

function updateJSONFile(recruiters, countryCode) {
  const filePath = path.join(__dirname, '..', 'data', `${countryCode.toLowerCase()}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let addedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  
  recruiters.forEach((recruiter) => {
    // Check if this is a duplicate
    if (isDuplicate(recruiter, existingData)) {
      console.log(`⏭️  Skipping ${recruiter.name} - duplicate entry already exists`);
      skippedCount++;
      return;
    }
    
    // Find existing recruiter by normalized LinkedIn URL
    const normalizedUrl = normalizeLinkedInUrl(recruiter.linkedinUrl);
    const existingIndex = existingData.findIndex(
      (r) => normalizeLinkedInUrl(r.linkedinUrl) === normalizedUrl
    );
    
    const existingRecruiter = existingIndex >= 0 ? existingData[existingIndex] : null;
    
    const recruiterData = {
      id: existingRecruiter 
        ? existingRecruiter.id 
        : `${countryCode.toLowerCase()}-${existingData.length + 1}`,
      name: recruiter.name,
      country: recruiter.country || COUNTRY_MAP[countryCode],
      company: recruiter.company || 'Unknown Company',
      specialization: recruiter.skills || ['Technical Recruiting', 'Talent Acquisition'],
      experience: existingRecruiter 
        ? existingRecruiter.experience 
        : '5+ years',
      bio: existingRecruiter && existingRecruiter.bio
        ? existingRecruiter.bio
        : `${recruiter.title || 'Technical Recruiter'}${recruiter.company ? ` at ${recruiter.company}` : ''}.${recruiter.location ? ` Based in ${recruiter.location}.` : ''}`,
      linkedinUrl: recruiter.linkedinUrl,
      imageUrl: recruiter.imageUrl || (existingRecruiter ? existingRecruiter.imageUrl : undefined),
    };
    
    if (existingRecruiter) {
      // Update existing recruiter
      console.log(`🔄 Updating: ${recruiter.name}`);
      existingData[existingIndex] = { ...existingRecruiter, ...recruiterData };
      updatedCount++;
    } else {
      // Add new recruiter
      console.log(`➕ Adding: ${recruiter.name}`);
      existingData.push(recruiterData);
      addedCount++;
    }
  });
  
  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
  console.log(`\n✅ Summary:`);
  console.log(`   - Added: ${addedCount} new recruiters`);
  console.log(`   - Updated: ${updatedCount} existing recruiters`);
  console.log(`   - Skipped: ${skippedCount} duplicates`);
  console.log(`   - Total in file: ${existingData.length} recruiters`);
}

// Main execution
const inputFile = process.argv[2] || 'recuiter.txt';
const countryCode = process.argv[3] || 'in';

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  console.error('Usage: node scripts/parse-linkedin-html.js <input-file> <country-code>');
  process.exit(1);
}

console.log(`Reading ${inputFile}...`);
const htmlContent = fs.readFileSync(inputFile, 'utf8');

console.log('Extracting recruiter data...');
const recruiters = extractRecruitersFromHTML(htmlContent);

console.log(`\nFound ${recruiters.length} recruiters:`);
recruiters.forEach((r, i) => {
  console.log(`${i + 1}. ${r.name} - ${r.company || 'Unknown'} - ${r.linkedinUrl}`);
});

if (recruiters.length > 0) {
  console.log(`\nUpdating ${countryCode.toUpperCase()} JSON file...`);
  updateJSONFile(recruiters, countryCode);
  console.log('\n✅ Done!');
} else {
  console.log('\n⚠️  No recruiters found in HTML. Please check the input file format.');
}

