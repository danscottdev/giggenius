import JobFeedContainer from "@/components/JobFeedContainer";
import PageHeader from "@/components/PageHeader";
import { getJobsForUser } from "@/server/queries";
import { Separator } from "@radix-ui/react-separator";

export default async function JobFeedPage() {
  const jobs = await getJobsForUser();

  return (
    <div>
      <PageHeader title="My Job Feed" />
      <Separator />
      <JobFeedContainer jobs={jobs} />
    </div>
  );
}
