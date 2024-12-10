import { db } from "@/server/db";
import { jobsTable } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // User Auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Fetching jobs from DB endpoint...");
    const jobs = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.user_id, userId))
      .execute();
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs: " + error },
      { status: 500 }
    );
  }
}
