import { db } from "@/server/db";
import { jobsTable } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateJobSchema = z.object({
  title: z.string().min(1),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  // Check to make sure person is authorized to edit this project
  // const { userId } = getAuth(request);
  const userId = "1";
  // if (!userId) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const body = await request.json();
  const validatedData = updateJobSchema.safeParse(body);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: validatedData.error.errors },
      { status: 400 }
    );
  }

  const { title } = validatedData.data;

  // Make a DB request to update the project title
  const updatedProject = await db
    .update(jobsTable)
    .set({ upwk_title: title })
    .where(and(eq(jobsTable.user_id, userId), eq(jobsTable.id, params.jobId)))
    .returning();

  if (updatedProject.length === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(updatedProject[0]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const userId = "1";
  // const { userId } = getAuth(request);
  // if (!userId) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const deletedProject = await db
    .delete(jobsTable)
    .where(and(eq(jobsTable.user_id, userId), eq(jobsTable.id, params.jobId)))
    .returning();

  if (deletedProject.length === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(deletedProject[0]);
}
