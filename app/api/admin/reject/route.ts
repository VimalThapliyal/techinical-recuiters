import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { RecruiterSubmission } from "@/types/submission";

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission ID required" },
        { status: 400 }
      );
    }

    const pendingFilePath = join(
      process.cwd(),
      "data",
      "pending-submissions.json"
    );

    if (!existsSync(pendingFilePath)) {
      return NextResponse.json(
        { error: "No pending submissions found" },
        { status: 404 }
      );
    }

    const fileContent = readFileSync(pendingFilePath, "utf8");
    const submissions: RecruiterSubmission[] = JSON.parse(fileContent);

    // Update submission status to rejected
    const submissionIndex = submissions.findIndex(
      (s) => s.submittedAt === submissionId
    );

    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const rejectedSubmission = submissions[submissionIndex];
    rejectedSubmission.status = "rejected";

    // Write updated file
    writeFileSync(pendingFilePath, JSON.stringify(submissions, null, 2));

    // Send email notification if email is provided
    if (rejectedSubmission.submittedBy) {
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
              to: rejectedSubmission.submittedBy,
              subject: "Recruiter Profile Submission Update",
              message: `
              <h2>Submission Review Update</h2>
              <p>Thank you for submitting your recruiter profile for <strong>${rejectedSubmission.name}</strong>.</p>
              <p>Unfortunately, we are unable to approve your submission at this time. This could be due to:</p>
              <ul>
                <li>Incomplete or inaccurate information</li>
                <li>Invalid LinkedIn profile URL</li>
                <li>Profile does not meet our directory requirements</li>
              </ul>
              <p>If you believe this is an error, please feel free to resubmit with updated information.</p>
              <p>Thank you for your interest in our directory.</p>
            `,
              recruiterName: rejectedSubmission.name,
              status: "rejected",
            }),
          }
        ).catch((err) => console.error("Email send error:", err));
      } catch (error) {
        console.error("Error sending rejection email:", error);
        // Don't fail the rejection if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Submission rejected",
    });
  } catch (error) {
    console.error("Error rejecting submission:", error);
    return NextResponse.json(
      { error: "Failed to reject submission" },
      { status: 500 }
    );
  }
}
