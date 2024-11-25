import { db } from "@/server/db";
import { jobsTable } from "@/server/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Fetching jobs from DB endpoint...");
    const jobs = await db.select().from(jobsTable);
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
