/**
 * Direct LinkedIn scraper - bypasses Google, goes straight to LinkedIn
 * Uses stealth techniques to avoid detection
 *
 * ⚠️  WARNING: This script scrapes LinkedIn directly.
 * LinkedIn actively blocks automated scraping.
 * Use at your own risk with proper delays.
 *
 * Usage: node scripts/scrape-linkedin-direct.js
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const CONFIG = {
  searchQuery: "technical recruiter",
  location: "India",
  maxProfiles: 10, // Start small to avoid detection
  delayBetweenProfiles: 5000, // 5 seconds - be conservative
  delayBetweenActions: 2000, // 2 seconds between actions
  countryCode: "in",
  // Set to true if you want to login first (HIGHLY RECOMMENDED)
  requireLogin: true, // LinkedIn requires login to see search results
};

const COUNTRY_MAP = {
  us: "US",
  uk: "UK",
  ca: "CA",
  au: "AU",
  in: "IN",
};

async function loginToLinkedIn(page) {
  if (!CONFIG.requireLogin) {
    console.log("ℹ️  Skipping login (set requireLogin: true to enable)");
    return true;
  }

  console.log("🔐 LinkedIn requires login to view search results.");
  console.log("   Opening LinkedIn login page...");
  console.log(
    "   ⚠️  IMPORTANT: You need to login manually in the browser window that just opened."
  );
  console.log("   ⚠️  The script will wait for you to complete the login.\n");

  // Navigate to LinkedIn login
  await page.goto("https://www.linkedin.com/login", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(3000);

  console.log("   👉 Browser window opened with LinkedIn login page.");
  console.log(
    "   👉 Please login with your LinkedIn credentials in that window."
  );
  console.log(
    "   👉 After logging in, come back here and the script will continue...\n"
  );
  console.log(
    "   ⏳ Waiting 2 minutes for login (you can take your time)...\n"
  );

  // Wait for user to login manually - give plenty of time
  await page.waitForTimeout(120000); // 2 minutes

  // Check if we're logged in by looking for search or profile elements
  console.log("   🔍 Checking if login was successful...");

  // Try multiple ways to detect login
  let isLoggedIn = false;

  try {
    // Check for search input (logged in users see this)
    isLoggedIn = await page
      .locator('input[placeholder*="Search"], input[aria-label*="Search"]')
      .isVisible({ timeout: 3000 });
  } catch (e) {
    try {
      // Check for navigation bar
      isLoggedIn = await page
        .locator('nav[aria-label="Primary"], .global-nav')
        .isVisible({ timeout: 3000 });
    } catch (e2) {
      try {
        // Check if we're on feed or home page (logged in)
        const currentUrl = page.url();
        isLoggedIn =
          currentUrl.includes("linkedin.com/feed") ||
          currentUrl.includes("linkedin.com/in/") ||
          !currentUrl.includes("/login");
      } catch (e3) {
        isLoggedIn = false;
      }
    }
  }

  if (isLoggedIn) {
    console.log("   ✅ Login detected! Continuing with scraping...\n");
    await page.waitForTimeout(2000);
    return true;
  } else {
    console.log("   ⚠️  Could not confirm login status.");
    console.log(
      "   💡 If you logged in, the script will try to search anyway."
    );
    console.log("   💡 If search fails, you may need to login again.\n");
    return false;
  }
}

async function searchLinkedInDirectly(page, query, location) {
  console.log(`🔍 Searching LinkedIn directly for: "${query}" in ${location}`);

  // Navigate to LinkedIn search
  const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
    query
  )}&geoUrn=%5B%22102693185%22%5D`; // India geo code

  await page.goto(searchUrl, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(CONFIG.delayBetweenActions);

  // Handle login prompt if appears
  try {
    const signInButton = page.locator('a[href*="/login"]').first();
    if (await signInButton.isVisible({ timeout: 3000 })) {
      console.log(
        "⚠️  Login required. Please login manually or set requireLogin: true"
      );
      await page.waitForTimeout(30000); // Wait for manual login
    }
  } catch (e) {
    // No login prompt, continue
  }

  // Wait for search results to load
  await page
    .waitForSelector(".reusable-search__result-container", { timeout: 10000 })
    .catch(() => {
      console.log("⚠️  Search results may not have loaded");
    });

  await page.waitForTimeout(CONFIG.delayBetweenActions);

  // Scroll to load more results
  console.log("  Scrolling to load more results...");
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
  }

  // Extract profile URLs
  const profileUrls = [];

  try {
    const profileLinks = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('a[href*="/in/"]').forEach((link) => {
        const href = link.getAttribute("href");
        if (
          href &&
          href.includes("/in/") &&
          !href.includes("/overlay/") &&
          !href.includes("/contact-info/")
        ) {
          const cleanUrl = href.split("?")[0].split("#")[0];
          if (cleanUrl.startsWith("/in/")) {
            links.push("https://www.linkedin.com" + cleanUrl);
          } else if (cleanUrl.startsWith("http")) {
            links.push(cleanUrl);
          }
        }
      });
      return [...new Set(links)]; // Remove duplicates
    });

    profileUrls.push(...profileLinks);
    console.log(`  ✅ Found ${profileUrls.length} profile URLs`);
  } catch (e) {
    console.error("  ❌ Error extracting profile URLs:", e.message);
  }

  return profileUrls.slice(0, CONFIG.maxProfiles);
}

async function scrapeLinkedInProfile(page, profileUrl) {
  try {
    console.log(`📄 Scraping: ${profileUrl}`);

    await page.goto(profileUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(CONFIG.delayBetweenActions);

    const recruiter = {
      linkedinUrl: profileUrl,
      name: null,
      company: null,
      location: null,
      title: null,
      imageUrl: null,
      bio: null,
    };

    // Extract data using page.evaluate for better reliability
    const profileData = await page.evaluate(() => {
      const data = {};

      // Name
      const nameEl = document.querySelector(
        'h1.text-heading-xlarge, h1[data-anonymize="person-name"], .pv-text-details__left-panel h1'
      );
      if (nameEl) data.name = nameEl.textContent.trim();

      // Title
      const titleEl = document.querySelector(
        ".text-body-medium.break-words, .pv-text-details__left-panel .text-body-medium"
      );
      if (titleEl) data.title = titleEl.textContent.trim();

      // Location
      const locationEl = document.querySelector(
        '.text-body-small.inline.t-black--light.break-words, [data-anonymize="location"]'
      );
      if (locationEl) data.location = locationEl.textContent.trim();

      // Image
      const imgEl = document.querySelector(
        'img[data-anonymize="person-photo"], .pv-top-card-profile-picture__image, img.profile-photo-edit__preview'
      );
      if (imgEl && imgEl.src) data.imageUrl = imgEl.src;

      // Company from experience
      const companyEl = document.querySelector(
        '#experience ~ * .t-14.t-normal span[aria-hidden="true"], .experience-section .t-14 span'
      );
      if (companyEl) data.company = companyEl.textContent.trim();

      // Bio
      const bioEl = document.querySelector(
        '#about ~ * .inline-show-more-text span[aria-hidden="true"], .summary-section .inline-show-more-text'
      );
      if (bioEl) data.bio = bioEl.textContent.trim();

      return data;
    });

    Object.assign(recruiter, profileData);

    // Check if recruiter
    const isRecruiter =
      recruiter.title &&
      (recruiter.title.toLowerCase().includes("recruiter") ||
        recruiter.title.toLowerCase().includes("talent acquisition") ||
        recruiter.title.toLowerCase().includes("recruitment") ||
        recruiter.title.toLowerCase().includes("hiring"));

    if (!isRecruiter) {
      console.log(
        `  ⏭️  Skipping ${recruiter.name || "Unknown"} - not a recruiter`
      );
      return null;
    }

    console.log(`  ✅ Extracted: ${recruiter.name || "Unknown"}`);
    return recruiter;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return null;
  }
}

async function saveToJSON(recruiters, countryCode) {
  const filePath = path.join(
    __dirname,
    "..",
    "data",
    `${countryCode.toLowerCase()}.json`
  );

  let existingData = [];
  if (fs.existsSync(filePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      console.warn("Could not read existing file");
    }
  }

  function normalizeUrl(url) {
    if (!url) return "";
    return url.split("?")[0].split("#")[0].replace(/\/$/, "").toLowerCase();
  }

  let addedCount = 0;
  let skippedCount = 0;

  recruiters.forEach((recruiter) => {
    if (!recruiter || !recruiter.name || !recruiter.linkedinUrl) {
      skippedCount++;
      return;
    }

    const normalizedUrl = normalizeUrl(recruiter.linkedinUrl);
    const existingIndex = existingData.findIndex(
      (r) => normalizeUrl(r.linkedinUrl) === normalizedUrl
    );

    if (existingIndex >= 0) {
      console.log(`  ⏭️  Skipping ${recruiter.name} - already exists`);
      skippedCount++;
      return;
    }

    const recruiterData = {
      id: `${countryCode.toLowerCase()}-${existingData.length + 1}`,
      name: recruiter.name,
      country: COUNTRY_MAP[countryCode] || countryCode.toUpperCase(),
      company: recruiter.company || "Unknown Company",
      specialization: ["Technical Recruiting", "Talent Acquisition"],
      experience: "5+ years",
      bio: recruiter.bio || recruiter.title || "Technical Recruiter",
      linkedinUrl: recruiter.linkedinUrl,
      imageUrl: recruiter.imageUrl || undefined,
    };

    existingData.push(recruiterData);
    addedCount++;
  });

  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
  console.log(`\n✅ Saved to ${filePath}`);
  console.log(`   - Added: ${addedCount} new recruiters`);
  console.log(`   - Skipped: ${skippedCount} duplicates/invalid`);
  console.log(`   - Total: ${existingData.length} recruiters`);
}

async function main() {
  console.log("🚀 Starting Direct LinkedIn Scraper...\n");
  console.log("⚠️  IMPORTANT:");
  console.log("   - LinkedIn actively blocks automated scraping");
  console.log("   - Use with long delays (5+ seconds between profiles)");
  console.log("   - Consider logging in manually first");
  console.log("   - May still encounter CAPTCHA or blocks\n");

  const browser = await chromium.launch({
    headless: false, // Keep visible
    slowMo: 1000,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  // Remove webdriver detection
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  const page = await context.newPage();

  try {
    // Login first (required for LinkedIn search)
    const loggedIn = await loginToLinkedIn(page);

    if (!loggedIn) {
      console.log(
        "⚠️  Login may not have completed. Trying to search anyway..."
      );
    }

    // Search LinkedIn directly
    const profileUrls = await searchLinkedInDirectly(
      page,
      CONFIG.searchQuery,
      CONFIG.location
    );

    if (profileUrls.length === 0) {
      console.log("❌ No profiles found. LinkedIn may be blocking access.");
      console.log("💡 Try:");
      console.log("   1. Login manually first (set requireLogin: true)");
      console.log("   2. Increase delays in CONFIG");
      console.log("   3. Use the manual HTML extraction method instead");
      await browser.close();
      return;
    }

    // Scrape each profile
    const recruiters = [];
    for (let i = 0; i < profileUrls.length; i++) {
      console.log(`\n[${i + 1}/${profileUrls.length}]`);
      const recruiter = await scrapeLinkedInProfile(page, profileUrls[i]);
      if (recruiter) {
        recruiters.push(recruiter);
      }

      if (i < profileUrls.length - 1) {
        await page.waitForTimeout(CONFIG.delayBetweenProfiles);
      }
    }

    // Save to JSON
    if (recruiters.length > 0) {
      await saveToJSON(recruiters, CONFIG.countryCode);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    console.log("\n⏸️  Keeping browser open for 10 seconds...");
    await page.waitForTimeout(10000);
    await browser.close();
    console.log("✅ Done");
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
