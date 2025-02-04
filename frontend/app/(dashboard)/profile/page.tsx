import PageHeader from "@/components/PageHeader";
import { Separator } from "@/components/ui/separator";
import { getUserProfile } from "@/server/queries";
import { auth } from "@clerk/nextjs/server";
import UserProfileForm from "@/components/UserProfileForm";

export default async function UserProfilePage() {
	const { userId } = await auth();
	console.log("userId:", userId);

	const user = await getUserProfile(userId as string);
	console.log("user:", user);

	const userProfile = {
		user_id: user?.user_id,
		user_name: user?.user_name,
		user_summary: user?.user_summary,
		user_skills: user?.user_skills,
		user_project_history: user?.user_project_history,
		// jobPreferences: user?.jobPreferences,
		user_job_vetos: user?.user_job_vetos,
	};

	console.log("userProfile1:", userProfile);

	return (
		<div>
			<PageHeader title="My User Profile" />
			<Separator className="my-4" />
			<UserProfileForm userProfile={userProfile} />
		</div>
	);
}
