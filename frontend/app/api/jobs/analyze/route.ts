"use server";

// import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { jobsTable, matchesTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  //  Figure out who the user is
  //   const { userId } = auth();

  // Verify the user exists
  //   if (!userId) {
  // throw new Error("User not found");
  //   }

  console.log("Post request to analyze job...");

  console.log("Request:", request);

  // extract data from request
  const body = await request.json();
  console.log("Body.output:", body.output);
  const data = JSON.parse(body.output);
  //   const data = await body.output.json();

  //   const { matchData } = await request.json();

  //   console.log("Match data:", body);

  const matchData = data;

  const [newMatchAnalysis] = await db
    .insert(matchesTable)
    .values({
      job_id: body.job_id,
      user_id: "1",
      match_strength: matchData.match_strength,
      match_analysis: matchData.match_analysis,
    })
    .returning();

  console.log("New match analysis:", newMatchAnalysis);

  // Update the job in the database to set match_analysis_status to true
  const [updatedJob] = await db
    .update(jobsTable)
    .set({ match_analysis_status: "complete" })
    .where(eq(jobsTable.id, body.job_id))
    .returning();

  return NextResponse.json(newMatchAnalysis);

  //   redirect(`/project/${newProject.id}`);
}

export async function GET(request: Request) {
  const job_id = request.url.split("?job_id=")[1];
  console.log("Job ID:", job_id);
  const matches = await db.query.matchesTable.findMany({
    where: eq(matchesTable.job_id, job_id),
    orderBy: (matches, { desc }) => [desc(matches.updated_at)],
  });

  console.log("Matches:", matches);

  return NextResponse.json(matches); //matches;
}
