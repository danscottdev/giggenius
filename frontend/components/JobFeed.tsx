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
import { Button } from "./ui/button";
import { truncateText } from "@/lib/utils";

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
									className={`cursor-pointer hover:bg-gray-100 ${highlightClass}`}
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
										<TableCell colSpan={6} className="bg-gray-50">
											<div className="p-0 flex flex-row justify-between align-center">
												<div className="w-full border p-4">
													<h3 className="font-bold">{job.upwk_title}</h3>
													<p>{job.upwk_description}</p>
													<p className="text-sm text-gray-700">
														<span className="font-medium">Budget:</span>{" "}
														{job.upwk_budget}
													</p>
													<div className="mt-4">
														<h4 className="font-bold">Client Info</h4>
														<p>
															<span className="font-medium">
																Client Location:
															</span>{" "}
															{job.upwk_client_location}
														</p>
														<p>
															<span className="font-medium">
																Client Rating:
															</span>{" "}
															{job.upwk_client_rating}
														</p>
														<p>
															<span className="font-medium">Client Spend:</span>{" "}
															{job.upwk_client_spend}
														</p>
														<p>
															<span className="font-medium">
																Proposal Count:
															</span>{" "}
															{job.upwk_proposal_count}
														</p>
														<p>
															<span className="font-medium">
																Payment Verified:
															</span>{" "}
															{job.upwk_client_payment_verified}
														</p>
													</div>
													<div className="mt-4">
														<a href={job.upwk_url} target="_blank">
															<Button>View Job Listing</Button>
														</a>
													</div>
												</div>
												<div className="w-1/2 border p-4">
													<p className="font-bold text-center mb-2">
														Match Strength: {matchStrength} / 5
													</p>
													<p className="border border-gray-200 bg-gray-100 p-3">
														Match Analysis: {job.matches[0]?.match_analysis}
													</p>
													<p className="border border-gray-200 bg-gray-100 p-3">
														Client Score: {job.matches[0]?.client_score}
													</p>
													<p className="border border-gray-200 bg-gray-100 p-3">
														Client Analysis: {job.matches[0]?.client_analysis}
													</p>
													<Button className="w-full mt-2">
														Rate Match Analysis
													</Button>
													<Button className="w-full mt-2">
														Generate Proposal
													</Button>
												</div>
											</div>
											<div className="mt-4 w-full">
												<h4 className="font-bold">Proposal</h4>
												<p className="border border-gray-200 bg-gray-100 p-3">
													{job.matches[0]?.proposal}
												</p>
											</div>
										</TableCell>
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
