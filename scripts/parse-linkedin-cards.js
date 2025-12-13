/**
 * Parser for LinkedIn profile cards HTML (from "People You May Know" or similar sections)
 * Extracts all profiles and filters to only include recruiters
 *
 * Usage: node scripts/parse-linkedin-cards.js <input-file> <country-code>
 */

const fs = require("fs");
const path = require("path");

const COUNTRY_MAP = {
  us: "US",
  uk: "UK",
  ca: "CA",
  au: "AU",
  in: "IN",
};

const LOCATION_TO_COUNTRY = {
  india: "in",
  "united states": "us",
  usa: "us",
  "united kingdom": "uk",
  uk: "uk",
  canada: "ca",
  australia: "au",
  meerut: "in",
  gurugram: "in",
  delhi: "in",
  mumbai: "in",
  bangalore: "in",
  hyderabad: "in",
  pune: "in",
  chennai: "in",
  kolkata: "in",
};

function isRecruiterProfile(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("recruiter") ||
    lowerText.includes("talent acquisition") ||
    lowerText.includes("recruitment") ||
    lowerText.includes("hiring") ||
    lowerText.includes("staffing") ||
    lowerText.includes("hro") || // Human Resources Operations
    lowerText.includes("hr operations")
  );
}

function extractProfilesFromHTML(htmlContent) {
  const profiles = [];

  // Split by profile card sections - look for links to /in/ profiles
  // Each profile card typically starts with an <a> tag containing href="/in/..."
  const profileLinks = htmlContent.matchAll(
    /href="(https:\/\/www\.linkedin\.com\/in\/[^"]+)"[^>]*>/gi
  );

  const seenUrls = new Set();

  for (const linkMatch of profileLinks) {
    const profileUrl = linkMatch[1].split("?")[0].split("#")[0];

    // Skip duplicates
    if (seenUrls.has(profileUrl)) continue;
    seenUrls.add(profileUrl);

    // Find the section containing this link (look backwards and forwards)
    const linkIndex = linkMatch.index;
    const beforeLink = htmlContent.substring(
      Math.max(0, linkIndex - 2000),
      linkIndex
    );
    const afterLink = htmlContent.substring(
      linkIndex,
      Math.min(htmlContent.length, linkIndex + 5000)
    );
    const section = beforeLink + afterLink;

    try {
      const profile = {};
      profile.linkedinUrl = profileUrl;

      // Extract name - look for span with class containing name patterns
      // Pattern 1: <span class="_0790681e">Name</span>
      let nameMatch = section.match(
        /<span[^>]*class="[^"]*0790681e[^"]*"[^>]*>([^<]+)<\/span>/i
      );

      // Pattern 2: aria-label with name
      if (!nameMatch) {
        nameMatch = section.match(
          /aria-label="([^"]+)"[^>]*href="[^"]*linkedin\.com\/in\//i
        );
      }

      // Pattern 3: Look for name in the link text area
      if (!nameMatch) {
        nameMatch = section.match(
          /<a[^>]*href="[^"]*linkedin\.com\/in\/[^"]*"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/i
        );
      }

      // Pattern 4: Extract from URL slug (last resort)
      if (!nameMatch) {
        const urlSlug = profileUrl.match(/\/in\/([^\/]+)/);
        if (urlSlug) {
          const slug = urlSlug[1].replace(/-/g, " ");
          profile.name = slug
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        }
      } else {
        profile.name = nameMatch[1].trim();
      }

      // Extract title/headline - look for text-body-medium or similar
      // Pattern 1: Look for title in div with class containing text-body-medium
      let titleMatch =
        section.match(
          /<div[^>]*class="[^"]*text-body-medium[^"]*"[^>]*>([^<]+)<\/div>/i
        ) ||
        section.match(/<p[^>]*class="[^"]*5cc1ed84[^"]*"[^>]*>([^<]+)<\/p>/i);

      // Pattern 2: Look for title near the name
      if (!titleMatch) {
        titleMatch = section.match(
          /<div[^>]*class="[^"]*a90e6a91[^"]*"[^>]*>[\s\S]*?<p[^>]*>([^<]+)<\/p>/i
        );
      }

      if (titleMatch) {
        profile.title = titleMatch[1].trim();
      }

      // CRITICAL: Filter to only recruiters
      const profileText = (profile.title || "").toLowerCase();
      if (!isRecruiterProfile(profileText)) {
        console.log(
          `⏭️  Skipping ${
            profile.name || "Unknown"
          } - not a recruiter (title: ${profile.title || "N/A"})`
        );
        continue;
      }

      // Extract profile image - Use the SECOND figure image (profile photo)
      // The first figure is usually the banner, second is the profile photo
      // Look for <figure> elements and get the second one's image
      const figureMatches = section.matchAll(
        /<figure[^>]*>[\s\S]*?<img[^>]*src="(https:\/\/media\.licdn\.com\/dms\/image\/[^"]+)"[^>]*>/gi
      );

      let figureImages = Array.from(figureMatches);
      let profileImage = null;

      // Use the second figure image (index 1) if available, otherwise fall back to first
      if (figureImages.length >= 2) {
        // Second figure (index 1) is usually the profile photo
        const imageUrl = figureImages[1][1]
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"');

        // Only use profile photos, not banner images
        if (
          imageUrl.includes("profile-displayphoto") ||
          imageUrl.includes("profile-framedphoto")
        ) {
          // Skip banner images
          if (!imageUrl.includes("profile-displaybackgroundimage")) {
            profileImage = imageUrl;
          }
        }
      }

      // Fallback: if second figure didn't work, try all images and find profile photos
      if (!profileImage) {
        const imageMatches = section.matchAll(
          /src="(https:\/\/media\.licdn\.com\/dms\/image\/[^"]+)"/gi
        );

        for (const match of imageMatches) {
          const imageUrl = match[1]
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"');

          // Only use profile photos, not banner images
          if (
            imageUrl.includes("profile-displayphoto") ||
            imageUrl.includes("profile-framedphoto")
          ) {
            // Skip banner images
            if (!imageUrl.includes("profile-displaybackgroundimage")) {
              profileImage = imageUrl;
              break; // Use the first valid profile photo found
            }
          }
        }
      }

      if (profileImage) {
        profile.imageUrl = profileImage;
      }

      // Extract company from title
      if (profile.title) {
        // Pattern: "Title at Company" or "Title - Company"
        const companyMatch = profile.title.match(
          /(?:at|@|-\s*)([A-Z][^|•,\n]+?)(?:\s*[|•,\n]|$)/i
        );
        if (companyMatch) {
          profile.company = companyMatch[1].trim();
        }
      }

      // Extract location (if available in section)
      const locationMatch =
        section.match(
          /([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)*),\s*(India|United States|UK|Canada|Australia)/i
        ) ||
        section.match(
          /(Delhi|Mumbai|Bangalore|Gurugram|Hyderabad|Pune|Chennai|Kolkata)[^<]*/i
        );
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

      // Extract specializations based on title
      if (profile.title) {
        const titleLower = profile.title.toLowerCase();
        if (titleLower.includes("technical")) {
          profile.skills = [
            "Technical Recruiting",
            "IT Recruitment",
            "Talent Acquisition",
          ];
        } else if (titleLower.includes("talent acquisition")) {
          profile.skills = ["Talent Acquisition", "Recruitment"];
        } else {
          profile.skills = ["Technical Recruiting", "Talent Acquisition"];
        }
      } else {
        profile.skills = ["Technical Recruiting", "Talent Acquisition"];
      }

      if (profile.name && profile.linkedinUrl) {
        profiles.push(profile);
      }
    } catch (error) {
      console.error(`Error parsing profile ${profileUrl}:`, error.message);
    }
  }

  return profiles;
}

function normalizeLinkedInUrl(url) {
  if (!url) return "";
  return url.split("?")[0].split("#")[0].replace(/\/$/, "").toLowerCase();
}

function isDuplicate(profile, existingData) {
  const normalizedUrl = normalizeLinkedInUrl(profile.linkedinUrl);
  const normalizedName = profile.name ? profile.name.toLowerCase().trim() : "";

  return existingData.some((existing) => {
    const existingNormalizedUrl = normalizeLinkedInUrl(existing.linkedinUrl);
    if (
      normalizedUrl &&
      existingNormalizedUrl &&
      normalizedUrl === existingNormalizedUrl
    ) {
      return true;
    }

    const existingName = existing.name
      ? existing.name.toLowerCase().trim()
      : "";
    if (normalizedName && existingName && normalizedName === existingName) {
      const existingCompany = existing.company
        ? existing.company.toLowerCase().trim()
        : "";
      const profileCompany = profile.company
        ? profile.company.toLowerCase().trim()
        : "";
      if (
        profileCompany &&
        existingCompany &&
        profileCompany === existingCompany
      ) {
        return true;
      }
    }

    return false;
  });
}

function updateJSONFile(profiles, countryCode) {
  const filePath = path.join(
    __dirname,
    "..",
    "data",
    `${countryCode.toLowerCase()}.json`
  );

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const existingData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let addedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  profiles.forEach((profile) => {
    if (isDuplicate(profile, existingData)) {
      console.log(
        `⏭️  Skipping ${profile.name} - duplicate entry already exists`
      );
      skippedCount++;
      return;
    }

    const normalizedUrl = normalizeLinkedInUrl(profile.linkedinUrl);
    const existingIndex = existingData.findIndex(
      (r) => normalizeLinkedInUrl(r.linkedinUrl) === normalizedUrl
    );

    const existingRecruiter =
      existingIndex >= 0 ? existingData[existingIndex] : null;

    const recruiterData = {
      id: existingRecruiter
        ? existingRecruiter.id
        : `${countryCode.toLowerCase()}-${existingData.length + 1}`,
      name: profile.name,
      country: profile.country || COUNTRY_MAP[countryCode],
      company: profile.company || "Unknown Company",
      specialization: profile.skills || [
        "Technical Recruiting",
        "Talent Acquisition",
      ],
      experience: existingRecruiter ? existingRecruiter.experience : "5+ years",
      bio:
        existingRecruiter && existingRecruiter.bio
          ? existingRecruiter.bio
          : `${profile.title || "Technical Recruiter"}${
              profile.company ? ` at ${profile.company}` : ""
            }.${profile.location ? ` Based in ${profile.location}.` : ""}`,
      linkedinUrl: profile.linkedinUrl,
      imageUrl:
        profile.imageUrl ||
        (existingRecruiter ? existingRecruiter.imageUrl : undefined),
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
const inputFile = process.argv[2] || "recuiter.txt";
const countryCode = process.argv[3] || "in";

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  console.error(
    "Usage: node scripts/parse-linkedin-cards.js <input-file> <country-code>"
  );
  process.exit(1);
}

console.log(`Reading ${inputFile}...`);
const htmlContent = fs.readFileSync(inputFile, "utf8");

console.log("Extracting recruiter profiles from LinkedIn cards...");
const profiles = extractProfilesFromHTML(htmlContent);

console.log(`\nFound ${profiles.length} recruiters:`);
profiles.forEach((p, i) => {
  console.log(
    `${i + 1}. ${p.name} - ${p.company || "Unknown"} - ${p.title || "N/A"}`
  );
});

if (profiles.length > 0) {
  console.log(`\nUpdating ${countryCode.toUpperCase()} JSON file...`);
  updateJSONFile(profiles, countryCode);
  console.log("\n✅ Done!");
} else {
  console.log(
    "\n⚠️  No recruiters found in HTML. The file may not contain recruiter profiles."
  );
  console.log(
    '   Make sure the HTML contains profiles with titles like "Recruiter", "Talent Acquisition", etc.'
  );
}
