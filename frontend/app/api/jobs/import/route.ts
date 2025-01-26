import { NextResponse } from "next/server";
import { db } from "@/server/db";
import {
	Job,
	jobsTable,
	matchProcessingTasksTable,
	userProfilesTable,
} from "@/server/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
	try {
		let { userId } = await auth();

		if (!userId) {
			console.log("UserID set via header");
			userId = request.headers.get("user_id");

			if (!userId) {
				console.log("UserID is null");
				throw new Error("User ID is required");
			}

			const user = await db
				.select({ user_id: userProfilesTable.user_id })
				.from(userProfilesTable)
				.where(eq(userProfilesTable.user_id, userId));

			if (user.length === 0) {
				console.log("UserID not found in database");
				throw new Error("User not found");
			}
		}

		const jobsData = await request.json();
		console.log("Jobs data:", jobsData);

		const existingJobs = await db
			.select({ upwk_url: jobsTable.upwk_url })
			.from(jobsTable)
			.where(
				and(
					inArray(
						jobsTable.upwk_url,
						jobsData.map((job: Job) => job.upwk_url)
					),
					eq(jobsTable.user_id, userId)
				)
			);

		const newJobs = jobsData.filter((job: Job) => {
			const hasValidDescription = job.upwk_description?.trim().length > 0;
			const isNewJob = !existingJobs.some(
				(existingJob) => existingJob.upwk_url === job.upwk_url
			);

			if (!hasValidDescription) {
				console.log(`Skipping job with empty description: ${job.upwk_url}`);
			}

			return isNewJob && hasValidDescription;
		});

		let insertedJobs = [];

		if (newJobs.length > 0) {
			insertedJobs = await db
				.insert(jobsTable)
				.values(
					newJobs.map((job: Job) => ({
						user_id: userId,
						upwk_title: job.upwk_title,
						upwk_url: job.upwk_url,
						upwk_description: job.upwk_description,
						upwk_timestamp: job.upwk_timestamp || new Date(),
						upwk_budget: job.upwk_budget,
						is_seen_by_user: false,
						upwk_client_location: job.upwk_client_location,
						upwk_client_rating: job.upwk_client_rating,
						upwk_client_spend: job.upwk_client_spend,
						upwk_proposal_count: job.upwk_proposal_count,
						upwk_client_payment_verified: job.upwk_client_payment_verified,
					}))
				)
				.returning();

			await db.insert(matchProcessingTasksTable).values(
				insertedJobs.map((job: Job) => ({
					job_id: job.id,
					user_id: userId,
					status: "new",
					error_message: null,
					attempts: 0,
					last_heart_beat: new Date(),
					created_at: new Date(),
					updated_at: new Date(),
				}))
			);
		}

		console.log("New jobs:", newJobs);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Import failed:", error);
		return NextResponse.json({ error: "Import failed" }, { status: 500 });
	}
}
