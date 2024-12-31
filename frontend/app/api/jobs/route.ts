import { db } from "@/server/db";
import { jobsTable } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
// import { getAuthenticatedUserId } from "@/lib/utils.server";
import { Job } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";

/**
 * Retrieves all jobs for the authenticated user.
 *
 * @route GET /api/jobs
 * @throws {Error} When authentication fails or database query errors occur
 * @returns {Promise<NextResponse>} JSON response containing array of jobs or error message
 *
 * @description
 * This endpoint fetches all jobs associated with the authenticated user from the database.
 * If an error occurs during fetching, it returns a 500 status code with an error message.
 *
 * @see {@link Job} for job schema defined in server/db/schema.ts
 *
 * @security
 * - Requires authentication
 * - Users can only access their own jobs
 */
export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("auth error");
      throw new Error("User not found");
    }

    // console.log("Fetching jobs from DB endpoint...");
    const jobs: Job[] = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.user_id, userId))
      .execute();
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs: " + error },
      { status: 500 }
    );
  }
}
