const fs = require('fs');
const path = require('path');

// New recruiters data
const newRecruiters = [
  {
    "name": "Ritu Sharma",
    "company": "IT Recruiter - Spectrum Talent Management",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/ritu-sharma-43387a1a9",
    "imageUrl": ""
  },
  {
    "name": "Meenu Kumari",
    "company": "Hr Recruiter",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/meenu-kumari-251892176",
    "imageUrl": ""
  },
  {
    "name": "Dibya Singh",
    "company": "Sr. IT Recruiter",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/dibya-singh-034432207",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D5603AQF93rnoz03tTg/profile-displayphoto-scale_100_100/B56ZkBsgxdIAAc-/0/1756670071335?e=1767225600&v=beta&t=DzXmPK9x-LAnEGPGNh8MK_XRMonlxMGAKsfBdXy8Ts8"
  },
  {
    "name": "Tejash Gupta",
    "company": "Us It Recruiter",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/tejash-gupta-93088a1a3",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D5603AQFZQ9wOjD2qkA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1719379362163?e=1767225600&v=beta&t=M_jOAd8vUN7C7OekQaewoLUmJ4o-egilRSFDxHD2XaY"
  },
  {
    "name": "Tejaswee Tripathy",
    "company": "Chief Human Resource Officer (CHRO)- Finocontrol | LinkedIn Top Voice | LinkedIn Strategist | Incharge- Corporate Relations | Aligning Disruptive Talent with Opportunities | Content Strategist - Helping Brands Grow",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/tejaswee-tripathy",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D5635AQGDY4X_UyrNWw/profile-framedphoto-shrink_100_100/B56ZpH62HdH8Ak-/0/1762143200181?e=1766300400&v=beta&t=8cD9TitRUir4ACjMOMjpz9-tWARMBFHG_Wr_SfDAJAo"
  },
  {
    "name": "Deepak Thakur",
    "company": "105 k Connections | Business Development Expert (IT Services) | Remote | Lead Generation & Client Acquisition | Freelancer Consultant | Helping IT Agencies & Freelancers Grow",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/deepak-thakur-b1353032",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D5603AQFZQ9wOjD2qkA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1719379362163?e=1767225600&v=beta&t=M_jOAd8vUN7C7OekQaewoLUmJ4o-egilRSFDxHD2XaY"
  },
  {
    "name": "Vishal Anand",
    "company": "US IT Recruiter | Federal Cleared | Commercial IT Hiring",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/vishal-anand-ba4b97156",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D5603AQGzTvZuSOwb8w/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1728271210061?e=1767225600&v=beta&t=2eddr4lWRI4cfaO9dM5_8F1QhYzAF3Z7jpjVF2-K65o"
  },
  {
    "name": "Shruti Arora",
    "company": "US IT Recruiter",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/shruti-arora-207511213",
    "imageUrl": ""
  },
  {
    "name": "Arun kumar",
    "company": "Seasoned IT Recruitment Leader @ ExcelGens, Inc. Talent Acquisition Specialist | ATS Expert | Visa & Immigration Specialist",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/arun-kumar-433ab0212",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D4E03AQGwMeEa1QZOXQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1712008079163?e=1767225600&v=beta&t=P3i1ZnBWzf1RKw3OX13TjFXuCzMUU1qNyQff4lO5JGw"
  },
  {
    "name": "Tanya Katiyar",
    "company": "Talent Sourcer || Career Coach DM for collaboration",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/tanya-katiyar-a444b4112",
    "imageUrl": "https://media.licdn.com/dms/image/v2/C4D03AQEes2IKXqC0kg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1623054134242?e=1767225600&v=beta&t=Fjv0eYs2SR6UYDhrIwBVsQPPzpK1JsdU4BytMZPHoHM"
  },
  {
    "name": "Anjali Arya",
    "company": "Sr. Talent Acquisition Specialist at ExcelGens, Inc.",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/anjali-arya-60751a172",
    "imageUrl": "https://media.licdn.com/dms/image/v2/C4D03AQGbJOU69aitBw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1646722075587?e=1767225600&v=beta&t=S15cEisRF2j6Zu7fKhlin0OOZ9e9ouCrCRV1ouponsA"
  },
  {
    "name": "Ishant Vashishta",
    "company": "Talent Acquisition Lead / Recruitment Specialist",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/ishant-vashishta-98b869148",
    "imageUrl": ""
  },
  {
    "name": "Richa Sah",
    "company": "🚀 Hiring Investment Research Analyst",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Available",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/richa-sah-b83a86bb",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D4E35AQF-rM6_FOOOtA/profile-framedphoto-shrink_100_100/profile-framedphoto-shrink_100_100/0/1698128770207?e=1766300400&v=beta&t=WM_H_gm5iVbt0XhF1xCfXUXL_1x4yrcqP5gu0wQX6a0"
  },
  {
    "name": "Nisha singh",
    "company": "US IT Recruiter",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/nisha-singh-a95716216",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D4D03AQEDv2gw_CxNrA/profile-displayphoto-scale_100_100/B4DZjIFDu4GQAg-/0/1755703426512?e=1767225600&v=beta&t=51i_a7yNTnN5CswXHnrrXZ0vwZ5h6DURUkf7efVHq3c"
  },
  {
    "name": "Diksha Anand",
    "company": "Technical IT Recruiter at Net2Source",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/diksha-anand-597ba727b",
    "imageUrl": ""
  },
  {
    "name": "Yashika Yadav",
    "company": "Passionate HR IT Recruiter (Rise and Shine🌝✨)",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/yashika-yadav-821282223",
    "imageUrl": "https://media.licdn.com/dms/image/v2/C4D03AQEWUIDOnGNWeg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1662425173871?e=1767225600&v=beta&t=MIwfUc4jkZG-F5OYX5Ms34HQwkFkFtWvNOkgwFKyVX4"
  },
  {
    "name": "Jyoti Saini",
    "company": "IT Recruiter at @Nod Networks",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/jyoti-saini-844a8a29b",
    "imageUrl": ""
  },
  {
    "name": "Sandeep Yadav",
    "company": "Sr. US IT RECRUITER",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/sandeep-yadav-sme",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D5603AQFoKoHF3NvQjg/profile-displayphoto-shrink_100_100/B56ZZ_upLIHUAU-/0/1745899657175?e=1767225600&v=beta&t=GnSEHAJxy4Al0JYqtiPf3h4vVmpr1mKWkZCsmAYfpYw"
  },
  {
    "name": "sakshi gupta",
    "company": "US IT recruiter",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/sakshi-gupta-462467218",
    "imageUrl": ""
  },
  {
    "name": "Juhi S.",
    "company": "IT Recruiter",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/juhi10899",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D5603AQEvHznLiZkxtQ/profile-displayphoto-scale_100_100/B56ZkRV8xAIAAg-/0/1756932592140?e=1767225600&v=beta&t=rgMevfcfRQVQfgdj5soyZC7_TxkunIlaIPkiaq90qQk"
  },
  {
    "name": "Karthik Reddy",
    "company": "Senior Talent Management Analyst | US IT Bench Sales Recruiter | C2C Hiring | Talent Marketing | Vendor Management |",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/karthik-reddy-221a8b23b",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D5603AQEvHznLiZkxtQ/profile-displayphoto-scale_100_100/B56ZkRV8xAIAAg-/0/1756932592140?e=1767225600&v=beta&t=rgMevfcfRQVQfgdj5soyZC7_TxkunIlaIPkiaq90qQk"
  },
  {
    "name": "Kashish Singhal",
    "company": "Technical recruiter",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/kashish-singhal-57b444223",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D5603AQF8FaF9VhRrLQ/profile-displayphoto-shrink_100_100/B56Zag7x30HsAk-/0/1746456758098?e=1767225600&v=beta&t=ovYQYC-77k9fhpE2XiWFbiM5qy_Fjlysz6vjBmZZO1A"
  },
  {
    "name": "Uma Soni",
    "company": "US IT Recruiter at Exarca",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/uma-soni-515840221",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D5603AQEN5-aqgxp99g/profile-displayphoto-scale_100_100/B56ZpQlGTMHYAc-/0/1762288495526?e=1767225600&v=beta&t=yfuPUUtPw412DTD5Fm3kfyR4hCbIlae_ixzHI0FJRd8"
  },
  {
    "name": "Tanu Srivastava",
    "company": "Senior Technical Acquisition............... Connecting Talents with Opportunities !!!!",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/tanu-srivastava2424",
    "imageUrl": ""
  },
  {
    "name": "Vineeta S.",
    "company": "Senior Technical Recruiter",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/vineeta-s-4bb0a893",
    "imageUrl": "https://media.licdn.com/dms/image/v2/C4E03AQEj7fYncdS_kA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1644960477668?e=1767225600&v=beta&t=TsDLHjWeqeAtqVpMExVu-BXVXaR3iLUL_cGMdl0PBdk"
  },
  {
    "name": "Renu Kushwah",
    "company": "Recruitment specialist|| Bridging skills and opportunities || C2C || W2 || C2H || 1099",
    "specialization": [
      "Talent Acquisition",
      "IT Recruitment"
    ],
    "experience": "Not specified",
    "bio": "No bio available",
    "linkedinUrl": "https://www.linkedin.com/in/renu-kushwah-b72949224",
    "imageUrl": "https://media.licdn.com/dms/image/v2/D4D03AQEe3eAhNiZQnQ/profile-displayphoto-scale_100_100/B4DZkaGeguIcAc-/0/1757079530727?e=1767225600&v=beta&t=dKc-5aeVtIeGmWkHsEtLAyEpqAOh_v5leOGHkZ2mQ1A"
  }
];

// Read existing data
const filePath = path.join(__dirname, '../data/in.json');
const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Find the highest ID
let maxId = 0;
existingData.forEach(recruiter => {
  const idMatch = recruiter.id?.match(/^in-(\d+)$/);
  if (idMatch) {
    const idNum = parseInt(idMatch[1], 10);
    if (idNum > maxId) {
      maxId = idNum;
    }
  }
});

console.log(`Highest existing ID: in-${maxId}`);
console.log(`Adding ${newRecruiters.length} new recruiters starting from in-${maxId + 1}`);

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
    id: `in-${newId}`,
    country: "IN",
    name: recruiter.name,
    company: recruiter.company,
    specialization: recruiter.specialization,
    experience: recruiter.experience,
    bio: recruiter.bio,
    linkedinUrl: recruiter.linkedinUrl,
    imageUrl: recruiter.imageUrl || ""
  };
  
  existingData.push(newRecruiter);
  existingLinkedInUrls.add(linkedInUrlLower);
  addedCount++;
  console.log(`✅ Added: ${recruiter.name} (in-${newId})`);
});

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2) + '\n', 'utf8');

console.log(`\n✨ Done!`);
console.log(`   - Added: ${addedCount} new recruiters`);
console.log(`   - Skipped: ${duplicatesFound} duplicates`);
console.log(`   - Total recruiters in file: ${existingData.length}`);

