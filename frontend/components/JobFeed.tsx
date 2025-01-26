"use client";

import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { JobWithMatches } from "@/server/db/schema";
// import { Button } from "./ui/button";
import { truncateText } from "@/lib/utils";
import JobDetail from "./JobDetail";

interface JobFeedProps {
	jobs: JobWithMatches[];
}

function JobFeed({ jobs }: JobFeedProps) {
	const [expandedRows, setExpandedRows] = useState(new Set());

	const toggleRow = (rowId: string) => {
		const newExpandedRows = new Set(expandedRows);
		if (newExpandedRows.has(rowId)) {
			newExpandedRows.delete(rowId);
		} else {
			newExpandedRows.add(rowId);
		}
		setExpandedRows(newExpandedRows);
	};

	return (
		<div className="w-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-8"></TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Summary</TableHead>
						<TableHead>Match</TableHead>
						<TableHead className="w-2">Timestamp</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{jobs.map((job) => {
						const matchStrength = job.matches[0]?.match_strength || 0;
						const highlightClass = matchStrength >= 4 ? "bg-green-100" : "";

						return (
							<React.Fragment key={job.id}>
								<TableRow
									className={`cursor-pointer hover:bg-gray-100 ${highlightClass} ${
										expandedRows.has(job.id)
											? "border-2 border-gray-200 border-b-0 bg-emerald-50 drop-shadow-md hover:bg-emerald-100"
											: ""
									}`}
									onClick={() => toggleRow(job.id)}
								>
									<TableCell>
										{expandedRows.has(job.id) ? (
											<ChevronDown className="h-4 w-4" />
										) : (
											<ChevronRight className="h-4 w-4" />
										)}
									</TableCell>
									<TableCell>{job.upwk_title}</TableCell>
									<TableCell>
										{truncateText(job.upwk_description, 170)}
									</TableCell>
									<TableCell>{matchStrength} / 5</TableCell>
									<TableCell>
										{new Intl.DateTimeFormat("en-US", {
											month: "short",
											day: "2-digit",
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										}).format(new Date(job.created_at))}
									</TableCell>
								</TableRow>
								{expandedRows.has(job.id) && (
									<TableRow>
										<JobDetail
											job={job}
											matchStrength={matchStrength}
											onCollapse={() => toggleRow(job.id)}
										/>
									</TableRow>
								)}
							</React.Fragment>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

export default JobFeed;
