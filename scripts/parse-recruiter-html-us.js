/**
 * Parser for LinkedIn recruiter HTML from recuriter.txt
 * Extracts recruiter profiles and adds them to US JSON
 */

const fs = require('fs');
const path = require('path');

function isRecruiterProfile(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("recruiter") ||
    lowerText.includes("talent acquisition") ||
    lowerText.includes("recruitment") ||
    lowerText.includes("hiring") ||
    lowerText.includes("staffing") ||
    lowerText.includes("hr recruiter") ||
    lowerText.includes("technical recruiter")
  );
}

function extractRecruitersFromHTML(htmlContent) {
  const recruiters = [];
  const seenUrls = new Set();

  // Split by people-search-result sections
  const sections = htmlContent.split(/data-view-name="people-search-result"/);
  
  console.log(`Found ${sections.length} potential profile sections`);

  sections.forEach((section, index) => {
    if (index === 0) return; // Skip first section (before first profile)

    try {
      const recruiter = {};

      // Extract LinkedIn URL
      const urlMatch = section.match(/href="(https:\/\/www\.linkedin\.com\/in\/[^"]+)"/);
      if (!urlMatch) return;
      
      recruiter.linkedinUrl = urlMatch[1].split('?')[0].split('#')[0];
      
      // Skip duplicates
      if (seenUrls.has(recruiter.linkedinUrl)) {
        return;
      }
      seenUrls.add(recruiter.linkedinUrl);

      // Check if this is a recruiter profile
      const sectionLower = section.toLowerCase();
      if (!isRecruiterProfile(sectionLower)) {
        return; // Skip non-recruiters
      }

      // Extract name from aria-label on image
      const nameMatch = section.match(/aria-label="([^"]+)"[^>]*data-view-name="image"/);
      if (nameMatch) {
        recruiter.name = nameMatch[1].trim();
      } else {
        // Fallback: extract from link text
        const nameLinkMatch = section.match(/data-view-name="search-result-lockup-title">([^<]+)</);
        if (nameLinkMatch) {
          recruiter.name = nameLinkMatch[1].trim();
        }
      }

      // Extract profile image - look for the main profile image
      const imageMatches = section.matchAll(/src="(https:\/\/media\.licdn\.com\/dms\/image\/[^"]+)"/g);
      const imageArray = Array.from(imageMatches);
      if (imageArray.length > 0) {
        // Use the first image that's not a placeholder SVG
        for (const imgMatch of imageArray) {
          const imgUrl = imgMatch[1]
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');
          // Skip SVG placeholders
          if (!imgUrl.includes('person-accent') && !imgUrl.includes('viewBox')) {
            recruiter.imageUrl = imgUrl;
            break;
          }
        }
      }

      // Extract company/position - look for "Current:" or "Past:" patterns
      let companyMatch = section.match(/Current:.*?<strong>.*?Recruiter.*?<\/strong>.*?at\s+([^<]+)/i) ||
                        section.match(/Past:.*?<strong>.*?Recruiter.*?<\/strong>.*?at\s+([^<]+)/i);
      
      if (!companyMatch) {
        // Look for title/headline that contains company info
        const titleMatch = section.match(/<p[^>]*class="[^"]*5cc1ed84[^"]*"[^>]*>([^<]+)<\/p>/);
        if (titleMatch) {
          const title = titleMatch[1].trim();
          // Extract company from title if it contains "at" or "@"
          const atMatch = title.match(/(?:at|@)\s+([^|,]+)/i);
          if (atMatch) {
            recruiter.company = atMatch[1].trim();
          } else {
            recruiter.company = title.substring(0, 150); // Use title as company if no "at" found
          }
        }
      } else {
        recruiter.company = companyMatch[1].trim();
      }

      // Extract location
      const locationMatch = section.match(/<p[^>]*class="[^"]*620b6819[^"]*"[^>]*>([^<]+)<\/p>/);
      if (locationMatch) {
        recruiter.location = locationMatch[1].trim();
      }

      // Set default values
      if (!recruiter.name) {
        // Try to extract from URL slug as last resort
        const urlSlug = recruiter.linkedinUrl.match(/\/in\/([^\/]+)/);
        if (urlSlug) {
          const slug = urlSlug[1].replace(/-/g, ' ');
          recruiter.name = slug
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        } else {
          recruiter.name = 'Unknown';
        }
      }

      if (!recruiter.company) {
        recruiter.company = 'Not specified';
      }

      // Set specialization based on title/company
      recruiter.specialization = ['Talent Acquisition', 'IT Recruitment'];
      
      // Set experience
      recruiter.experience = 'Not specified';
      
      // Set bio
      recruiter.bio = 'No bio available';

      // Only add if we have at least name and LinkedIn URL
      if (recruiter.name && recruiter.linkedinUrl && recruiter.name !== 'Unknown') {
        recruiters.push(recruiter);
      }

    } catch (error) {
      console.error(`Error parsing section ${index}:`, error.message);
    }
  });

  return recruiters;
}

// Main execution
const inputFile = path.join(__dirname, '../data/recuriter.txt');
const outputFile = path.join(__dirname, '../data/us.json');

console.log('📄 Reading HTML file...');
const htmlContent = fs.readFileSync(inputFile, 'utf8');

console.log('🔍 Extracting recruiters from HTML...');
const newRecruiters = extractRecruitersFromHTML(htmlContent);

console.log(`\n✅ Extracted ${newRecruiters.length} recruiters from HTML`);

// Read existing data
console.log('📖 Reading existing US JSON...');
const existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

// Find the highest ID
let maxId = 0;
existingData.forEach(recruiter => {
  const idMatch = recruiter.id?.match(/^us-(\d+)$/);
  if (idMatch) {
    const idNum = parseInt(idMatch[1], 10);
    if (idNum > maxId) {
      maxId = idNum;
    }
  }
});

console.log(`Highest existing ID: us-${maxId}`);

// Check for duplicates by LinkedIn URL
const existingLinkedInUrls = new Set(existingData.map(r => r.linkedinUrl?.toLowerCase()));
let duplicatesFound = 0;
let addedCount = 0;

// Add new recruiters with proper IDs
newRecruiters.forEach((recruiter, index) => {
  const linkedInUrlLower = recruiter.linkedinUrl?.toLowerCase();
  
  if (existingLinkedInUrls.has(linkedInUrlLower)) {
    console.log(`⚠️  Skipping duplicate: ${recruiter.name} (${recruiter.linkedinUrl})`);
    duplicatesFound++;
    return;
  }
  
  const newId = maxId + 1 + addedCount;
  const newRecruiter = {
    id: `us-${newId}`,
    country: "US",
    name: recruiter.name,
    company: recruiter.company || 'Not specified',
    specialization: recruiter.specialization || ['Talent Acquisition', 'IT Recruitment'],
    experience: recruiter.experience || 'Not specified',
    bio: recruiter.bio || 'No bio available',
    linkedinUrl: recruiter.linkedinUrl,
    imageUrl: recruiter.imageUrl || ""
  };
  
  existingData.push(newRecruiter);
  existingLinkedInUrls.add(linkedInUrlLower);
  addedCount++;
  console.log(`✅ Added: ${recruiter.name} (us-${newId})`);
});

// Write back to file
fs.writeFileSync(outputFile, JSON.stringify(existingData, null, 2) + '\n', 'utf8');

console.log(`\n✨ Done!`);
console.log(`   - Extracted: ${newRecruiters.length} recruiters from HTML`);
console.log(`   - Added: ${addedCount} new recruiters`);
console.log(`   - Skipped: ${duplicatesFound} duplicates`);
console.log(`   - Total recruiters in file: ${existingData.length}`);

