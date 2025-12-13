/**
 * Parser for individual LinkedIn profile page HTML
 * Handles HTML copied directly from LinkedIn profile pages
 * 
 * Usage: node scripts/parse-linkedin-profile-pages.js <input-file> <country-code>
 */

const fs = require('fs');
const path = require('path');

const COUNTRY_MAP = {
  us: 'US',
  uk: 'UK',
  ca: 'CA',
  au: 'AU',
  in: 'IN',
};

const LOCATION_TO_COUNTRY = {
  'india': 'in',
  'united states': 'us',
  'usa': 'us',
  'united kingdom': 'uk',
  'uk': 'uk',
  'canada': 'ca',
  'australia': 'au',
};

function extractProfilesFromHTML(htmlContent) {
  const profiles = [];
  
  // Check if this is a single profile page or multiple profiles
  // First, check if the entire content contains recruiter terms
  const contentLower = htmlContent.toLowerCase();
  const hasRecruiterTerm = contentLower.includes('recruiter') || 
                           contentLower.includes('talent acquisition') ||
                           contentLower.includes('recruitment') ||
                           contentLower.includes('hiring') ||
                           contentLower.includes('staffing');
  
  if (!hasRecruiterTerm) {
    console.log('⚠️  No recruiter terms found in HTML');
    return profiles;
  }
  
  // Try to split by sections, or treat as single profile
  let sections = htmlContent.split(/<section[^>]*class="[^"]*artdeco-card[^"]*"/);
  
  // If no sections found, treat entire content as one profile
  if (sections.length <= 1) {
    sections = [htmlContent];
  }
  
  sections.forEach((section, index) => {
    if (index === 0 && sections.length > 1) return; // Skip first section if we split
    
    try {
      const profile = {};
      
      // Check if this section contains recruiter terms
      const sectionLower = section.toLowerCase();
      const hasRecruiterInSection = sectionLower.includes('recruiter') || 
                                    sectionLower.includes('talent acquisition') ||
                                    sectionLower.includes('recruitment') ||
                                    sectionLower.includes('hiring') ||
                                    sectionLower.includes('staffing');
      
      if (!hasRecruiterInSection && sections.length > 1) {
        return; // Skip non-recruiters only if we have multiple sections
      }
      
      // Extract name from h1 tag (multiple patterns)
      const nameMatch = section.match(/<h1[^>]*class="[^"]*break-words[^"]*">([^<]+)<\/h1>/i) ||
                       section.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
                       section.match(/title="([^"]+)"[^>]*src="[^"]*media\.licdn\.com/i) ||
                       section.match(/alt="([^"]+)"[^>]*class="[^"]*pv-top-card-profile-picture/i) ||
                       section.match(/aria-label="([^"]+)"[^>]*class="[^"]*pv-top-card/);
      if (nameMatch) {
        profile.name = nameMatch[1].trim();
      }
      
      // Extract LinkedIn URL from href (multiple patterns)
      // First, try to find the main profile link (not overlay links)
      let urlMatch = section.match(/href="(\/in\/[^"\/]+)(?:\/|")/i);
      if (urlMatch) {
        let url = urlMatch[1];
        // Skip overlay URLs
        if (!url.includes('/overlay/') && !url.includes('/contact-info/')) {
          profile.linkedinUrl = 'https://www.linkedin.com' + url + '/';
        }
      }
      
      // If we got an overlay URL, try to find the main profile link
      if (!profile.linkedinUrl || profile.linkedinUrl.includes('/overlay/')) {
        // Look for the main profile link in aria-label or other attributes
        const mainProfileMatch = section.match(/href="(\/in\/[^"\/]+)\/"/i);
        if (mainProfileMatch) {
          profile.linkedinUrl = 'https://www.linkedin.com' + mainProfileMatch[1] + '/';
        }
      }
      
      // Also try full URL pattern
      if (!profile.linkedinUrl || profile.linkedinUrl.includes('/overlay/')) {
        urlMatch = section.match(/href="(https?:\/\/[^"]*linkedin\.com\/in\/[^"\/]+)(?:\/|")/i);
        if (urlMatch) {
          profile.linkedinUrl = urlMatch[1] + '/';
        }
      }
      
      // Clean up the URL
      if (profile.linkedinUrl) {
        profile.linkedinUrl = profile.linkedinUrl.split('?')[0].split('#')[0].replace(/\/$/, '') + '/';
        // Remove overlay paths
        profile.linkedinUrl = profile.linkedinUrl.replace(/\/overlay\/[^\/]+.*$/, '/');
      }
      
      // Extract profile image
      const imageMatch = section.match(/src="(https:\/\/media\.licdn\.com\/dms\/image\/[^"]+)"/i);
      if (imageMatch) {
        profile.imageUrl = imageMatch[1]
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"');
      }
      
      // Extract title/headline (look for text-body-medium with recruiter terms)
      const titleMatch = section.match(/<div[^>]*class="[^"]*text-body-medium[^"]*"[^>]*>([^<]+(?:Recruiter|Talent Acquisition|Recruitment)[^<]*)<\/div>/i) ||
                        section.match(/Technical Recruiter[^<|]*/i) ||
                        section.match(/Talent Acquisition[^<|]*/i) ||
                        section.match(/Recruiter[^<|]*/i);
      if (titleMatch) {
        profile.title = titleMatch[1] || titleMatch[0];
        profile.title = profile.title.trim().substring(0, 200);
      }
      
      // Extract company - look for ServiceNow, company name in buttons, etc.
      let companyMatch = section.match(/aria-label="Current company:\s*([^"]+?)(?:\s*\.\s*Click|")/i);
      if (!companyMatch) {
        // Look for company name in button with "Current company" aria-label (cleaner)
        companyMatch = section.match(/aria-label="Current company:\s*([^"]+?)(?:\s*\.\s*Click|")/i);
      }
      if (!companyMatch) {
        // Look for company name in span after company logo button
        companyMatch = section.match(/<button[^>]*aria-label="Current company[^"]*"[^>]*>[\s\S]*?<span[^>]*class="[^"]*break-words[^"]*"[^>]*>([^<]+)<\/span>/i);
      }
      if (!companyMatch) {
        // Look for company name in structured div
        companyMatch = section.match(/<div[^>]*class="[^"]*inline-show-more-text[^"]*"[^>]*>[\s\S]*?([A-Z][a-zA-Z0-9\s&'-]{2,50})[\s\S]*?<\/div>/i);
      }
      if (!companyMatch && profile.title) {
        companyMatch = profile.title.match(/at\s+([^|•,]+)/i);
      }
      if (companyMatch) {
        profile.company = companyMatch[1].trim();
        // Clean up common suffixes and prefixes
        profile.company = profile.company.replace(/^Current company:\s*/i, '');
        profile.company = profile.company.replace(/\s*\.\s*Click[^.]*$/i, '');
        profile.company = profile.company.replace(/\s*to skip.*$/i, '');
      }
      
      // Extract location
      const locationMatch = section.match(/([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)*),\s*(India|United States|UK|Canada|Australia)/i) ||
                           section.match(/(Delhi|Mumbai|Bangalore|Gurugram|Hyderabad|Pune|Chennai|Kolkata)[^<]*India/i);
      if (locationMatch) {
        profile.location = locationMatch[0].trim();
      }
      
      // Determine country
      if (profile.location) {
        const locationLower = profile.location.toLowerCase();
        for (const [key, countryCode] of Object.entries(LOCATION_TO_COUNTRY)) {
          if (locationLower.includes(key)) {
            profile.country = COUNTRY_MAP[countryCode];
            profile.countryCode = countryCode;
            break;
          }
        }
      }
      
      // Extract specializations
      if (profile.title && profile.title.toLowerCase().includes('technical')) {
        profile.skills = ['Technical Recruiting', 'IT Recruitment', 'Talent Acquisition'];
      } else {
        profile.skills = ['Technical Recruiting', 'Talent Acquisition'];
      }
      
      if (profile.name && profile.linkedinUrl) {
        profiles.push(profile);
      }
    } catch (error) {
      console.error(`Error parsing section ${index}:`, error.message);
    }
  });
  
  return profiles;
}

function normalizeLinkedInUrl(url) {
  if (!url) return '';
  return url.split('?')[0].split('#')[0].replace(/\/$/, '').toLowerCase();
}

function isDuplicate(profile, existingData) {
  const normalizedUrl = normalizeLinkedInUrl(profile.linkedinUrl);
  const normalizedName = profile.name ? profile.name.toLowerCase().trim() : '';
  
  return existingData.some((existing) => {
    const existingNormalizedUrl = normalizeLinkedInUrl(existing.linkedinUrl);
    if (normalizedUrl && existingNormalizedUrl && normalizedUrl === existingNormalizedUrl) {
      return true;
    }
    
    const existingName = existing.name ? existing.name.toLowerCase().trim() : '';
    if (normalizedName && existingName && normalizedName === existingName) {
      const existingCompany = existing.company ? existing.company.toLowerCase().trim() : '';
      const profileCompany = profile.company ? profile.company.toLowerCase().trim() : '';
      if (profileCompany && existingCompany && profileCompany === existingCompany) {
        return true;
      }
    }
    
    return false;
  });
}

function updateJSONFile(profiles, countryCode) {
  const filePath = path.join(__dirname, '..', 'data', `${countryCode.toLowerCase()}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let addedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  
  profiles.forEach((profile) => {
    if (isDuplicate(profile, existingData)) {
      console.log(`⏭️  Skipping ${profile.name} - duplicate entry already exists`);
      skippedCount++;
      return;
    }
    
    const normalizedUrl = normalizeLinkedInUrl(profile.linkedinUrl);
    const existingIndex = existingData.findIndex(
      (r) => normalizeLinkedInUrl(r.linkedinUrl) === normalizedUrl
    );
    
    const existingRecruiter = existingIndex >= 0 ? existingData[existingIndex] : null;
    
    const recruiterData = {
      id: existingRecruiter 
        ? existingRecruiter.id 
        : `${countryCode.toLowerCase()}-${existingData.length + 1}`,
      name: profile.name,
      country: profile.country || COUNTRY_MAP[countryCode],
      company: profile.company || 'Unknown Company',
      specialization: profile.skills || ['Technical Recruiting', 'Talent Acquisition'],
      experience: existingRecruiter 
        ? existingRecruiter.experience 
        : '5+ years',
      bio: existingRecruiter && existingRecruiter.bio
        ? existingRecruiter.bio
        : `${profile.title || 'Technical Recruiter'}${profile.company ? ` at ${profile.company}` : ''}.${profile.location ? ` Based in ${profile.location}.` : ''}`,
      linkedinUrl: profile.linkedinUrl,
      imageUrl: profile.imageUrl || (existingRecruiter ? existingRecruiter.imageUrl : undefined),
    };
    
    if (existingRecruiter) {
      console.log(`🔄 Updating: ${profile.name}`);
      existingData[existingIndex] = { ...existingRecruiter, ...recruiterData };
      updatedCount++;
    } else {
      console.log(`➕ Adding: ${profile.name}`);
      existingData.push(recruiterData);
      addedCount++;
    }
  });
  
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
  console.error('Usage: node scripts/parse-linkedin-profile-pages.js <input-file> <country-code>');
  process.exit(1);
}

console.log(`Reading ${inputFile}...`);
const htmlContent = fs.readFileSync(inputFile, 'utf8');

console.log('Extracting recruiter data from profile pages...');
const profiles = extractProfilesFromHTML(htmlContent);

console.log(`\nFound ${profiles.length} recruiters:`);
profiles.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name} - ${p.company || 'Unknown'} - ${p.linkedinUrl}`);
});

if (profiles.length > 0) {
  console.log(`\nUpdating ${countryCode.toUpperCase()} JSON file...`);
  updateJSONFile(profiles, countryCode);
  console.log('\n✅ Done!');
} else {
  console.log('\n⚠️  No recruiters found in HTML. Please check the input file format.');
}

