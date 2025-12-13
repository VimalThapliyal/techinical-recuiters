/**
 * Script to clean invalid recruiters from JSON files
 * Removes entries with:
 * - Missing or empty name
 * - Invalid/broken LinkedIn URLs
 * - Missing required fields
 * 
 * Usage: node scripts/clean-invalid-recruiters.js <country-code>
 * Example: node scripts/clean-invalid-recruiters.js in
 */

const fs = require('fs');
const path = require('path');

const countryCode = process.argv[2] || 'in';
const filePath = path.join(__dirname, '..', 'data', `${countryCode.toLowerCase()}.json`);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

console.log(`Reading ${filePath}...`);
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const originalCount = data.length;

console.log(`\nOriginal count: ${originalCount} recruiters`);

// Validation functions
function isValidLinkedInUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  const trimmed = url.trim();
  
  // Check for undefined or empty
  if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return false;
  
  // Check if it's a valid LinkedIn profile URL
  const linkedinPattern = /^https?:\/\/(www\.)?(linkedin\.com\/in\/|in\.linkedin\.com\/in\/)/i;
  if (!linkedinPattern.test(trimmed)) return false;
  
  // Check for malformed URLs (double slashes, missing profile slug, etc.)
  if (trimmed.includes('/in//') || trimmed.includes('/in/undefined')) return false;
  
  // Extract profile slug and validate
  const match = trimmed.match(/\/in\/([^\/\?]+)/);
  if (!match || !match[1] || match[1].trim() === '') return false;
  
  // URL should be at least 25 characters (minimum valid LinkedIn URL length)
  if (trimmed.length < 25) return false;
  
  return true;
}

function isValidName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return false;
  if (trimmed.length < 2) return false; // Too short to be a real name
  return true;
}

function isValidRecruiter(recruiter) {
  // Check required fields
  if (!recruiter.id) return false;
  if (!isValidName(recruiter.name)) return false;
  if (!isValidLinkedInUrl(recruiter.linkedinUrl)) return false;
  
  // Check if company exists (can be "Unknown Company" but should exist)
  if (!recruiter.company || typeof recruiter.company !== 'string') return false;
  
  // Check if specialization exists and is an array
  if (!recruiter.specialization || !Array.isArray(recruiter.specialization)) return false;
  if (recruiter.specialization.length === 0) return false;
  
  return true;
}

// Filter valid recruiters
const validRecruiters = data.filter(recruiter => {
  const isValid = isValidRecruiter(recruiter);
  if (!isValid) {
    const reasons = [];
    if (!isValidName(recruiter.name)) reasons.push('invalid name');
    if (!isValidLinkedInUrl(recruiter.linkedinUrl)) reasons.push('invalid LinkedIn URL');
    if (!recruiter.company) reasons.push('missing company');
    if (!recruiter.specialization || !Array.isArray(recruiter.specialization) || recruiter.specialization.length === 0) {
      reasons.push('missing/invalid specialization');
    }
    console.log(`  ❌ Removing ${recruiter.id}: ${recruiter.name || 'NO NAME'} - ${reasons.join(', ')}`);
  }
  return isValid;
});

const removedCount = originalCount - validRecruiters.length;

console.log(`\n✅ Validation complete:`);
console.log(`   - Valid: ${validRecruiters.length} recruiters`);
console.log(`   - Removed: ${removedCount} invalid recruiters`);

if (removedCount > 0) {
  // Backup original file
  const backupPath = `${filePath}.backup.${Date.now()}`;
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  console.log(`\n📦 Backup created: ${backupPath}`);
  
  // Write cleaned data
  fs.writeFileSync(filePath, JSON.stringify(validRecruiters, null, 2));
  console.log(`✅ Cleaned data written to ${filePath}`);
} else {
  console.log(`\n✅ No invalid entries found. Data is clean!`);
}

console.log(`\n✅ Done!`);

