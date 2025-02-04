"server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import {
	Job,
	jobsTable,
	Match,
	matchesTable,
	UserProfile,
	userProfilesTable,
} from "./db/schema";
import { eq, gte } from "drizzle-orm";

export async function getJobsForUser(): Promise<Job[]> {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("User not found");
	}

	const jobs = await db.query.jobsTable.findMany({
		where: eq(jobsTable.user_id, userId),
		orderBy: (jobs, { desc }) => [desc(jobs.updated_at)],
		with: {
			matches: {
				where: gte(matchesTable.match_strength, 0),
			},
		},
		limit: 50,
	});

	// Filter out jobs that have no qualifying matches
	return jobs.filter((job) => job.matches.length > 0);
}

export function getMatchesForJob(job_id: string): Promise<Match[]> {
	const matches = db.query.matchesTable.findMany({
		where: eq(matchesTable.job_id, job_id),
		orderBy: (matches, { desc }) => [desc(matches.updated_at)],
	});

	return matches;
}

export async function getUserProfile(user_id: string): Promise<UserProfile> {
	const profile = await db.query.userProfilesTable.findFirst({
		where: eq(userProfilesTable.user_id, user_id),
	});
	if (!profile) {
		throw new Error("User profile not found");
	}
	return profile;
}

export async function updateUserProfile(
	profile: UserProfile
): Promise<UserProfile> {
	const updatedProfile = await db
		.update(userProfilesTable)
		.set(profile)
		.where(eq(userProfilesTable.user_id, profile.user_id))
		.returning();
	return {
		user_id: updatedProfile[0].user_id,
		user_name: updatedProfile[0].user_name,
		user_summary: updatedProfile[0].user_summary,
		user_skills: updatedProfile[0].user_skills,
		user_project_history: updatedProfile[0].user_project_history,
		user_job_vetos: updatedProfile[0].user_job_vetos,
	};
}
