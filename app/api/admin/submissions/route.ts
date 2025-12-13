import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { RecruiterSubmission } from "@/types/submission";

export async function GET(request: NextRequest) {
  try {
    const pendingFilePath = join(
      process.cwd(),
      "data",
      "pending-submissions.json"
    );

    if (!existsSync(pendingFilePath)) {
      return NextResponse.json({ submissions: [] });
    }

    const fileContent = readFileSync(pendingFilePath, "utf8");
    const submissions: RecruiterSubmission[] = JSON.parse(fileContent);

    // Return all submissions (admin can filter on frontend)
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
