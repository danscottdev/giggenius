"use server";

// import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { matchProcessingTasksTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  // Database query to matchProcessingTasks table to return all rows with status "new"

  try {
    console.log(
      "Fetching all match analysis tasks that are not in a terminal state (OLD API)"
    );
    const tasks = await db
      .select()
      .from(matchProcessingTasksTable)
      .where(eq(matchProcessingTasksTable.status, "new"))
      .execute();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks: " + error },
      { status: 500 }
    );
  }
}
