import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { Job, jobsTable, matchProcessingTasksTable } from "@/server/db/schema";
import { eq, inArray, and } from "drizzle-orm";
// import { getAuthenticatedUserId } from "@/lib/utils.server";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("auth error");
      throw new Error("User not found");
    }

    // For now, just manually import json.
    const filePath = path.join(
      process.cwd(),
      "../scraper-service/upwork-2024-11-22.json"
    );

    const jsonData = await fs.readFile(filePath, "utf8");
    const jobsData = JSON.parse(jsonData);

    const existingJobs = await db
      .select({ upwk_url: jobsTable.upwk_url })
      .from(jobsTable)
      .where(
        and(
          inArray(
            jobsTable.upwk_url,
            jobsData.map((job: Job) => job.upwk_url)
          ),
          eq(jobsTable.user_id, userId)
        )
      );

    console.log("Existing jobs:", existingJobs);

    const newJobs = jobsData.filter((job: Job) => {
      return !existingJobs.some(
        (existingJob) => existingJob.upwk_url === job.upwk_url
      );
    });

    let insertedJobs = [];

    if (newJobs.length > 0) {
      insertedJobs = await db
        .insert(jobsTable)
        .values(
          newJobs.map((job: Job) => ({
            user_id: userId,
            upwk_title: job.upwk_title,
            upwk_url: job.upwk_url,
            upwk_description: job.upwk_description,
            upwk_timestamp: job.upwk_timestamp || new Date(),
            upwk_budget: job.upwk_budget,
            is_seen_by_user: false,
          }))
        )
        .returning();

      await db.insert(matchProcessingTasksTable).values(
        insertedJobs.map((job: Job) => ({
          job_id: job.id,
          user_id: "1",
          status: "new",
          error_message: null,
          attempts: 0,
          last_heart_beat: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        }))
      );
    }

    console.log("New jobs:", newJobs);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Import failed:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
