/**
 * Script to remove duplicate recruiters from JSON files
 * Identifies duplicates by:
 * - LinkedIn URL (primary check - most reliable)
 * - Name + Company combination (secondary check)
 * 
 * Keeps the first occurrence and removes duplicates
 * 
 * Usage: node scripts/remove-duplicates.js <country-code>
 * Example: node scripts/remove-duplicates.js in
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

// Normalize LinkedIn URL for comparison
function normalizeLinkedInUrl(url) {
  if (!url || typeof url !== 'string') return '';
  
  return url
    .trim()
    .toLowerCase()
    .replace(/\/$/, '') // Remove trailing slash
    .split('?')[0] // Remove query parameters
    .split('#')[0]; // Remove hash
}

// Normalize name for comparison
function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Normalize company for comparison
function normalizeCompany(company) {
  if (!company || typeof company !== 'string') return '';
  return company.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Track seen URLs and name+company combinations
const seenUrls = new Set();
const seenNameCompany = new Set();
const duplicates = [];
const uniqueRecruiters = [];

data.forEach((recruiter, index) => {
  const normalizedUrl = normalizeLinkedInUrl(recruiter.linkedinUrl);
  const normalizedName = normalizeName(recruiter.name);
  const normalizedCompany = normalizeCompany(recruiter.company);
  const nameCompanyKey = `${normalizedName}|||${normalizedCompany}`;
  
  let isDuplicate = false;
  let duplicateReason = '';
  
  // Check by LinkedIn URL (most reliable)
  if (normalizedUrl && seenUrls.has(normalizedUrl)) {
    isDuplicate = true;
    duplicateReason = 'duplicate LinkedIn URL';
  }
  
  // Check by name + company (if URL check didn't catch it)
  if (!isDuplicate && normalizedName && normalizedCompany && 
      normalizedName !== 'unknown recruiter' && normalizedCompany !== 'unknown company') {
    if (seenNameCompany.has(nameCompanyKey)) {
      isDuplicate = true;
      duplicateReason = 'duplicate name + company';
    }
  }
  
  if (isDuplicate) {
    duplicates.push({
      index,
      id: recruiter.id,
      name: recruiter.name,
      company: recruiter.company,
      linkedinUrl: recruiter.linkedinUrl,
      reason: duplicateReason
    });
  } else {
    // Add to unique list and mark as seen
    uniqueRecruiters.push(recruiter);
    if (normalizedUrl) seenUrls.add(normalizedUrl);
    if (nameCompanyKey && normalizedName !== 'unknown recruiter' && normalizedCompany !== 'unknown company') {
      seenNameCompany.add(nameCompanyKey);
    }
  }
});

console.log(`\n📊 Duplicate Analysis:`);
console.log(`   - Unique: ${uniqueRecruiters.length} recruiters`);
console.log(`   - Duplicates found: ${duplicates.length}`);

if (duplicates.length > 0) {
  console.log(`\n🗑️  Duplicates to be removed:`);
  duplicates.forEach((dup, i) => {
    console.log(`   ${i + 1}. ${dup.id}: ${dup.name} at ${dup.company}`);
    console.log(`      URL: ${dup.linkedinUrl}`);
    console.log(`      Reason: ${dup.reason}`);
  });
  
  // Backup original file
  const backupPath = `${filePath}.backup.${Date.now()}`;
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  console.log(`\n📦 Backup created: ${backupPath}`);
  
  // Write cleaned data
  fs.writeFileSync(filePath, JSON.stringify(uniqueRecruiters, null, 2));
  console.log(`\n✅ Removed ${duplicates.length} duplicate(s)`);
  console.log(`✅ Cleaned data written to ${filePath}`);
  console.log(`   - Before: ${originalCount} recruiters`);
  console.log(`   - After: ${uniqueRecruiters.length} recruiters`);
} else {
  console.log(`\n✅ No duplicates found. Data is clean!`);
}

console.log(`\n✅ Done!`);

