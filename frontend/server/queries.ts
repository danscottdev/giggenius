"server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import {
  Job,
  jobsTable,
  Match,
  matchesTable,
  userProfilesTable,
} from "./db/schema";
import { eq } from "drizzle-orm";

export async function getJobsForUser(): Promise<Job[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  const jobs = db.query.jobsTable.findMany({
    where: eq(jobsTable.user_id, userId),
    orderBy: (jobs, { desc }) => [desc(jobs.updated_at)],
  });

  return jobs;
}

export function getMatchesForJob(job_id: string): Promise<Match[]> {
  const matches = db.query.matchesTable.findMany({
    where: eq(matchesTable.job_id, job_id),
    orderBy: (matches, { desc }) => [desc(matches.updated_at)],
  });

  return matches;
}

export async function getUserProfile(user_id: string): Promise<any> {
  const profile = await db.query.userProfilesTable.findFirst({
    where: eq(userProfilesTable.user_id, user_id),
  });
  return profile;
}
