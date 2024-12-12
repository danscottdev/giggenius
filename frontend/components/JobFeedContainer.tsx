"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import JobFeed from "./JobFeed";
import { RotateCcw } from "lucide-react";
import { Job } from "@/server/db/schema";
import axios from "axios";
import JobFilterToggle from "./JobFilterToggle";
import toast from "react-hot-toast";

function JobFeedContainer({ jobs }: { jobs: Job[] }) {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const intialJobs = useRef(jobs);

  const handleFilterChange = (filter: string) => {
    switch (filter) {
      case "new":
        // setFilteredJobs(jobs.filter((job) => !job.is_seen_by_user));
        setFilteredJobs(jobs);
        break;
      case "strong":
        // TODO: Add logic to check for match strength here
        // setFilteredJobs(jobs.filter((job) => false));
        setFilteredJobs(jobs);
        break;
      case "all":
      default:
        setFilteredJobs(jobs);
        break;
    }
  };

  useEffect(() => {
    setFilteredJobs(intialJobs.current);
  }, []);

  const handleImportNewJobs = async () => {
    try {
      await axios.post("/api/jobs/import");
      toast.success("Jobs imported successfully");
    } catch (error) {
      console.error("Failed to import jobs:", error);
      toast.error("Failed to import jobs");
    } finally {
      // Reload component
      console.log("Jobs synced.");
      window.location.reload();
    }
  };

  const handleCrewTrigger = async () => {
    console.log("Triggering crew...");
    try {
      // Grab 1 Job from db
      const jobResponse = await axios.get<Job[]>("/api/jobs");
      // const job = jobResponse.data[0];

      // From jobResponse.data, pick the first job that has match_analysis_status === null
      const job = jobResponse.data.find((job) => !job.match_analysis_status);

      if (!job) {
        console.log("No jobs with match_analysis_status === null found.");
        return;
      }

      console.log("Job:", job);

      // POST request to localhost:8000/trigger
      console.log("Triggering crew... 1");
      console.log("Job:", job);
      const crewResponse = await axios.post(
        "http://localhost:8000/trigger",
        job
      );
      console.log("Crew response:", crewResponse.data);

      // add job_id to crewResponse.data
      crewResponse.data.job_id = job.id;

      // convert crewResponse.data to JSON
      const crewData = JSON.stringify(crewResponse.data);
      console.log("Crew data:", crewData);

      const matchResponse = await axios.post("/api/jobs/analyze", crewData);

      console.log("Match response:", matchResponse.data);
      toast.success("Crew run triggered successfully");
    } catch (error) {
      console.error("Failed to trigger crew:", error);
      toast.error("Failed to trigger crew");
    } finally {
      console.log("Crew run complete.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <JobFilterToggle onFilterChange={handleFilterChange} />
        <div className="w-1/3 justify-end">
          <form action={handleImportNewJobs}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <RotateCcw className="w-4 h-4 mr-1" strokeWidth={3} />
              Fetch New Listings
            </Button>
          </form>
          <span className="text-xs text-gray-500 italic">
            {/* TODO: Update to pull last actual fetch timestamp */}
            Last Fetched from Upwork: 2024-11-22
          </span>
          <form action={handleCrewTrigger}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <RotateCcw className="w-4 h-4 mr-1" strokeWidth={3} />
              Run Crew Analysis
            </Button>
          </form>
        </div>
      </div>
      <JobFeed jobs={filteredJobs} />
    </div>
  );
}

export default JobFeedContainer;
