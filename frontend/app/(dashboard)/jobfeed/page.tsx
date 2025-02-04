import JobFeedContainer from "@/components/JobFeedContainer";
import PageHeader from "@/components/PageHeader";
import { getJobsForUser } from "@/server/queries";
import { Separator } from "@/components/ui/separator";

export default async function JobFeedPage() {
	const jobs = await getJobsForUser();

	return (
		<div>
			<PageHeader title="My Job Feed" />
			<Separator className="my-4" />
			<JobFeedContainer jobs={jobs} />
		</div>
	);
}
