import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { CountryCode } from "@/types/recruiter";

export async function POST(request: NextRequest) {
  try {
    const { recruiterId, isActive } = await request.json();

    if (!recruiterId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Recruiter ID and isActive status are required" },
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

    // Find and update the recruiter
    const recruiterIndex = recruiters.findIndex(
      (r: any) => r.id === recruiterId
    );

    if (recruiterIndex === -1) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Update isActive status
    recruiters[recruiterIndex] = {
      ...recruiters[recruiterIndex],
      isActive: isActive,
    };

    // Write back to file
    writeFileSync(dataFilePath, JSON.stringify(recruiters, null, 2));

    return NextResponse.json({
      success: true,
      message: `Recruiter ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      recruiter: recruiters[recruiterIndex],
    });
  } catch (error) {
    console.error("Error updating recruiter status:", error);
    return NextResponse.json(
      { error: "Failed to update recruiter status" },
      { status: 500 }
    );
  }
}
