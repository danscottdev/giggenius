"use client";

import React, { useEffect, useRef, useState } from "react";
// import { Button } from "./ui/button";
import JobFeed from "./JobFeed";
// import { RotateCcw } from "lucide-react";
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

  const handleImportNewJobs = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // console.log("handleImportNewJobs");

    try {
      const formData = new FormData(event.currentTarget);
      const file = formData.get("file") as File;
      // console.log(formData);
      if (!file) return;
      // console.log("HERE");

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          // console.log("JSON:", json);
          await axios.post("/api/jobs/import", json);
          toast.success("Jobs imported successfully");
        } catch (error) {
          console.error("Invalid JSON file:", error);
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Failed to import jobs:", error);
      toast.error("Failed to import jobs");
    } finally {
      // Reload component
      setFilteredJobs(jobs);
      // console.log("Jobs synced.");
      // window.location.reload();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <JobFilterToggle onFilterChange={handleFilterChange} />
        <div className="w-1/3 justify-end">
          <form onSubmit={handleImportNewJobs}>
            <input
              type="file"
              name="file"
              accept=".json"
              className="bg-gray-400 hover:bg-emerald-700 text-white px-4 py-2 rounded"
            />
            {/* <Button className="bg-emerald-600 hover:bg-emerald-700 text-white"> */}
            {/* <RotateCcw className="w-4 h-4 mr-1" strokeWidth={3} /> */}
            {/* Fetch New Listings */}
            {/* </Button> */}
            <input
              type="submit"
              value="Import New Listings"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
            />
          </form>
          <span className="text-xs text-gray-500 italic">
            {/* TODO: Update to pull last actual fetch timestamp */}
            {/* Last Fetched from Upwork: 2024-11-22 */}
          </span>
          <form>
            {/* <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <RotateCcw className="w-4 h-4 mr-1" strokeWidth={3} />
              Run Crew Analysis
            </Button> */}
          </form>
        </div>
      </div>
      <JobFeed jobs={filteredJobs} />
    </div>
  );
}

export default JobFeedContainer;
