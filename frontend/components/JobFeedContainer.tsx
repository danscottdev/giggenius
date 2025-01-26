"use client";

import React, { useEffect, useRef, useState } from "react";
// import { Button } from "./ui/button";
import JobFeed from "./JobFeed";
// import { RotateCcw } from "lucide-react";
import { Job, JobWithMatches } from "@/server/db/schema";
import axios from "axios";
import JobFilterToggle from "./JobFilterToggle";
import toast from "react-hot-toast";
import JobImportSection from "@/components/JobImportSection";

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
				// API endpoint fetches jobs by newest first by default
				const newJobs = await axios.get("/api/jobs");
				setFilteredJobs(newJobs.data);
				break;
			default:
				setFilteredJobs(jobs);
				break;
		}
	};

	useEffect(() => {
		setFilteredJobs(intialJobs.current);
	}, []);

	const handleImportNewJobs = async (jsonData: Job[]) => {
		try {
			console.log("Importing jobs...");
			await axios.post("/api/jobs/import", jsonData);
			const newJobs = await axios.get("/api/jobs");
			setFilteredJobs(newJobs.data);
			toast.success("Jobs imported successfully");
		} catch (error) {
			console.error("Failed to import jobs:", error);
			toast.error("Failed to import jobs");
		}
	};

	// const handleImportNewJobs = async (
	// 	event: React.FormEvent<HTMLFormElement>
	// ) => {
	// 	event.preventDefault();

	// 	try {
	// 		const formData = new FormData(event.currentTarget);
	// 		const file = formData.get("file") as File;
	// 		if (!file) {
	// 			toast.error("Please select a file");
	// 			return;
	// 		}

	// 		const text = await file.text();
	// 		const json = JSON.parse(text);
	// 		console.log("Parsed JSON:", json);

	// 		await axios.post("/api/jobs/import", json);
	// 		const newJobs = await axios.get("/api/jobs");
	// 		setFilteredJobs(newJobs.data);
	// 		toast.success("Jobs imported successfully");
	// 	} catch (error) {
	// 		console.error("Import failed:", error);
	// 		toast.error("Failed to import jobs");
	// 	}
	// };

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
			toast.success("CrewAI analysis complete");
		} catch (error) {
			console.error("Failed to run CrewAI analysis:", error);
			toast.error("Failed to run CrewAI analysis");
		} finally {
			setIsLoading(false);
		}
	};

	// Add FileUploadButton component inside JobFeedContainer
	// const FileUploadButton: React.FC<{
	// 	accept?: string;
	// 	name?: string;
	// 	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	// 	className?: string;
	// 	children?: React.ReactNode;
	// }> = ({ accept, name = "file", onChange, className = "", children }) => {
	// 	const inputRef = React.useRef<HTMLInputElement>(null);

	// 	const handleClick = () => {
	// 		inputRef.current?.click();
	// 	};

	// 	return (
	// 		<div className="relative group cursor-pointer">
	// 			<input
	// 				ref={inputRef}
	// 				type="file"
	// 				name={name}
	// 				accept={accept}
	// 				onChange={onChange}
	// 				className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
	// 			/>
	// 			<button
	// 				type="button"
	// 				onClick={handleClick}
	// 				className={`px-4 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-md transition-all duration-200 group-hover:bg-gray-100 group-hover:border-gray-300 group-hover:shadow-sm flex items-center cursor-pointer ${className}`}
	// 			>
	// 				{children}
	// 			</button>
	// 		</div>
	// 	);
	// };

	return (
		<div className="bg-white rounded-lg shadow-sm p-6">
			<div className="flex justify-start items-start mb-6 gap-6">
				<JobFilterToggle onFilterChange={handleFilterChange} />
				<JobImportSection onImport={handleImportNewJobs} />
				<button
					className={`bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded ml-auto ${
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
