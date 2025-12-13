import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { Recruiter } from "@/types/recruiter";
import { CountryCode } from "@/types/recruiter";
import { isValidCountryCode } from "@/lib/subdomain";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryParam = searchParams.get("country");

    let recruiters: Recruiter[] = [];

    if (countryParam && isValidCountryCode(countryParam)) {
      // Get recruiters for specific country
      const countryCode = countryParam.toLowerCase() as CountryCode;
      const dataFilePath = join(process.cwd(), "data", `${countryCode}.json`);

      if (existsSync(dataFilePath)) {
        const fileContent = readFileSync(dataFilePath, "utf8");
        recruiters = JSON.parse(fileContent);
      }
    } else {
      // Get recruiters from all countries
      const countries: CountryCode[] = ["us", "uk", "ca", "au", "in"];

      for (const country of countries) {
        const dataFilePath = join(process.cwd(), "data", `${country}.json`);
        if (existsSync(dataFilePath)) {
          try {
            const fileContent = readFileSync(dataFilePath, "utf8");
            const countryRecruiters: Recruiter[] = JSON.parse(fileContent);
            recruiters = recruiters.concat(countryRecruiters);
          } catch (error) {
            console.error(`Error reading ${country}.json:`, error);
          }
        }
      }
    }

    return NextResponse.json({ recruiters, total: recruiters.length });
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return NextResponse.json(
      { error: "Failed to fetch recruiters" },
      { status: 500 }
    );
  }
}
