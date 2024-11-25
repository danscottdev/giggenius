"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import JobFeed from "./JobFeed";
import { RotateCcw } from "lucide-react";
import { Job } from "@/server/db/schema";
import axios from "axios";
import JobFilterToggle from "./JobFilterToggle";

function JobFeedContainer() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  const handleFilterChange = (filter: string) => {
    switch (filter) {
      case "new":
        setFilteredJobs(jobs.filter((job) => !job.is_seen_by_user));
        break;
      case "strong":
        // TODO: Add logic to check for match strength here
        setFilteredJobs(jobs.filter((job) => false));
        break;
      case "all":
      default:
        setFilteredJobs(jobs);
        break;
    }
  };

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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <JobFilterToggle onFilterChange={handleFilterChange} />
        <div className="w-1/3 justify-end">
          <form action={handleSyncJobs}>
            {/* TODO: Update to actually trigger fetch API */}
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <RotateCcw className="w-4 h-4 mr-1" strokeWidth={3} />
              Fetch New Listings
            </Button>
          </form>
          <span className="text-xs text-gray-500 italic">
            {/* TODO: Update to pull last actual fetch timestamp */}
            Last Fetched from Upwork: 2024-11-22
          </span>
        </div>
      </div>
      <JobFeed jobs={filteredJobs} />
    </div>
  );
}

export default JobFeedContainer;
