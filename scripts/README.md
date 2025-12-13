# Scripts for Managing Recruiter Data

## scrape-linkedin-playwright.js - Automated LinkedIn Scraper

**⚠️ WARNING**: This script scrapes LinkedIn profiles. Use responsibly and respect LinkedIn's Terms of Service.

**Automated scraper using Playwright** to search Google and extract LinkedIn recruiter profiles.

### Quick Start

```bash
# Install Playwright (first time only)
npm install playwright
npx playwright install chromium

# Run the scraper
node scripts/scrape-linkedin-playwright.js
```

### Features

- 🔍 Automatically searches Google for LinkedIn profiles
- 📄 Extracts recruiter data from LinkedIn profiles
- ✅ Filters only recruiters (skips non-recruiters)
- 🚫 Prevents duplicates
- ⏱️ Built-in rate limiting
- 💾 Saves directly to JSON files

### Configuration

Edit the `CONFIG` object in the script:

```javascript
const CONFIG = {
  searchQuery: "technical recruiter India site:linkedin.com/in",
  maxProfiles: 20,
  delayBetweenProfiles: 3000, // 3 seconds
  countryCode: "in",
};
```

See `scripts/SCRAPE_README.md` for detailed documentation.

---

## parse-linkedin-html.js - Manual HTML Parser

**The easiest way to add recruiters!** This script automatically extracts recruiter data from LinkedIn HTML.

### Usage

```bash
node scripts/parse-linkedin-html.js <input-file> <country-code>
```

### Example

```bash
# Process India recruiters from HTML file
node scripts/parse-linkedin-html.js recuiter.txt in

# Process US recruiters
node scripts/parse-linkedin-html.js us-recruiters.txt us
```

### How to Get the HTML

1. Go to LinkedIn and search for recruiters
2. Open browser DevTools (F12 or Right-click → Inspect)
3. Find the main container with recruiter cards
4. Right-click → Copy → Copy outerHTML
5. Paste into a text file (e.g., `recuiter.txt`)
6. Run the script!

### What It Extracts

- ✅ Name
- ✅ LinkedIn profile URL
- ✅ Profile image URL (from LinkedIn CDN)
- ✅ Company name
- ✅ Location
- ✅ Title/role
- ✅ Specializations

### Features

- ✅ **Smart Filtering**: Only extracts profiles that contain "recruiter", "talent acquisition", "recruitment", "hiring", or "staffing" terms
- ✅ Automatically updates existing recruiters (matches by LinkedIn URL)
- ✅ Adds new recruiters if they don't exist
- ✅ Preserves existing data (IDs, experience, bio)
- ✅ Smart company name extraction
- ✅ Location-based country detection
- ✅ HTML entity decoding
- ✅ Shows which profiles are skipped (non-recruiters)

---

## Adding Real LinkedIn Data (Manual Method)

If you prefer to add data manually, here's how:

### Step 1: Find Recruiters on LinkedIn

1. Go to LinkedIn and search for "Technical Recruiter" or "IT Recruiter"
2. Filter by country (US, UK, Canada, Australia, India)
3. Browse profiles and collect:
   - Full name
   - LinkedIn profile URL (copy the full URL from the address bar)
   - Current company
   - Specializations (from their profile)
   - Years of experience
   - Bio/headline

### Step 2: Add Recruiters Using the Script

Use the `add-recruiter.js` script to add new recruiters:

```bash
node scripts/add-recruiter.js <country-code> <name> <linkedin-url> <company> <specializations> <experience> <bio>
```

**Example:**

```bash
node scripts/add-recruiter.js us "John Smith" "https://www.linkedin.com/in/johnsmith/" "Tech Recruiters Inc" "React,Node.js,TypeScript" "8 years" "Senior technical recruiter specializing in full-stack JavaScript development roles."
```

### Step 3: Manual JSON Editing (Alternative)

You can also directly edit the JSON files in the `data/` directory:

1. Open the appropriate country file (e.g., `data/us.json`)
2. Add a new recruiter object following the existing format
3. Ensure the JSON is valid (proper commas, brackets, etc.)

### Data Format

Each recruiter should follow this structure:

```json
{
  "id": "us-9",
  "name": "Full Name",
  "country": "US",
  "company": "Company Name",
  "specialization": ["Specialization 1", "Specialization 2"],
  "experience": "X years",
  "bio": "Recruiter bio and description",
  "linkedinUrl": "https://www.linkedin.com/in/username/",
  "imageUrl": "/images/recruiters/full-name.jpg"
}
```

### Quick LinkedIn Search URLs

- **US Technical Recruiters**: https://www.linkedin.com/search/results/people/?keywords=technical%20recruiter&geoUrn=%5B%22103644278%22%5D
- **UK Technical Recruiters**: https://www.linkedin.com/search/results/people/?keywords=technical%20recruiter&geoUrn=%5B%22102690519%22%5D
- **Canada Technical Recruiters**: https://www.linkedin.com/search/results/people/?keywords=technical%20recruiter&geoUrn=%5B%22101212242%22%5D
- **Australia Technical Recruiters**: https://www.linkedin.com/search/results/people/?keywords=technical%20recruiter&geoUrn=%5B%22101052761%22%5D
- **India Technical Recruiters**: https://www.linkedin.com/search/results/people/?keywords=technical%20recruiter&geoUrn=%5B%22102693185%22%5D

### Notes

- Always use the full LinkedIn URL (e.g., `https://www.linkedin.com/in/username/`)
- Ensure specializations are in an array format
- Keep bios concise but informative
- Verify LinkedIn URLs are accessible before adding

### Real Profile Example

I've already added one real profile to the US data:

- **Richard Eby**: https://www.linkedin.com/in/thecodingrecruiter/
- Technical recruiter with 15+ years experience, Java/Python developer, ML certified
