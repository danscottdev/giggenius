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
        "flex border-t border-gray-200",
        isCollapsed ? "p-4 justify-center" : "p-4 justify-end"
      )}
    >
      <Button
        variant="ghost"
        className={cn(
          "text-gray-800 hover:text-main hover:bg-gray-200",
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
