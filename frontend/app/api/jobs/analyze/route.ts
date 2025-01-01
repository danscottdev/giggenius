"use server";

import { db } from "@/server/db";
import { jobsTable, matchesTable } from "@/server/db/schema";
// import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
// import { getAuthenticatedUserId } from "@/lib/utils.server";

/**
 * Creates a new job match analysis and updates the job's analysis status.
 *
 * @route POST /api/analyze-job
 * @param request - Next.js Request object containing the job analysis data
 * @throws {Error} When authentication fails, JSON parsing fails, or database operations fail
 * @returns {Promise<NextResponse>} JSON response containing the newly created match analysis
 *
 * @description
 * This endpoint processes job analysis results from the crewAI backend:
 * 1. Creates a new match entry in the database with the analysis results
 * 2. Updates the original job's analysis status to 'complete'
 *
 * @example
 * // Expected Request Body:
 * {
 *   job_id: string,
 *   output: string // JSON string containing match data
 * }
 *
 * // Parsed output structure:
 * {
 *   match_strength: number,
 *   match_analysis: string
 * }
 *
 * // Example Response:
 * {
 *   id: string,
 *   job_id: string,
 *   user_id: string,
 *   match_strength: number,
 *   match_analysis: string,
 *   created_at: Date,
 *   updated_at: Date
 * }
 *
 * @security
 * - Requires authentication
 * - Users can only create analyses for their own jobs
 *
 * @sideEffects
 * - Creates a new record in the matches table
 * - Updates match_analysis_status to 'complete' in the jobs table
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const matchData = JSON.parse(body.output);

  const [newMatchAnalysis] = await db
    .insert(matchesTable)
    .values({
      job_id: body.job_id,
      user_id: body.user_id,
      match_strength: matchData.match_strength,
      match_analysis: matchData.match_analysis,
    })
    .returning();

  // Update the job in the database to set match_analysis_status to true
  await db
    .update(jobsTable)
    .set({ match_analysis_status: "complete" })
    .where(eq(jobsTable.id, body.job_id))
    .returning();

  return NextResponse.json(newMatchAnalysis);
}

/**
 * Fetches matches for a specific job ID from the database.
 *
 * @route GET /api/matches?job_id={id}
 * @param request - Next.js Request object containing the job_id as a URL parameter
 * @throws {Error} When authentication fails or database query errors occur
 * @returns {Promise<NextResponse>} JSON response containing an array of match objects
 *
 * @description
 * This endpoint retrieves all matches associated with a specific job ID for the authenticated user.
 * Matches are ordered by their update timestamp in descending order (newest first).
 * While currently only one match is displayed in the job feed, the endpoint is designed to return
 * all matches to support future features like fine-tuning and user feedback on match analysis.
 *
 * @example
 * // Example Response:
 * [
 *   {
 *     id: string,
 *     job_id: string,
 *     user_id: string,
 *     // ... other match properties
 *     updated_at: Date
 *   }
 * ]
 *
 * @security
 * - Requires authentication
 * - User can only access matches for their own jobs
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const job_id = request.url.split("?job_id=")[1];

    const matches = await db.query.matchesTable.findMany({
      where: eq(matchesTable.job_id, job_id),
      orderBy: (matches, { desc }) => [desc(matches.updated_at)],
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
