import React, { useState } from "react";

interface JobFilterToggleProps {
  onFilterChange: (filter: string) => void;
}

const JobFilterToggle = ({ onFilterChange }: JobFilterToggleProps) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="inline-flex p-1 bg-emerald-50 rounded-lg">
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
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeFilter === "all"
              ? "bg-white text-emerald-600 shadow-sm"
              : "text-gray-600 hover:text-gray-700"
          }`}
        >
          Show All
        </button>
      </div>
    </div>
  );
};

export default JobFilterToggle;
