/**
 * Playwright script to scrape LinkedIn recruiter profiles from Google search
 * 
 * ⚠️  WARNING: This script is for educational purposes only.
 * LinkedIn's Terms of Service prohibit automated scraping.
 * Use responsibly with proper delays and rate limiting.
 * 
 * Usage: node scripts/scrape-linkedin-playwright.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  searchQuery: 'technical recruiter India site:linkedin.com/in',
  maxProfiles: 20, // Limit to avoid rate limiting
  delayBetweenProfiles: 3000, // 3 seconds delay between profiles
  delayBetweenPages: 2000, // 2 seconds delay between pages
  outputFile: path.join(__dirname, '..', 'data', 'scraped-recruiters.json'),
  countryCode: 'in',
};

// Country mapping
const COUNTRY_MAP = {
  us: 'US',
  uk: 'UK',
  ca: 'CA',
  au: 'AU',
  in: 'IN',
};

async function searchGoogleForLinkedInProfiles(page, query, maxResults = 20) {
  console.log(`🔍 Searching Google for: "${query}"`);
  
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=20`;
  console.log(`  Navigating to: ${searchUrl}`);
  await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000); // Wait longer for page to fully load
  
  // Take a screenshot for debugging (optional)
  // await page.screenshot({ path: 'google-search.png' });
  
  // Check if we got blocked or see a CAPTCHA
  const pageTitle = await page.title();
  console.log(`  Page title: ${pageTitle}`);
  
  if (pageTitle.toLowerCase().includes('captcha') || pageTitle.toLowerCase().includes('unusual traffic')) {
    console.log('  ⚠️  Google may be showing CAPTCHA or blocking automated access');
    console.log('  💡 Tip: Try running the script in non-headless mode to see what\'s happening');
  }
  
  // Handle cookie consent if present
  try {
    const acceptSelectors = [
      'button:has-text("Accept")',
      'button:has-text("I agree")',
      '#L2AGLb',
      'button[id*="accept"]',
      '[aria-label*="Accept"]',
    ];
    
    for (const selector of acceptSelectors) {
      try {
        const button = page.locator(selector).first();
        if (await button.isVisible({ timeout: 1000 })) {
          await button.click();
          await page.waitForTimeout(1000);
          break;
        }
      } catch (e) {
        continue;
      }
    }
  } catch (e) {
    // No cookie consent, continue
  }
  
  // Wait for search results to load
  await page.waitForTimeout(2000);
  
  const profileUrls = [];
  
  // Try multiple selectors to find LinkedIn links
  const linkSelectors = [
    'a[href*="linkedin.com/in/"]',
    'a[href*="/url?q=https://www.linkedin.com/in/"]',
    'a[href*="/url?q=http://www.linkedin.com/in/"]',
    '.g a[href*="linkedin"]',
    'h3 a[href*="linkedin"]',
  ];
  
  for (const selector of linkSelectors) {
    try {
      const links = await page.locator(selector).all();
      console.log(`  Found ${links.length} links with selector: ${selector}`);
      
      for (const link of links) {
        try {
          let href = await link.getAttribute('href');
          if (!href) continue;
          
          // Extract clean LinkedIn URL from Google redirect
          if (href.startsWith('/url?q=')) {
            href = decodeURIComponent(href.split('/url?q=')[1].split('&')[0]);
          } else if (href.includes('/url?q=')) {
            const match = href.match(/\/url\?q=([^&]+)/);
            if (match) {
              href = decodeURIComponent(match[1]);
            }
          }
          
          // Clean up the URL
          if (href.includes('linkedin.com/in/')) {
            // Extract just the LinkedIn URL part
            const linkedinMatch = href.match(/(https?:\/\/[^\/]+linkedin\.com\/in\/[^\/\?&#]+)/);
            if (linkedinMatch) {
              let url = linkedinMatch[1];
              // Remove trailing slash
              url = url.replace(/\/$/, '');
              
              if (!profileUrls.includes(url)) {
                profileUrls.push(url);
                console.log(`    ✅ Found: ${url}`);
                if (profileUrls.length >= maxResults) break;
              }
            }
          }
        } catch (e) {
          // Continue to next link
        }
      }
      
      if (profileUrls.length >= maxResults) break;
    } catch (e) {
      console.log(`  ⚠️  Selector ${selector} failed: ${e.message}`);
    }
  }
  
  // If still no results, try to get all links and filter using page.evaluate
  if (profileUrls.length === 0) {
    console.log('  Trying alternative method: extracting all links from page...');
    try {
      const allLinks = await page.evaluate(() => {
        const links = [];
        // Get all anchor tags
        document.querySelectorAll('a').forEach(link => {
          const href = link.getAttribute('href') || link.href;
          if (href && href.includes('linkedin.com/in/')) {
            links.push(href);
          }
        });
        return links;
      });
      
      console.log(`  Found ${allLinks.length} total links containing "linkedin.com/in/"`);
      
      for (const href of allLinks) {
        if (href.includes('linkedin.com/in/')) {
          // Handle Google redirect URLs
          let cleanUrl = href;
          if (href.includes('/url?q=')) {
            try {
              const urlMatch = href.match(/\/url\?q=([^&]+)/);
              if (urlMatch) {
                cleanUrl = decodeURIComponent(urlMatch[1]);
              }
            } catch (e) {
              // Continue with original href
            }
          }
          
          // Extract LinkedIn profile URL
          const linkedinMatch = cleanUrl.match(/(https?:\/\/[^\/]*linkedin\.com\/in\/[^\/\?&#\s]+)/i);
          if (linkedinMatch) {
            let url = linkedinMatch[1].replace(/\/$/, '').toLowerCase();
            // Normalize www
            url = url.replace('://www.', '://');
            
            if (!profileUrls.includes(url)) {
              profileUrls.push(url);
              console.log(`    ✅ Extracted: ${url}`);
              if (profileUrls.length >= maxResults) break;
            }
          }
        }
      }
    } catch (e) {
      console.error('  Error in alternative method:', e.message);
    }
  }
  
  console.log(`✅ Found ${profileUrls.length} LinkedIn profile URLs`);
  return profileUrls;
}

async function scrapeLinkedInProfile(page, profileUrl) {
  try {
    console.log(`📄 Scraping: ${profileUrl}`);
    await page.goto(profileUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const recruiter = {
      linkedinUrl: profileUrl,
      name: null,
      company: null,
      location: null,
      title: null,
      imageUrl: null,
      bio: null,
    };
    
    // Extract name
    try {
      const nameSelectors = [
        'h1.text-heading-xlarge',
        'h1[data-anonymize="person-name"]',
        'h1',
        '.pv-text-details__left-panel h1',
      ];
      
      for (const selector of nameSelectors) {
        const nameElement = page.locator(selector).first();
        if (await nameElement.isVisible({ timeout: 1000 })) {
          recruiter.name = (await nameElement.textContent()).trim();
          break;
        }
      }
    } catch (e) {
      console.warn(`  ⚠️  Could not extract name`);
    }
    
    // Extract title/headline
    try {
      const titleSelectors = [
        '.text-body-medium.break-words',
        '.pv-text-details__left-panel .text-body-medium',
        '[data-anonymize="headline"]',
      ];
      
      for (const selector of titleSelectors) {
        const titleElement = page.locator(selector).first();
        if (await titleElement.isVisible({ timeout: 1000 })) {
          recruiter.title = (await titleElement.textContent()).trim();
          break;
        }
      }
    } catch (e) {
      console.warn(`  ⚠️  Could not extract title`);
    }
    
    // Extract location
    try {
      const locationSelectors = [
        '.text-body-small.inline.t-black--light.break-words',
        '[data-anonymize="location"]',
        '.pv-text-details__left-panel .text-body-small',
      ];
      
      for (const selector of locationSelectors) {
        const locationElement = page.locator(selector).first();
        if (await locationElement.isVisible({ timeout: 1000 })) {
          recruiter.location = (await locationElement.textContent()).trim();
          break;
        }
      }
    } catch (e) {
      console.warn(`  ⚠️  Could not extract location`);
    }
    
    // Extract profile image
    try {
      const imageSelectors = [
        'img[data-anonymize="person-photo"]',
        '.pv-top-card-profile-picture__image',
        'img.profile-photo-edit__preview',
        'img[alt*="profile"]',
      ];
      
      for (const selector of imageSelectors) {
        const imageElement = page.locator(selector).first();
        if (await imageElement.isVisible({ timeout: 1000 })) {
          recruiter.imageUrl = await imageElement.getAttribute('src');
          if (recruiter.imageUrl && recruiter.imageUrl.includes('media.licdn.com')) {
            break;
          }
        }
      }
    } catch (e) {
      console.warn(`  ⚠️  Could not extract image`);
    }
    
    // Extract company from experience section
    try {
      const experienceSection = page.locator('#experience').or(page.locator('[data-section="experience"]'));
      if (await experienceSection.isVisible({ timeout: 2000 })) {
        const companyElement = experienceSection.locator('.t-14.t-normal span[aria-hidden="true"]').first();
        if (await companyElement.isVisible({ timeout: 1000 })) {
          recruiter.company = (await companyElement.textContent()).trim();
        }
      }
    } catch (e) {
      // Try alternative method - extract from title/headline
      if (recruiter.title) {
        const atMatch = recruiter.title.match(/at\s+([^•,]+)/i);
        if (atMatch) {
          recruiter.company = atMatch[1].trim();
        }
      }
    }
    
    // Extract bio/about section
    try {
      const aboutSection = page.locator('#about').or(page.locator('[data-section="summary"]'));
      if (await aboutSection.isVisible({ timeout: 2000 })) {
        const bioElement = aboutSection.locator('.inline-show-more-text span[aria-hidden="true"]').first();
        if (await bioElement.isVisible({ timeout: 1000 })) {
          recruiter.bio = (await bioElement.textContent()).trim();
        }
      }
    } catch (e) {
      // Use title as bio if available
      if (recruiter.title) {
        recruiter.bio = recruiter.title;
      }
    }
    
    // Check if this is actually a recruiter
    const isRecruiter = recruiter.title && (
      recruiter.title.toLowerCase().includes('recruiter') ||
      recruiter.title.toLowerCase().includes('talent acquisition') ||
      recruiter.title.toLowerCase().includes('recruitment') ||
      recruiter.title.toLowerCase().includes('hiring') ||
      recruiter.title.toLowerCase().includes('staffing')
    );
    
    if (!isRecruiter) {
      console.log(`  ⏭️  Skipping ${recruiter.name || 'Unknown'} - not a recruiter`);
      return null;
    }
    
    console.log(`  ✅ Extracted: ${recruiter.name || 'Unknown'}`);
    return recruiter;
    
  } catch (error) {
    console.error(`  ❌ Error scraping ${profileUrl}:`, error.message);
    return null;
  }
}

async function saveToJSON(recruiters, countryCode) {
  const filePath = path.join(__dirname, '..', 'data', `${countryCode.toLowerCase()}.json`);
  
  let existingData = [];
  if (fs.existsSync(filePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.warn('Could not read existing file, starting fresh');
    }
  }
  
  // Normalize LinkedIn URL for duplicate checking
  function normalizeUrl(url) {
    if (!url) return '';
    return url.split('?')[0].split('#')[0].replace(/\/$/, '').toLowerCase();
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
      company: recruiter.company || 'Unknown Company',
      specialization: ['Technical Recruiting', 'Talent Acquisition'],
      experience: '5+ years',
      bio: recruiter.bio || recruiter.title || 'Technical Recruiter',
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
  console.log('🚀 Starting LinkedIn recruiter scraper...\n');
  console.log('⚠️  WARNING: This script scrapes LinkedIn profiles.');
  console.log('   Please use responsibly with proper delays and rate limiting.\n');
  
  // Stealth configuration to avoid detection
  const browser = await chromium.launch({
    headless: false, // Keep visible to avoid detection
    slowMo: 1000, // Slower, more human-like
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });
  
  // Create context with realistic browser fingerprint
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'America/New_York',
    permissions: [],
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    },
  });
  
  // Remove webdriver property
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
    
    // Override plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });
    
    // Override languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
  });
  
  const page = await context.newPage();
  
  try {
    // Step 1: Search Google for LinkedIn profiles
    const profileUrls = await searchGoogleForLinkedInProfiles(page, CONFIG.searchQuery, CONFIG.maxProfiles);
    
    if (profileUrls.length === 0) {
      console.log('❌ No LinkedIn profiles found in search results');
      await browser.close();
      return;
    }
    
    // Step 2: Scrape each profile
    const recruiters = [];
    for (let i = 0; i < profileUrls.length; i++) {
      const profileUrl = profileUrls[i];
      console.log(`\n[${i + 1}/${profileUrls.length}]`);
      
      const recruiter = await scrapeLinkedInProfile(page, profileUrl);
      if (recruiter) {
        recruiters.push(recruiter);
      }
      
      // Delay between profiles to avoid rate limiting
      if (i < profileUrls.length - 1) {
        await page.waitForTimeout(CONFIG.delayBetweenProfiles);
      }
    }
    
    // Step 3: Save to JSON
    if (recruiters.length > 0) {
      await saveToJSON(recruiters, CONFIG.countryCode);
    } else {
      console.log('\n❌ No recruiters found to save');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Scraping completed');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };

