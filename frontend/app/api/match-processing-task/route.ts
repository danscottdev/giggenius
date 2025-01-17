import { db } from "@/server/db";
import { matchProcessingTasksTable } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateTaskSchema = z.object({
  status: z
    .enum([
      "new",
      "in_progress",
      "failed",
      "completed",
      "max_attempts_exceeded",
    ])
    .optional(),
  error_message: z.string().optional(),
  attempts: z.number().optional(),
  last_heart_beat: z.string(), // Gets passed in as a string, will be converted to a Date object
});

export async function GET() {
  // Database query to matchProcessingTasks table to return all rows with status "new"

  try {
    console.log(
      "Fetching all match analysis tasks that are not in a terminal state"
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

export async function PATCH(request: NextRequest) {
  console.log("PATCH Request received!");

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");

  console.log("Task ID:", taskId);

  if (!taskId) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const body = await request.json();

  console.log("Body:", body);
  const validatedData = updateTaskSchema.safeParse(body);
  if (!validatedData.success) {
    console.log("Patch Request data validation FAILED!");
    return NextResponse.json(
      { error: validatedData.error.errors },
      { status: 400 }
    );
  }

  console.log("Validated data:", validatedData.data);
  const heartbeat_date = new Date(validatedData.data.last_heart_beat);

  // Make a DB request to update the project title
  const updatedTask = await db
    .update(matchProcessingTasksTable)
    .set({
      status: validatedData.data.status,
      error_message: validatedData.data.error_message,
      attempts: validatedData.data.attempts,
      last_heart_beat: heartbeat_date,
      updated_at: new Date(),
    })
    .where(
      and(
        // eq(matchProcessingTasksTable.user_id, userId),
        eq(matchProcessingTasksTable.id, taskId)
      )
    )
    .returning();

  if (updatedTask.length === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  console.log("Task patch update successful!");

  return NextResponse.json(updatedTask[0]);
}
