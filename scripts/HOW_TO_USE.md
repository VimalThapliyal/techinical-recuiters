# How to Use the LinkedIn HTML Parser Script

This guide will walk you through using the `parse-linkedin-html.js` script to automatically extract recruiter data from LinkedIn HTML.

## Prerequisites

- Node.js installed on your computer
- A text file containing LinkedIn HTML content
- Basic knowledge of using terminal/command line

## Step-by-Step Instructions

### Step 1: Get LinkedIn HTML Content

1. **Go to LinkedIn** and search for recruiters:
   - Visit: https://www.linkedin.com/search/results/people/
   - Search for: "Technical Recruiter" or "Talent Acquisition"
   - Filter by country (India, US, UK, Canada, Australia)

2. **Open Browser Developer Tools**:
   - Press `F12` (Windows/Linux) or `Cmd + Option + I` (Mac)
   - Or right-click on the page → Select "Inspect" or "Inspect Element"

3. **Find the Recruiter List Container**:
   - In the Elements/Inspector tab, look for the main container with recruiter cards
   - Usually it's a `<div>` with class names like `search-results` or contains multiple recruiter profile cards

4. **Copy the HTML**:
   - Right-click on the main container element
   - Select "Copy" → "Copy outerHTML"
   - Or select the element and press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac)

5. **Save to a Text File**:
   - Open a text editor (Notepad, TextEdit, VS Code, etc.)
   - Paste the copied HTML
   - Save the file (e.g., `recruiters-india.txt` or `recuiter.txt`)
   - Make sure to save it in your project directory or note the full path

### Step 2: Run the Script

Open your terminal/command prompt and navigate to your project directory:

```bash
cd /Users/vimalthapliyal/Desktop/techinical-recuiters
```

Then run the script:

```bash
node scripts/parse-linkedin-html.js <input-file> <country-code>
```

**Parameters:**
- `<input-file>`: Path to your HTML text file (e.g., `recuiter.txt` or `recruiters-india.txt`)
- `<country-code>`: Two-letter country code (`us`, `uk`, `ca`, `au`, `in`)

### Step 3: Examples

**Example 1: Process India recruiters**
```bash
node scripts/parse-linkedin-html.js recuiter.txt in
```

**Example 2: Process US recruiters**
```bash
node scripts/parse-linkedin-html.js us-recruiters.txt us
```

**Example 3: Process UK recruiters**
```bash
node scripts/parse-linkedin-html.js uk-recruiters.txt uk
```

**Example 4: Using full path**
```bash
node scripts/parse-linkedin-html.js /path/to/your/file.txt in
```

### Step 4: Check the Output

The script will:
1. Read your HTML file
2. Extract recruiter information
3. Show you what it found:
   ```
   Found 3 recruiters:
   1. Isha Piwal - OKAYA INFOCOM - https://www.linkedin.com/in/ishapiwal/
   2. Aniket Kushwah - Deloitte - https://www.linkedin.com/in/aniket-kushwah-461bab168/
   3. Vanita Chugh - Argenbright Group - https://www.linkedin.com/in/vanitachugh/
   ```
4. Update the JSON file and show a summary:
   ```
   ✅ Summary:
      - Added: 2 new recruiters
      - Updated: 1 existing recruiter
      - Skipped: 0 duplicates
      - Total in file: 5 recruiters
   ```

### Step 5: Verify the Results

Check the updated JSON file:
- India: `data/in.json`
- US: `data/us.json`
- UK: `data/uk.json`
- Canada: `data/ca.json`
- Australia: `data/au.json`

## What the Script Extracts

The script automatically extracts:
- ✅ **Name**: Full name of the recruiter
- ✅ **LinkedIn URL**: Profile URL
- ✅ **Profile Image**: Real LinkedIn profile photo URL
- ✅ **Company**: Current company name
- ✅ **Location**: City, State, Country
- ✅ **Title/Role**: Job title (e.g., "Technical Recruiter")
- ✅ **Specializations**: Skills and specializations

## Important Notes

### Filtering
- The script **only extracts profiles that contain recruiter-related terms**:
  - "recruiter"
  - "talent acquisition"
  - "recruitment"
  - "hiring"
  - "staffing"
- Non-recruiter profiles will be skipped automatically

### Duplicate Prevention
- The script **prevents duplicates** by checking:
  - LinkedIn URL (normalized)
  - Name + Company combination
- If a recruiter already exists, it will be skipped or updated

### File Format
- The HTML file should contain the raw HTML from LinkedIn
- It can be a single line or formatted - the script handles both
- Make sure the file contains the recruiter profile cards

## Troubleshooting

### "File not found" Error
- Make sure the file path is correct
- Use full path if the file is in a different directory
- Check that the file name and extension are correct

### "No recruiters found" Message
- Verify the HTML contains recruiter profile cards
- Make sure you copied the correct container element
- Check that the HTML includes LinkedIn profile URLs

### "Skipping - not a recruiter profile"
- This is normal - the script filters out non-recruiters
- Only profiles with recruiter-related terms are extracted

### Too Many Duplicates
- This means the recruiters already exist in your JSON file
- This is expected behavior - duplicates are prevented automatically

## Tips for Best Results

1. **Copy the Right Element**: Make sure you copy the container with all recruiter cards, not just one card
2. **Fresh Data**: If you've already processed a file, running it again will skip duplicates
3. **Multiple Files**: You can process multiple HTML files - just run the script multiple times
4. **Large Files**: The script can handle large HTML files with many recruiters

## Quick Reference

```bash
# Basic usage
node scripts/parse-linkedin-html.js <file> <country>

# Country codes
in  → India
us  → United States
uk  → United Kingdom
ca  → Canada
au  → Australia

# Example
node scripts/parse-linkedin-html.js recuiter.txt in
```

## Need Help?

If you encounter issues:
1. Check that Node.js is installed: `node --version`
2. Verify the file path is correct
3. Make sure the HTML contains recruiter profile data
4. Check the console output for specific error messages

