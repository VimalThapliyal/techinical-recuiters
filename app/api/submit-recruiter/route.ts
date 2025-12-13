import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { SubmissionFormData } from "@/types/submission";
import { RecruiterSubmission } from "@/types/submission";

export async function POST(request: NextRequest) {
  try {
    const body: SubmissionFormData & { submittedAt: string } =
      await request.json();

    // Validate required fields
    if (!body.name || !body.linkedinUrl || !body.company || !body.country) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate LinkedIn URL
    if (
      !body.linkedinUrl.includes("linkedin.com/in/") &&
      !body.linkedinUrl.includes("linkedin.com/in/")
    ) {
      return NextResponse.json(
        { error: "Invalid LinkedIn URL" },
        { status: 400 }
      );
    }

    // Read existing pending submissions
    const pendingFilePath = join(
      process.cwd(),
      "data",
      "pending-submissions.json"
    );
    let pendingSubmissions: RecruiterSubmission[] = [];

    if (existsSync(pendingFilePath)) {
      try {
        const fileContent = readFileSync(pendingFilePath, "utf8");
        pendingSubmissions = JSON.parse(fileContent);
      } catch (error) {
        console.error("Error reading pending submissions:", error);
      }
    }

    // Create submission object
    const submission: RecruiterSubmission = {
      name: body.name.trim(),
      linkedinUrl: body.linkedinUrl.trim(),
      company: body.company.trim(),
      country: body.country,
      ...(body.location?.trim() && { location: body.location.trim() }),
      specialization: body.specialization || [],
      experience: body.experience || "5+ years",
      bio: body.bio.trim(),
      ...(body.imageUrl?.trim() && { imageUrl: body.imageUrl.trim() }),
      submittedAt: body.submittedAt || new Date().toISOString(),
      status: "pending",
      ...(body.email && { submittedBy: body.email }),
    };

    // Check for duplicate pending submissions (by LinkedIn URL)
    const normalizedUrl = submission.linkedinUrl
      .toLowerCase()
      .replace(/\/$/, "")
      .split("?")[0];

    const isDuplicate = pendingSubmissions.some((sub) => {
      const existingUrl = sub.linkedinUrl
        .toLowerCase()
        .replace(/\/$/, "")
        .split("?")[0];
      return existingUrl === normalizedUrl && sub.status === "pending";
    });

    if (isDuplicate) {
      return NextResponse.json(
        { error: "A pending submission with this LinkedIn URL already exists" },
        { status: 409 }
      );
    }

    // Add to pending submissions
    pendingSubmissions.push(submission);

    // Write back to file
    writeFileSync(pendingFilePath, JSON.stringify(pendingSubmissions, null, 2));

    return NextResponse.json(
      {
        success: true,
        message:
          "Submission received. It will be reviewed within 2-3 business days.",
        submissionId: submission.submittedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting recruiter:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
