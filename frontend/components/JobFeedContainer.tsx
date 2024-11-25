"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import JobFeed from "./JobFeed";
import { RotateCcw } from "lucide-react";
import { Job } from "@/server/db/schema";
import axios from "axios";

function JobFeedContainer() {
  const [jobs, setJobs] = useState<Job[]>([]);

  // Fetch jobs from database on component mount
  useEffect(() => {
    const fetchJobsFromDB = async () => {
      try {
        console.log("Fetching jobs from DB (component)...");
        const response = await axios.get<Job[]>("/api/jobs"); // New endpoint for DB fetch
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobsFromDB();
  }, []);

  const handleSyncJobs = async () => {
    try {
      await axios.post("/api/import-jobs");
      // Refresh jobs list after sync
      const response = await axios.get<Job[]>("/api/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to sync jobs:", error);
    }
  };

  return (
    <div>
      <form action={handleSyncJobs} className="w-full mt-1">
        {/* TODO: Update to actually trigger fetch API */}
        <Button className="rounded-xl text-base w-full">
          <RotateCcw className="w-4 h-4 mr-1" strokeWidth={3} />
          Fetch New Listings
        </Button>
      </form>
      <span className="text-xs text-gray-500 italic">
        {/* TODO: Update to pull last actual fetch timestamp */}
        Last Fetched from Upwork: 2024-11-22
      </span>

      <JobFeed jobs={jobs} />
    </div>
  );
}

export default JobFeedContainer;
