"use client";

import React, { useEffect, useRef, useState } from "react";
// import { Button } from "./ui/button";
import JobFeed from "./JobFeed";
// import { RotateCcw } from "lucide-react";
import { Job, JobWithMatches } from "@/server/db/schema";
import axios from "axios";
import JobFilterToggle from "./JobFilterToggle";
import toast from "react-hot-toast";

function JobFeedContainer({ jobs }: { jobs: Job[] }) {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const intialJobs = useRef(jobs);

  const handleFilterChange = async (filter: string) => {
    switch (filter) {
      case "strong":
        // API call to get jobs with match strength >= 4
        const strongJobs = await axios.get("/api/jobs?strongOnly=true");
        setFilteredJobs(strongJobs.data);
        break;
      case "new":
        // @TODO API call to get jobs by last updated date
        // currently just resets to initial jobs when page loaded. Which is the same I guess.
        setFilteredJobs(jobs);
        break;
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
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const file = formData.get("file") as File;
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          await axios.post("/api/jobs/import", json);
          const newJobs = await axios.get("/api/jobs");
          setFilteredJobs(newJobs.data);
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
    }
  };

  const handleManualFetch = async () => {
    setIsLoading(true);
    toast.success("Running CrewAI analysis...");
    try {
      const response = await axios.get(
        "https://giggenius-production.up.railway.app/trigger"
      );
      console.log(response);
      const newJobs = await axios.get("/api/jobs");
      setFilteredJobs(newJobs.data);
    } catch (error) {
      console.error("Failed to run CrewAI analysis:", error);
      toast.error("Failed to run CrewAI analysis");
    } finally {
      setIsLoading(false);
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
        </div>
        <button
          className={`bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleManualFetch}
          disabled={isLoading}
        >
          {isLoading ? "Running..." : "Run CrewAI Analysis"}
        </button>
      </div>
      <JobFeed jobs={filteredJobs as JobWithMatches[]} />
    </div>
  );
}

export default JobFeedContainer;
