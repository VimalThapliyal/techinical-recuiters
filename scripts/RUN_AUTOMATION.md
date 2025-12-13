# How to Run the Automated LinkedIn Scraper

## Quick Start

```bash
node scripts/scrape-linkedin-direct.js
```

## Step-by-Step Process

### 1. Run the Script
```bash
node scripts/scrape-linkedin-direct.js
```

### 2. Browser Window Opens
- A browser window will automatically open
- It will navigate to LinkedIn login page

### 3. Login Manually (REQUIRED)
- **You must login manually** in the browser window
- Enter your LinkedIn email and password
- Complete any 2FA if required
- Wait until you see your LinkedIn feed/homepage

### 4. Script Continues Automatically
- After 2 minutes, the script checks if you're logged in
- If logged in, it automatically:
  - Searches for "technical recruiter" in India
  - Extracts profile URLs
  - Visits each profile
  - Extracts recruiter data
  - Saves to `data/in.json`

### 5. Monitor Progress
- Watch the terminal for progress updates
- The script will show:
  - How many profiles found
  - Which profiles are being scraped
  - Success/failure for each profile
  - Final summary

## Important Notes

⚠️ **LinkedIn requires login** - You cannot skip this step
⚠️ **Manual interaction needed** - You must login yourself
⚠️ **Rate limiting** - Script uses 5-second delays between profiles
⚠️ **May still hit blocks** - LinkedIn may detect automation

## If It Doesn't Work

### Option 1: Use Manual HTML Extraction (Recommended)
This method always works and takes only 2-3 minutes:

1. Go to: https://www.linkedin.com/search/results/people/
2. Search: "technical recruiter"
3. Filter: Location → India
4. Press F12 → Copy HTML → Save to `recuiter.txt`
5. Run: `node scripts/parse-linkedin-profile-pages.js recuiter.txt in`

### Option 2: Try Again
- Wait 1-2 hours
- Use different LinkedIn account
- Use VPN
- Reduce `maxProfiles` to 5

## Configuration

Edit `scripts/scrape-linkedin-direct.js`:

```javascript
const CONFIG = {
  searchQuery: 'technical recruiter',
  location: 'India',
  maxProfiles: 10,              // Reduce if getting blocked
  delayBetweenProfiles: 5000,   // Increase to 10000 if needed
  requireLogin: true,           // Keep as true
};
```

## Expected Output

```
🚀 Starting Direct LinkedIn Scraper...
🔐 LinkedIn requires login...
   👉 Please login manually...
   ✅ Login detected!
🔍 Searching LinkedIn directly...
  ✅ Found 10 profile URLs
[1/10] 📄 Scraping: https://linkedin.com/in/...
  ✅ Extracted: John Doe
...
✅ Saved to data/in.json
   - Added: 8 new recruiters
   - Skipped: 2 duplicates
```

## Troubleshooting

**"No profiles found"**
- Make sure you logged in successfully
- Check if LinkedIn search page loaded
- Try increasing delays

**"Login status unclear"**
- Make sure you completed login
- Wait for LinkedIn homepage to load
- Try running again

**Browser closes too fast**
- Script keeps browser open for 10 seconds at end
- Check terminal for any errors

