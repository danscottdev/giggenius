// app/api/import-jobs/route.ts
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { jobsTable } from "@/server/db/schema";

export async function POST() {
  try {
    // Adjust path to point to your JSON file location
    const filePath = path.join(
      process.cwd(),
      "../scraper-service/upwork-2024-11-22.json"
    );
    console.log(filePath);
    const jsonData = await fs.readFile(filePath, "utf8");
    const jobsData = JSON.parse(jsonData);

    // TODO: Need to check if job already exists in database, probably based on URL?

    // Insert data into database
    await db.insert(jobsTable).values(
      jobsData.map((job: any) => ({
        userId: "1",
        upwk_title: job.upwk_title,
        upwk_url: job.upwk_url,
        upwk_description: job.upwk_description,
        upwk_timestamp: job.upwk_timestamp || new Date(),
        upwk_budget: job.upwk_budget,
        is_seen_by_user: false,
      }))
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Import failed:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
