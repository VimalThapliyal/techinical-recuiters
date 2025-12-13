# Quick Scrape Helper - Recommended Method

Since automated Google/LinkedIn scraping is unreliable (due to bot detection), here's the **recommended manual method** that works reliably:

## Step-by-Step (Takes 2-3 minutes)

### 1. Search LinkedIn Directly
- Go to: https://www.linkedin.com/search/results/people/
- Search for: "technical recruiter"
- Filter by: Location → India
- Scroll down to load more results (10-20 profiles)

### 2. Copy HTML
- Press `F12` (or Cmd+Option+I on Mac) to open DevTools
- In the Elements tab, find the main container with recruiter cards
- Right-click on it → Copy → Copy outerHTML

### 3. Save to File
- Paste into `recuiter.txt` (or any text file)

### 4. Run the Parser
```bash
node scripts/parse-linkedin-html.js recuiter.txt in
```

**That's it!** This method is:
- ✅ More reliable (no bot detection)
- ✅ Faster (no delays needed)
- ✅ Works every time
- ✅ Already tested and working

## Why Automated Scraping Fails

- Google detects automation and shows CAPTCHAs
- LinkedIn requires login for many profiles
- Both sites have anti-scraping measures
- Rate limiting blocks automated access

## Alternative: Use Your Existing HTML File

You already have `recuiter.txt` with HTML content. Just run:

```bash
node scripts/parse-linkedin-playwright.js recuiter.txt in
```

This will extract all recruiters from your existing HTML file!

