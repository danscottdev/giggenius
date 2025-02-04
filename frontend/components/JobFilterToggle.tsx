import React, { useEffect, useState } from "react";

interface JobFilterToggleProps {
	onFilterChange: (filter: string) => void;
}

const JobFilterToggle = ({ onFilterChange }: JobFilterToggleProps) => {
	const [activeFilter, setActiveFilter] = useState("all");

	const handleFilterChange = (filter: string) => {
		setActiveFilter(filter);
		onFilterChange(filter);
	};

	// on page load, set active filter to "new"
	useEffect(() => {
		setActiveFilter("new");
	}, []);

	return (
		<div className="inline-flex items-center p-1 bg-emerald-50 rounded-lg">
			<span className="mx-5 text-sm font-semibold text-gray-700">Sort By:</span>
			<div className="inline-flex p-1 bg-gray-100 rounded-lg">
				<button
					onClick={() => handleFilterChange("new")}
					className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
						activeFilter === "new"
							? "bg-white text-emerald-600 shadow-sm"
							: "text-gray-600 hover:text-gray-700"
					}`}
				>
					New
				</button>
				<button
					onClick={() => handleFilterChange("strong")}
					className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
						activeFilter === "strong"
							? "bg-white text-emerald-600 shadow-sm"
							: "text-gray-600 hover:text-gray-700"
					}`}
				>
					Strong Matches
				</button>
				<button
					onClick={() => handleFilterChange("trash")}
					className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
						activeFilter === "trash"
							? "bg-white text-red-600 shadow-sm"
							: "text-gray-600 hover:text-gray-700"
					}`}
				>
					Trash
				</button>
			</div>
		</div>
	);
};

export default JobFilterToggle;
