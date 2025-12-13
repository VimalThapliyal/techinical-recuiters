/**
 * Helper script to add a new recruiter to the JSON files
 * 
 * Usage: node scripts/add-recruiter.js <country-code> <name> <linkedin-url> <company> <specializations> <experience> <bio>
 * 
 * Example:
 * node scripts/add-recruiter.js us "John Doe" "https://www.linkedin.com/in/johndoe/" "Tech Corp" "React,Node.js" "5 years" "Experienced recruiter..."
 */

const fs = require('fs');
const path = require('path');

const countryCode = process.argv[2];
const name = process.argv[3];
const linkedinUrl = process.argv[4];
const company = process.argv[5];
const specializations = process.argv[6].split(',').map(s => s.trim());
const experience = process.argv[7];
const bio = process.argv[8];

if (!countryCode || !name || !linkedinUrl || !company || !specializations || !experience || !bio) {
  console.error('Usage: node scripts/add-recruiter.js <country-code> <name> <linkedin-url> <company> <specializations> <experience> <bio>');
  console.error('Example: node scripts/add-recruiter.js us "John Doe" "https://www.linkedin.com/in/johndoe/" "Tech Corp" "React,Node.js" "5 years" "Experienced recruiter..."');
  process.exit(1);
}

const countryMap = {
  us: 'US',
  uk: 'UK',
  ca: 'CA',
  au: 'AU',
  in: 'IN'
};

const countryName = countryMap[countryCode.toLowerCase()];
if (!countryName) {
  console.error(`Invalid country code: ${countryCode}. Use: us, uk, ca, au, or in`);
  process.exit(1);
}

const filePath = path.join(__dirname, '..', 'data', `${countryCode.toLowerCase()}.json`);
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Generate new ID
const lastId = data[data.length - 1]?.id || `${countryCode}-0`;
const lastNumber = parseInt(lastId.split('-')[1]) || 0;
const newId = `${countryCode}-${lastNumber + 1}`;

// Create new recruiter object
const newRecruiter = {
  id: newId,
  name: name,
  country: countryName,
  company: company,
  specialization: specializations,
  experience: experience,
  bio: bio,
  linkedinUrl: linkedinUrl,
  imageUrl: `/images/recruiters/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`
};

data.push(newRecruiter);

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log(`✅ Added recruiter: ${name}`);
console.log(`   ID: ${newId}`);
console.log(`   LinkedIn: ${linkedinUrl}`);
console.log(`   File: ${filePath}`);

