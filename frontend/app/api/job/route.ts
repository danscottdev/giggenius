import { db } from "@/server/db";
import { jobsTable } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Job } from "@/server/db/schema";

/**
 * Retrieves job data for the given jobID
 * jobID provided as a query parameter
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    console.log("Fetching job from DB endpoint...");
    // extract jobID from query parameter:
    const url = new URL(request.url);
    const jobId = url.searchParams.get("jobId");
    console.log("Job ID:", jobId);

    if (!jobId) {
      console.log("No job ID provided");
      return NextResponse.json(
        { error: "No job ID provided" },
        { status: 400 }
      );
    }

    console.log("Fetching job from DB endpoint...");
    const jobs: Job[] = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, jobId))
      .execute();
    return NextResponse.json(jobs[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch job: " + error },
      { status: 500 }
    );
  }
}
