// app/api/jobs/import/route.ts
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { Job, jobsTable, matchProcessingTasksTable } from "@/server/db/schema";

export async function POST() {
  try {
    // For now, just manually import json.
    const filePath = path.join(
      process.cwd(),
      "../scraper-service/upwork-2024-11-22.json"
    );
    console.log(filePath);
    const jsonData = await fs.readFile(filePath, "utf8");
    const jobsData = JSON.parse(jsonData);

    // TODO: Need to check if job already exists in database, probably based on URL?

    // Insert data into database
    const insertedJobs = await db
      .insert(jobsTable)
      .values(
        jobsData.map((job: Job) => ({
          user_id: "1",
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Import failed:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
