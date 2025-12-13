/**
 * Script to fix banner images in JSON files
 * Removes profile-displaybackgroundimage URLs and keeps only profile photos
 * 
 * Usage: node scripts/fix-banner-images.js <country-code>
 * Example: node scripts/fix-banner-images.js in
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

let fixedCount = 0;
let removedCount = 0;

data.forEach((recruiter, index) => {
  if (recruiter.imageUrl) {
    // Check if it's a banner image
    if (recruiter.imageUrl.includes('profile-displaybackgroundimage')) {
      console.log(`❌ Removing banner image for ${recruiter.name}`);
      delete recruiter.imageUrl;
      removedCount++;
      fixedCount++;
    } else if (!recruiter.imageUrl.includes('profile-displayphoto') && 
               !recruiter.imageUrl.includes('profile-framedphoto')) {
      // If it's not a profile photo or framed photo, remove it
      console.log(`❌ Removing invalid image URL for ${recruiter.name}`);
      delete recruiter.imageUrl;
      removedCount++;
      fixedCount++;
    }
  }
});

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log(`\n✅ Fixed ${filePath}`);
console.log(`   - Removed ${removedCount} banner/invalid images`);
console.log(`   - Total fixed: ${fixedCount} recruiters`);
console.log(`   - Total recruiters: ${data.length}`);

