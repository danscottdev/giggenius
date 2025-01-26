import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MatchScoreProps {
	score: number;
	className?: string;
}

const MatchScore: React.FC<MatchScoreProps> = ({ score, className }) => {
	const [animatedScore, setAnimatedScore] = useState(0);

	useEffect(() => {
		if (score < 0) {
			setAnimatedScore(0);
			return;
		}
		// Small delay to ensure the animation is visible
		const timer = setTimeout(() => {
			setAnimatedScore(score);
		}, 100);

		return () => clearTimeout(timer);
	}, []); // Empty dependency array means this runs once on mount

	// Calculate percentage for the circle fill
	const percentage = (animatedScore / 5) * 100;

	// Dynamic color based on score
	const getScoreColor = (score: number) => {
		if (score >= 4)
			return {
				stroke: "stroke-green-500",
				text: "text-green-500",
				size: "text-xl",
				bg: "bg-green-100",
				shadow: "drop-shadow-[0_2px_2px_rgba(0,0,0,.25)]",
			};
		if (score >= 3)
			return {
				stroke: "stroke-blue-500",
				text: "text-blue-500",
				bg: "bg-blue-50",
				shadow: "drop-shadow-[0_2px_2px_rgba(0,0,0,.25)]",
			};
		if (score >= 2)
			return {
				stroke: "stroke-yellow-500",
				text: "text-yellow-500",
				bg: "bg-yellow-50",
				shadow: "drop-shadow-[0_2px_2px_rgba(0,0,0,.25)]",
			};
		if (score >= 1) {
			return {
				stroke: "stroke-red-500",
				text: "text-red-500",
				bg: "bg-red-50",
				shadow: "drop-shadow-[0_2px_2px_rgba(0,0,0,.25)]",
			};
		}
		return {
			stroke: "stroke-red-800",
			text: "text-red-800",
			bg: "bg-red-300",
			shadow: "drop-shadow-[0_2px_2px_rgba(0,0,0,.25)]",
		};
	};

	const colors = getScoreColor(score);

	return (
		<div
			className={cn("flex justify-center items-center gap-3 py-5", className)}
		>
			<div
				className={cn(
					"relative w-16 h-16 rounded-full hover:rotate-3 hover:scale-105",
					"transition-all duration-200 ease-in-out",
					colors.bg,
					"filter",
					colors.shadow
				)}
			>
				<svg className="w-full h-full -rotate-90">
					<circle
						cx="32"
						cy="32"
						r="28"
						strokeWidth="4"
						fill="none"
						className="stroke-muted"
					/>
					<circle
						cx="32"
						cy="32"
						r="28"
						strokeWidth="4"
						fill="none"
						strokeDasharray={175.93}
						strokeDashoffset={175.93 - (percentage * 175.93) / 100}
						className={cn(
							"transition-all duration-1000 ease-out",
							colors.stroke
						)}
					/>
				</svg>
				<div className="absolute inset-0 flex items-center justify-center">
					<span
						className={cn(
							"text-2xl font-bold transition-all duration-200",
							"group-hover:scale-110",
							colors.text
						)}
					>
						{animatedScore > 0 ? animatedScore.toFixed(0) : "—"}
					</span>
				</div>
			</div>
			<div className="flex flex-col">
				<span className="text-sm font-medium">Match Score</span>
				<span className="text-sm text-muted-foreground">out of 5</span>
			</div>
		</div>
	);
};

export default MatchScore;
