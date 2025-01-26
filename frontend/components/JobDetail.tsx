import { TableCell } from "./ui/table";
import { Button } from "./ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { ThumbsUp } from "lucide-react";
import { FileText } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { JobWithMatches } from "@/server/db/schema";
import { Star } from "lucide-react";
// import { CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import MatchScore from "./MatchScore";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsDown } from "lucide-react";

interface JobDetailProps {
	job: JobWithMatches;
	matchStrength: number;
	onCollapse: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({
	job,
	matchStrength,
	onCollapse,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
	const [ratingType, setRatingType] = useState<{
		type: "positive" | "negative" | null;
		source: "match" | "client" | null;
	}>({ type: null, source: null });

	return (
		<TableCell
			colSpan={6}
			className="bg-gray-50 py-5 px-10 border-2 border-gray-200 border-solid border-t-dotted"
		>
			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-2 space-y-6">
					<div id="job-detail" className="space-y-6">
						<h2 className="text-2xl font-bold mb-4">{job.upwk_title}</h2>
						<div className="space-y-4">
							<div
								className={`text-muted-foreground relative transition-all duration-300 ease-in-out ${
									!isExpanded ? "max-h-48" : "max-h-[1000px]"
								} overflow-hidden`}
							>
								{job.upwk_description}
								{!isExpanded && (
									<div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent transition-opacity duration-300 ease-in-out" />
								)}
							</div>
							<Button
								variant="ghost"
								className="flex items-center text-sm hover:bg-gray-100 transition-colors duration-200"
								onClick={() => setIsExpanded(!isExpanded)}
							>
								{isExpanded ? (
									<>
										Show less{" "}
										<ChevronUp className="ml-1 h-4 w-4 transition-transform duration-200" />
									</>
								) : (
									<>
										Read more{" "}
										<ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
									</>
								)}
							</Button>
						</div>
					</div>

					<Card className="w-1/2">
						<CardHeader className="py-2 px-6 bg-gray-50 border-b border-gray-200 rounded-t-xl">
							<CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider rounded-t-xl">
								Client Details
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-2 text-sm px-6 py-4">
								<div className="text-muted-foreground">Location</div>
								<div>{job.upwk_client_location}</div>

								<div className="text-muted-foreground">Rating</div>
								<div className="flex items-center">
									<Star className="w-4 h-4 fill-primary text-primary mr-1" />
									<span>
										{job.upwk_client_rating
											? parseInt(job.upwk_client_rating).toFixed(1)
											: "N/A"}
									</span>
								</div>

								<div className="text-muted-foreground">Total Spend</div>
								<div>{job.upwk_client_spend}</div>

								<div className="text-muted-foreground">Verification</div>
								<div>
									{job.upwk_client_payment_verified ? "Verified" : "Unverified"}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div id="job-analysis-cards" className="space-y-6">
					<div className="flex gap-2">
						<Button className="flex-1" variant="outline" asChild>
							<a
								href={job.upwk_url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center"
							>
								<ExternalLink className="w-4 h-4" />
								View Job Listing
							</a>
						</Button>
						<Button className="flex-1" variant="default" onClick={() => {}}>
							<FileText className="w-4 h-4" />
							Generate Proposal
						</Button>
					</div>
					<Card>
						<CardHeader className="py-2 px-6 bg-gray-50 border-b border-gray-200 rounded-t-xl">
							<CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider rounded-t-xl">
								Match Analysis
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="space-y-2">
									<MatchScore score={matchStrength} />
									<p className="text-sm text-muted-foreground">
										{job.matches[0]?.match_analysis}
									</p>
								</div>
							</div>
						</CardContent>
						<CardFooter className="bg-gray-50 border-t border-gray-200 rounded-b-xl pt-4">
							<div className="w-full space-y-2">
								<h4 className="text-xs font-bold text-center text-muted-foreground uppercase tracking-wider">
									Rate this analysis
								</h4>
								<div className="flex gap-2 w-full">
									<Button
										variant="outline"
										size="sm"
										className="flex-1 min-w-0 hover:bg-emerald-100"
										onClick={() => {
											setRatingType({ type: "positive", source: "match" });
											setIsRatingModalOpen(true);
										}}
									>
										<ThumbsUp className="w-4 h-4 mr-2" />
										Helpful
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="flex-1 min-w-0 hover:bg-red-100"
										onClick={() => {
											setRatingType({ type: "negative", source: "match" });
											setIsRatingModalOpen(true);
										}}
									>
										<ThumbsDown className="w-4 h-4 mr-2" />
										Not Helpful
									</Button>
								</div>
							</div>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader className="py-2 px-6 bg-gray-50 border-b border-gray-200 rounded-t-xl">
							<CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider rounded-t-xl">
								Client Analysis
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="space-y-2">
									<MatchScore score={job.matches[0]?.client_score ?? 0} />
									<p className="text-sm text-muted-foreground">
										{job.matches[0]?.client_analysis}
									</p>
								</div>
							</div>
						</CardContent>
						<CardFooter className="bg-gray-50 border-t border-gray-200 rounded-b-xl pt-4">
							<div className="w-full space-y-4">
								<h4 className="text-xs font-bold text-center text-muted-foreground uppercase tracking-wider">
									Rate this analysis
								</h4>
								<div className="flex gap-2 w-full">
									<Button
										variant="outline"
										size="sm"
										className="flex-1 min-w-0 hover:bg-emerald-100"
										onClick={() => {
											setRatingType({ type: "positive", source: "client" });
											setIsRatingModalOpen(true);
										}}
									>
										<ThumbsUp className="w-4 h-4 mr-2" />
										Helpful
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="flex-1 min-w-0 hover:bg-red-100"
										onClick={() => {
											setRatingType({ type: "negative", source: "client" });
											setIsRatingModalOpen(true);
										}}
									>
										<ThumbsDown className="w-4 h-4 mr-2" />
										Not Helpful
									</Button>
								</div>
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>

			<div className="mt-6 flex justify-center w-full">
				<button
					className="w-full flex items-center justify-center text-sm py-4 border border-dotted border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
					onClick={(e) => {
						e.stopPropagation(); // Prevent event from bubbling up to TableRow
						onCollapse();
					}}
				>
					<ChevronUp className="mr-2 h-4 w-4" />
					Collapse
				</button>
			</div>

			<Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{ratingType.type === "positive"
								? "What was helpful?"
								: "What could be improved?"}{" "}
							(
							{ratingType.source === "match"
								? "Match Analysis"
								: "Client Analysis"}
							)
						</DialogTitle>
					</DialogHeader>
					<Textarea
						placeholder="Please provide your feedback..."
						className="min-h-[100px]"
					/>
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => setIsRatingModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								// Handle feedback submission here
								// You now have access to both ratingType.type and ratingType.source
								setIsRatingModalOpen(false);
							}}
						>
							Submit
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</TableCell>
	);
};

export default JobDetail;
