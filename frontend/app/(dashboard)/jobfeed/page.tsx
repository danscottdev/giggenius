"use client";

import JobFeed from "@/components/JobFeed";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import React from "react";

function JobFeedPage() {
  const jobs = [
    {
      id: 1,
      title: "Web Developer",
      summary:
        "Looking for an experienced web developer to help build a custom wordpress...",
      match: "Strong",
      date: "2 days ago",
      seen: "New",
      description: "Full description Here",
      budget: "$1000",
    },
  ];

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12 lg:pt-0 mt-2 space-y-6 sm:space-y-8 lg:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              My Job Feed
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Jobs Fetched from Upwork
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 italic">
              Last Fetch: {new Date().toLocaleString()}
            </span>
            <form action="#" className="w-full mt-1">
              <Button className="rounded-xl text-base w-full">
                <RotateCcw className="w-4 h-4 mr-1" strokeWidth={3} />
                Fetch New Listings
              </Button>
            </form>
          </div>
        </div>
        <JobFeed jobs={jobs} />
        {/* <JobFeed jobs={jobs} /> */}
      </div>
    </div>
  );
}

export default JobFeedPage;
