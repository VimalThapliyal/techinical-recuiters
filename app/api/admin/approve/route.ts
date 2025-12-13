import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { RecruiterSubmission } from "@/types/submission";
import { Recruiter } from "@/types/recruiter";
import { generateRecruiterId } from "@/lib/id-generator";

export async function POST(request: NextRequest) {
  try {
    const { submission } = await request.json();

    if (!submission || !submission.submittedAt) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }

    const pendingFilePath = join(
      process.cwd(),
      "data",
      "pending-submissions.json"
    );
    const countryCode = submission.country.toLowerCase() as string;
    const dataFilePath = join(process.cwd(), "data", `${countryCode}.json`);

    // Read pending submissions
    let pendingSubmissions: RecruiterSubmission[] = [];
    if (existsSync(pendingFilePath)) {
      const fileContent = readFileSync(pendingFilePath, "utf8");
      pendingSubmissions = JSON.parse(fileContent);
    }

    // Update submission status
    const submissionIndex = pendingSubmissions.findIndex(
      (s) => s.submittedAt === submission.submittedAt
    );

    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    pendingSubmissions[submissionIndex].status = "approved";

    // Read existing recruiters
    let existingRecruiters: Recruiter[] = [];
    if (existsSync(dataFilePath)) {
      const fileContent = readFileSync(dataFilePath, "utf8");
      existingRecruiters = JSON.parse(fileContent);
    }

    // Generate intelligent ID
    const recruiterId = generateRecruiterId(
      submission.country,
      existingRecruiters
    );

    // Create new recruiter entry
    const newRecruiter: Recruiter = {
      id: recruiterId,
      name: submission.name,
      country: submission.country,
      company: submission.company,
      specialization: submission.specialization,
      experience: submission.experience,
      bio: submission.bio,
      linkedinUrl: submission.linkedinUrl,
      imageUrl: submission.imageUrl,
    };

    // Add to recruiters list
    existingRecruiters.push(newRecruiter);

    // Write updated files
    writeFileSync(pendingFilePath, JSON.stringify(pendingSubmissions, null, 2));
    writeFileSync(dataFilePath, JSON.stringify(existingRecruiters, null, 2));

    // Send email notification if email is provided
    if (submission.submittedBy) {
      try {
        // Email will be sent asynchronously (don't wait for it)
        fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/send-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: submission.submittedBy,
              subject: "Your Recruiter Profile Has Been Approved!",
              message: `
              <h2>Congratulations!</h2>
              <p>Your recruiter profile for <strong>${
                submission.name
              }</strong> has been approved and added to our directory.</p>
              <p>Your profile is now live and visible to job seekers looking for technical recruiters.</p>
              <p><a href="${
                process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
              }/${countryCode}/recruiters/${recruiterId}">View your profile</a></p>
              <p>Thank you for contributing to our directory!</p>
            `,
              recruiterName: submission.name,
              status: "approved",
            }),
          }
        ).catch((err) => console.error("Email send error:", err));
      } catch (error) {
        console.error("Error sending approval email:", error);
        // Don't fail the approval if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Recruiter approved and added to directory",
      recruiter: newRecruiter,
    });
  } catch (error) {
    console.error("Error approving submission:", error);
    return NextResponse.json(
      { error: "Failed to approve submission" },
      { status: 500 }
    );
  }
}
