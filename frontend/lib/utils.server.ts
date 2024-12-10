"server-only";

import { auth } from "@clerk/nextjs/server";

export async function getAuthenticatedUserId() {
  console.log("getAuthenticatedUserId");
  const { userId } = await auth();

  if (!userId) {
    console.log("auth error");
    throw new Error("User not found");
  }

  console.log("userId:", userId);
  return userId;
}
