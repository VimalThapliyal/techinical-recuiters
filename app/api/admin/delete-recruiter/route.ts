import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { CountryCode } from "@/types/recruiter";

export async function POST(request: NextRequest) {
  try {
    const { recruiterId } = await request.json();

    if (!recruiterId) {
      return NextResponse.json(
        { error: "Recruiter ID is required" },
        { status: 400 }
      );
    }

    // Extract country code from ID (e.g., "in-101" -> "in")
    const countryMatch = recruiterId.match(/^([a-z]+)-/);
    if (!countryMatch) {
      return NextResponse.json(
        { error: "Invalid recruiter ID format" },
        { status: 400 }
      );
    }

    const countryCode = countryMatch[1] as CountryCode;
    const dataFilePath = join(process.cwd(), "data", `${countryCode}.json`);

    if (!existsSync(dataFilePath)) {
      return NextResponse.json(
        { error: "Country data file not found" },
        { status: 404 }
      );
    }

    // Read existing recruiters
    const fileContent = readFileSync(dataFilePath, "utf8");
    const recruiters = JSON.parse(fileContent);

    // Find and remove the recruiter
    const recruiterIndex = recruiters.findIndex(
      (r: any) => r.id === recruiterId
    );

    if (recruiterIndex === -1) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Remove the recruiter
    recruiters.splice(recruiterIndex, 1);

    // Write back to file
    writeFileSync(dataFilePath, JSON.stringify(recruiters, null, 2));

    return NextResponse.json({
      success: true,
      message: "Recruiter deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recruiter:", error);
    return NextResponse.json(
      { error: "Failed to delete recruiter" },
      { status: 500 }
    );
  }
}
