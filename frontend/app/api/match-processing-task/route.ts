import { db } from "@/server/db";
import { matchProcessingTasksTable } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateTaskSchema = z.object({
  id: z.string(),
  job_id: z.string(),
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
  last_heart_beat: z.date().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  console.log("Updating task... PATCH");
  // Check to make sure person is authorized to edit this project
  // const { userId } = getAuth(request);
  //   const userId = "1";
  // if (!userId) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const body = await request.json();
  const validatedData = updateTaskSchema.safeParse(body);
  if (!validatedData.success) {
    console.log("Patch Request data validation FAILED!");
    return NextResponse.json(
      { error: validatedData.error.errors },
      { status: 400 }
    );
  }

  console.log("Validated data:", validatedData.data);

  // Make a DB request to update the project title
  const updatedTask = await db
    .update(matchProcessingTasksTable)
    .set({
      status: validatedData.data.status,
      error_message: validatedData.data.error_message,
      attempts: validatedData.data.attempts,
      last_heart_beat: validatedData.data.last_heart_beat,
      updated_at: new Date(),
    })
    .where(
      and(
        // eq(matchProcessingTasksTable.user_id, userId),
        eq(matchProcessingTasksTable.id, params.taskId)
      )
    )
    .returning();

  if (updatedTask.length === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  console.log("Task patch update successful!");

  return NextResponse.json(updatedTask[0]);
}
