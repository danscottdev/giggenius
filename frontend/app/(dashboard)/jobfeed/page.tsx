import JobFeed from "@/components/JobFeed";
import { Button } from "@/components/ui/button";
import { getJobsForUser } from "@/server/queries";
import { RotateCcw } from "lucide-react";
import React from "react";

export default async function JobFeedPage() {
  const jobs = await getJobsForUser();

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12 lg:pt-0 mt-2 space-y-6 sm:space-y-8 lg:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              My Job Feed
            </h1>
            <span className="text-xs text-gray-500 italic">
              {/* TODO: Update to pull last actual fetch timestamp */}
              Last Fetched from Upwork: {new Date().toLocaleString()}
            </span>
          </div>
          <div>
            <form action="#" className="w-full mt-1">
              {/* TODO: Update to actually trigger fetch API */}
              <Button className="rounded-xl text-base w-full">
                <RotateCcw className="w-4 h-4 mr-1" strokeWidth={3} />
                Fetch New Listings
              </Button>
            </form>
          </div>
        </div>
        <JobFeed jobs={jobs} />
      </div>
    </div>
  );
}
