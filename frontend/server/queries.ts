"server-only";

// import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { Job, jobsTable } from "./db/schema";
import { eq } from "drizzle-orm";

export function getJobsForUser(): Promise<Job[]> {
  console.log("Database URL exists:", !!process.env.POSTGRES_URL);
  // Figure out who the user is
  //   const { userId } = auth();
  const userId = "1";

  // Verify the user exists
  if (!userId) {
    throw new Error("User not found");
  }

  // Fetch projects from database
  const jobs = db.query.jobsTable.findMany({
    where: eq(jobsTable.userId, userId),
    orderBy: (jobs, { desc }) => [desc(jobs.updatedAt)],
  });

  return jobs;
}
