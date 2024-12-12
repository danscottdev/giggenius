import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { matchesTable } from "@/server/db/schema";

// Insert match into the database
export async function POST(request: Request) {
  console.log("Creating new match...");
  try {
    const data = await request.json();

    console.log("Data:", data);

    const insertMatch = await db
      .insert(matchesTable)
      .values({
        job_id: data.job_id,
        // user_id: data.user_id,
        match_strength: data.match_analysis_status.match_strength,
        match_analysis: data.match_analysis_status.match_analysis,
        // user_grade: data.user_grade,
        // user_feedback: data.user_feedback,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    console.log("New match:", insertMatch);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create new match failed:", error);
    return NextResponse.json({ error: "Create Match Failed" }, { status: 500 });
  }
}
