# LinkedIn Scraper with Playwright

⚠️ **IMPORTANT DISCLAIMER**: 
- This script is for educational purposes only
- LinkedIn's Terms of Service prohibit automated scraping
- Use responsibly with proper delays and rate limiting
- Always respect robots.txt and website terms
- Consider using LinkedIn's official API for production use

## Installation

```bash
npm install playwright
npx playwright install chromium
```

## Usage

```bash
node scripts/scrape-linkedin-playwright.js
```

## Configuration

Edit the `CONFIG` object in the script to customize:

```javascript
const CONFIG = {
  searchQuery: 'technical recruiter India site:linkedin.com/in',
  maxProfiles: 20, // Limit to avoid rate limiting
  delayBetweenProfiles: 3000, // 3 seconds delay
  delayBetweenPages: 2000, // 2 seconds delay
  countryCode: 'in',
};
```

## How It Works

1. **Searches Google** for LinkedIn profiles matching the query
2. **Extracts LinkedIn URLs** from search results
3. **Visits each profile** with delays to avoid rate limiting
4. **Extracts data**: Name, Company, Location, Title, Image, Bio
5. **Filters recruiters**: Only saves profiles with recruiter-related terms
6. **Saves to JSON**: Updates the country-specific JSON file

## Features

- ✅ Automatic Google search for LinkedIn profiles
- ✅ Profile data extraction (name, company, location, image, etc.)
- ✅ Recruiter filtering (only saves actual recruiters)
- ✅ Duplicate prevention
- ✅ Rate limiting with delays
- ✅ Error handling
- ✅ Progress logging

## Customization

### Change Search Query

```javascript
searchQuery: 'technical recruiter US site:linkedin.com/in', // For US
searchQuery: 'talent acquisition UK site:linkedin.com/in', // For UK
```

### Adjust Rate Limiting

```javascript
delayBetweenProfiles: 5000, // 5 seconds (more conservative)
delayBetweenPages: 3000,    // 3 seconds
```

### Change Output

```javascript
countryCode: 'us', // Change to 'us', 'uk', 'ca', 'au', 'in'
```

## Troubleshooting

### "No profiles found"
- Check your internet connection
- Google may have changed their HTML structure
- Try a different search query

### "Rate limited" or "Blocked"
- Increase delays between requests
- Reduce maxProfiles
- Use a VPN or different IP
- Wait before running again

### "Login required"
- LinkedIn may require login for some profiles
- Consider logging in manually in the browser
- Some profiles may be private

## Best Practices

1. **Use delays**: Always include delays between requests
2. **Limit requests**: Don't scrape too many profiles at once
3. **Respect robots.txt**: Check website policies
4. **Monitor for blocks**: Watch for rate limiting or blocks
5. **Use responsibly**: Only scrape publicly available data

## Alternative: Manual HTML Extraction

If automated scraping doesn't work, use the manual HTML extraction method:
- See `scripts/parse-linkedin-html.js` for manual HTML parsing
- Copy HTML from LinkedIn search results
- Process with the HTML parser script

