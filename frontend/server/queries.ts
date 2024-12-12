"server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { Job, jobsTable, Match, matchesTable } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getJobsForUser(): Promise<Job[]> {
  const { userId } = await auth();
  if (!userId) {
    console.log("User: ", userId);
    throw new Error("User not found");
  }

  const jobs = db.query.jobsTable.findMany({
    where: eq(jobsTable.user_id, userId),
    orderBy: (jobs, { desc }) => [desc(jobs.updated_at)],
  });

  return jobs;
}

export function getMatchesForJob(job_id: string): Promise<Match[]> {
  console.log("Database URL exists:", !!process.env.POSTGRES_URL);
  const matches = db.query.matchesTable.findMany({
    where: eq(matchesTable.job_id, job_id),
    orderBy: (matches, { desc }) => [desc(matches.updated_at)],
  });

  console.log("Matches:", matches);

  return matches;
}
