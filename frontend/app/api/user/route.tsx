import { db } from "@/server/db";
import { userProfilesTable } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { UserProfile } from "@/server/db/schema";
import { updateUserProfile } from "@/server/queries";

/**
 * Retrieves user profile data for the given userID
 * userID provided as a query parameter
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      console.log("No user ID provided");
      return NextResponse.json(
        { error: "No user ID provided" },
        { status: 400 }
      );
    }

    const users: UserProfile[] = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.user_id, userId))
      .execute();
    return NextResponse.json(users[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user: " + error },
      { status: 500 }
    );
  }
}
export async function POST(request: Request): Promise<NextResponse> {
  console.log("POST USER request received");
  const profile = await request.json();
  console.log("profile:", profile);
  await updateUserProfile(profile as UserProfile);
  return NextResponse.json({ message: "Profile updated" });
}
