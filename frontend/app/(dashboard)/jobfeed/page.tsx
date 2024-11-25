import React, { useEffect, useState } from "react";
import JobFeedContainer from "@/components/JobFeedContainer";

export default async function JobFeedPage() {
  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12 lg:pt-0 mt-2 space-y-6 sm:space-y-8 lg:space-y-6">
        <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            My Job Feed
          </h1>
        </div>
        <JobFeedContainer />
      </div>
    </div>
  );
}
