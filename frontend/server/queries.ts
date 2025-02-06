"server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import {
	Job,
	jobsTable,
	JobWithMatches,
	Match,
	matchesTable,
	UserProfile,
	userProfilesTable,
} from "./db/schema";
import { eq, not, and, desc } from "drizzle-orm";

export async function getJobsForUser(): Promise<Job[]> {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("User not found");
	}

	const results = await db
		.select()
		.from(jobsTable)
		.leftJoin(matchesTable, eq(jobsTable.id, matchesTable.job_id))
		.where(
			and(
				eq(jobsTable.user_id, userId),
				not(eq(matchesTable.match_strength, -1))
			)
		)
		.orderBy(desc(jobsTable.updated_at))
		.limit(50)
		.execute();

	const jobs: JobWithMatches[] = results.map((result) => ({
		...result.jobs,
		matches: Array.isArray(result.matches)
			? result.matches
			: result.matches
			? [result.matches]
			: [],
	}));

	return jobs;
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
		user_focus: updatedProfile[0].user_focus,
	};
}
