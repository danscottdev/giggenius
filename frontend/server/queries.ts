"server-only";

// import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { Job, jobsTable, Match, matchesTable } from "./db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

process.env.POSTGRES_URL =
  "postgres://default:3ArWgKp4EIyo@ep-withered-sea-a464k5eu-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require";

export function getJobsForUser(): Promise<Job[]> {
  console.log("Database URL exists:", !!process.env.POSTGRES_URL);
  // Figure out who the user is
  //   const { userId } = auth();
  const user_id = "1";

  // Verify the user exists
  if (!user_id) {
    throw new Error("User not found");
  }

  // Fetch projects from database
  const jobs = db.query.jobsTable.findMany({
    where: eq(jobsTable.user_id, user_id),
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
