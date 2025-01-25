import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarToggleProps {
	isCollapsed: boolean;
	toggleSidebar: () => void;
}

function SidebarToggle({ isCollapsed, toggleSidebar }: SidebarToggleProps) {
	return (
		<div
			className={cn(
				"flex border-t border-gray-100/50 bg-gray-50/30",
				isCollapsed ? "p-3 justify-center" : "p-3 justify-end"
			)}
		>
			<Button
				variant="ghost"
				className={cn(
					"text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-colors duration-200",
					isCollapsed && "self-center"
				)}
				onClick={toggleSidebar}
			>
				{isCollapsed ? (
					<ChevronRight className="h-4 w-4" />
				) : (
					<ChevronLeft className="h-4 w-4" />
				)}
			</Button>
		</div>
	);
}

export default SidebarToggle;
