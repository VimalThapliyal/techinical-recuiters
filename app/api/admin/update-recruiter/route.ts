import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { Recruiter } from "@/types/recruiter";
import { CountryCode } from "@/types/recruiter";

export async function POST(request: NextRequest) {
  try {
    const { recruiter } = await request.json();

    if (!recruiter || !recruiter.id) {
      return NextResponse.json(
        { error: "Invalid recruiter data" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !recruiter.name ||
      !recruiter.linkedinUrl ||
      !recruiter.company ||
      !recruiter.country
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const countryCode = recruiter.country.toLowerCase() as CountryCode;
    const dataFilePath = join(process.cwd(), "data", `${countryCode}.json`);

    if (!existsSync(dataFilePath)) {
      return NextResponse.json(
        { error: "Country data file not found" },
        { status: 404 }
      );
    }

    // Read existing recruiters
    const fileContent = readFileSync(dataFilePath, "utf8");
    const recruiters: Recruiter[] = JSON.parse(fileContent);

    // Find the recruiter - search across all countries first to find old country
    let recruiterIndex = -1;
    let oldCountryCode: CountryCode | null = null;
    let oldDataFilePath: string | null = null;
    let oldRecruiters: Recruiter[] = [];

    // Search in current country file first
    recruiterIndex = recruiters.findIndex((r) => r.id === recruiter.id);
    if (recruiterIndex !== -1) {
      oldCountryCode = recruiters[
        recruiterIndex
      ].country.toLowerCase() as CountryCode;
      oldDataFilePath = dataFilePath;
      oldRecruiters = recruiters;
    } else {
      // Search in other country files
      const countries: CountryCode[] = ["us", "uk", "ca", "au", "in"];
      for (const country of countries) {
        if (country === countryCode) continue; // Skip current country
        const searchFilePath = join(process.cwd(), "data", `${country}.json`);
        if (existsSync(searchFilePath)) {
          const searchFileContent = readFileSync(searchFilePath, "utf8");
          const searchRecruiters: Recruiter[] = JSON.parse(searchFileContent);
          recruiterIndex = searchRecruiters.findIndex(
            (r) => r.id === recruiter.id
          );
          if (recruiterIndex !== -1) {
            oldCountryCode = country;
            oldDataFilePath = searchFilePath;
            oldRecruiters = searchRecruiters;
            break;
          }
        }
      }
    }

    if (recruiterIndex === -1 || !oldCountryCode || !oldDataFilePath) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Prepare updated recruiter data
    const updatedRecruiter: Recruiter = {
      id: recruiter.id,
      name: recruiter.name.trim(),
      country: recruiter.country,
      company: recruiter.company.trim(),
      specialization: recruiter.specialization || [],
      experience: recruiter.experience || "5+ years",
      bio: recruiter.bio.trim(),
      linkedinUrl: recruiter.linkedinUrl.trim(),
      imageUrl: recruiter.imageUrl?.trim() || undefined,
    };

    // If country changed, move recruiter to new country file
    if (oldCountryCode !== countryCode) {
      // Remove from old country file
      oldRecruiters.splice(recruiterIndex, 1);
      
      try {
        writeFileSync(oldDataFilePath, JSON.stringify(oldRecruiters, null, 2));
      } catch (writeError) {
        console.error("Error writing to old country file:", writeError);
        throw new Error(`Failed to write to ${oldDataFilePath}: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
      }

      // Add to new country file
      recruiters.push(updatedRecruiter);
      try {
        writeFileSync(dataFilePath, JSON.stringify(recruiters, null, 2));
      } catch (writeError) {
        console.error("Error writing to new country file:", writeError);
        throw new Error(`Failed to write to ${dataFilePath}: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
      }
    } else {
      // Update in place
      oldRecruiters[recruiterIndex] = updatedRecruiter;
      try {
        writeFileSync(oldDataFilePath, JSON.stringify(oldRecruiters, null, 2));
      } catch (writeError) {
        console.error("Error writing to file:", writeError);
        throw new Error(`Failed to write to ${oldDataFilePath}: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Recruiter updated successfully",
      recruiter,
    });
  } catch (error) {
    console.error("Error updating recruiter:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Log detailed error for debugging
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      recruiterId: recruiter?.id,
      countryCode: recruiter?.country,
    });
    
    return NextResponse.json(
      { 
        error: "Failed to update recruiter",
        details: errorMessage,
        // Only include stack in development
        ...(process.env.NODE_ENV === "development" && { stack: errorStack })
      },
      { status: 500 }
    );
  }
}
