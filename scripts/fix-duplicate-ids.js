/**
 * Script to find and fix duplicate recruiter IDs in JSON files.
 * Ensures all recruiter IDs are unique by regenerating duplicates.
 *
 * Usage: node scripts/fix-duplicate-ids.js <country-code>
 * Example: node scripts/fix-duplicate-ids.js in
 */

const fs = require("fs");
const path = require("path");

function generateUniqueId(countryCode, existingIds) {
  let counter = 1;
  let newId;

  do {
    newId = `${countryCode.toLowerCase()}-${counter}`;
    counter++;
    // Safety check to prevent infinite loop
    if (counter > 100000) {
      newId = `${countryCode.toLowerCase()}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      break;
    }
  } while (existingIds.has(newId));

  return newId;
}

function fixDuplicateIds(data, countryCode) {
  const seenIds = new Set();
  const fixedData = [];
  let fixedCount = 0;

  data.forEach((recruiter, index) => {
    if (!recruiter.id) {
      // If no ID, generate one
      recruiter.id = generateUniqueId(countryCode, seenIds);
      fixedCount++;
      console.log(
        `  ⚠️  Missing ID at index ${index}: Generated ${recruiter.id}`
      );
    } else if (seenIds.has(recruiter.id)) {
      // Duplicate ID found, generate new one
      const oldId = recruiter.id;
      recruiter.id = generateUniqueId(countryCode, seenIds);
      fixedCount++;
      console.log(
        `  🔄 Duplicate ID at index ${index}: ${oldId} → ${recruiter.id}`
      );
    }

    seenIds.add(recruiter.id);
    fixedData.push(recruiter);
  });

  return { fixedData, fixedCount };
}

// Main execution
const countryCode = process.argv[2] || "in";
const filePath = path.join(
  __dirname,
  "..",
  "data",
  `${countryCode.toLowerCase()}.json`
);

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

console.log(`Reading ${filePath}...`);
const originalData = JSON.parse(fs.readFileSync(filePath, "utf8"));
console.log(`\nOriginal count: ${originalData.length} recruiters`);

// Check for duplicates
const ids = originalData.map((r) => r.id || "NO_ID");
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
const uniqueDuplicates = [...new Set(duplicates)];

if (uniqueDuplicates.length > 0) {
  console.log(`\n📊 Found ${uniqueDuplicates.length} duplicate ID(s):`);
  uniqueDuplicates.slice(0, 10).forEach((dup) => {
    const count = ids.filter((id) => id === dup).length;
    console.log(`   - ${dup}: appears ${count} time(s)`);
  });
  if (uniqueDuplicates.length > 10) {
    console.log(`   ... and ${uniqueDuplicates.length - 10} more.`);
  }
} else {
  console.log(`\n✅ No duplicate IDs found!`);
}

// Check for missing IDs
const missingIds = originalData.filter((r) => !r.id || r.id.trim() === "");
if (missingIds.length > 0) {
  console.log(`\n⚠️  Found ${missingIds.length} recruiter(s) with missing IDs`);
} else {
  console.log(`\n✅ All recruiters have IDs`);
}

if (duplicates.length > 0 || missingIds.length > 0) {
  console.log(`\n🔧 Fixing duplicate and missing IDs...`);
  const { fixedData, fixedCount } = fixDuplicateIds(originalData, countryCode);

  // Create a backup before writing
  const backupPath = `${filePath}.backup.${Date.now()}`;
  fs.writeFileSync(backupPath, JSON.stringify(originalData, null, 2));
  console.log(`\n📦 Backup created: ${backupPath}`);

  fs.writeFileSync(filePath, JSON.stringify(fixedData, null, 2));
  console.log(`\n✅ Fixed ${fixedCount} ID(s)`);
  console.log(`✅ Cleaned data written to ${filePath}`);

  // Verify no duplicates remain
  const newIds = fixedData.map((r) => r.id);
  const newDuplicates = newIds.filter(
    (id, index) => newIds.indexOf(id) !== index
  );
  if (newDuplicates.length === 0) {
    console.log(`\n✅ Verification: No duplicate IDs remaining!`);
  } else {
    console.log(
      `\n⚠️  Warning: ${newDuplicates.length} duplicate(s) still found after fix`
    );
  }
} else {
  console.log(`\n✅ No fixes needed. Data is clean!`);
}

console.log("\n✅ Done!");
