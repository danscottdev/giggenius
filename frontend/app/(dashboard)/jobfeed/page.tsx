import React, { useEffect, useState } from "react";
import JobFeedContainer from "@/components/JobFeedContainer";
import PageHeader from "@/components/PageHeader";
import { Separator } from "@radix-ui/react-separator";

export default async function JobFeedPage() {
  return (
    <div>
      <PageHeader title="My Job Feed" />
      <Separator />
      <JobFeedContainer />
    </div>
  );
}
