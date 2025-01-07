import { db } from "@/server/db";
import { jobsTable, JobWithMatches, matchesTable } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, desc, and, gte } from "drizzle-orm";
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
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("GET request received");
    const { userId } = await auth();
    console.log("userId", userId);

    if (!userId) {
      console.log("auth error");
      throw new Error("User not found");
    }

    // check if URL param is ?strongOnly=true
    const strongOnly = req.nextUrl.searchParams.get("strongOnly") === "true";
    console.log("strongOnly", strongOnly);

    if (strongOnly) {
      console.log("strongOnly");
      const results = await db
        .select()
        .from(jobsTable)
        .leftJoin(matchesTable, eq(jobsTable.id, matchesTable.job_id))
        .where(
          and(
            eq(jobsTable.user_id, userId),
            gte(matchesTable.match_strength, 4)
          )
        )
        .orderBy(desc(matchesTable.match_strength), desc(jobsTable.updated_at))
        .limit(50)
        .execute();

      // console.log("RESULTS");
      // console.log(results);

      const jobs: JobWithMatches[] = results.map((result) => ({
        ...result.jobs,
        matches: Array.isArray(result.matches)
          ? result.matches
          : result.matches
          ? [result.matches]
          : [],
      }));

      // console.log("STRONG JOBS");
      // console.log(jobs);
      return NextResponse.json(jobs);
    } else {
      console.log("not strongOnly");
      const jobs: Job[] = await db.query.jobsTable.findMany({
        where: eq(jobsTable.user_id, userId),
        orderBy: (jobs, { desc }) => [desc(jobs.updated_at)],
        with: {
          matches: true,
        },
        limit: 50,
      });
      return NextResponse.json(jobs);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs: " + error },
      { status: 500 }
    );
  }
}
