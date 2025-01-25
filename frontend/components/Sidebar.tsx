"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignInButton, SignedOut, useUser } from "@clerk/nextjs";
import { useSidebar } from "@/hooks/useSidebar";
import { useClickOutside } from "@/hooks/useClickOutside";
import { LAYOUT_CONSTANTS } from "@/constants/layout";
import SidebarNav from "./SidebarNav";
import SidebarToggle from "./SidebarToggle";
import UserProfileSection from "./UserProfileSection";
import { Logo } from "./Logo";

export function Sidebar() {
	const { isSignedIn } = useUser();
	const { isMobile, isOpen, isCollapsed, toggleSidebar, setIsOpen } =
		useSidebar();
	const sidebarRef = useRef<HTMLDivElement>(null);

	useClickOutside(sidebarRef, () => {
		if (isMobile && isOpen) {
			setIsOpen(false);
		}
	});

	return (
		<div className="sticky top-0 h-screen">
			{isMobile && (
				<Button
					variant="ghost"
					onClick={toggleSidebar}
					className={cn(
						"fixed top-4 left-4 z-50 bg-white/80 hover:bg-white/90 backdrop-blur-sm shadow-sm rounded-lg"
					)}
				>
					{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
				</Button>
			)}

			{(!isMobile || isOpen) && (
				<div
					ref={sidebarRef}
					className={cn(
						"bg-white/80 backdrop-blur-md border-r border-gray-100 flex flex-col h-screen transition-all duration-300 overflow-y-auto shadow-sm",
						!isMobile
							? ""
							: `fixed inset-y-0 left-0 z-40 w-${
									LAYOUT_CONSTANTS.SIDEBAR_WIDTH.EXPANDED
							  } transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
						isMobile
							? ""
							: isCollapsed
							? `w-${LAYOUT_CONSTANTS.SIDEBAR_WIDTH.COLLAPSED}`
							: `w-${LAYOUT_CONSTANTS.SIDEBAR_WIDTH.EXPANDED}`
					)}
				>
					<div
						className={cn(
							"flex flex-col flex-grow px-6 py-8",
							isMobile ? "pt-16" : "pt-8"
						)}
					>
						<Logo isCollapsed={isCollapsed} />
						<SidebarNav isMobile={isMobile} isCollapsed={isCollapsed} />
					</div>

					{isSignedIn && (
						<UserProfileSection isMobile={isMobile} isCollapsed={isCollapsed} />
					)}

					<SignedOut>
						<SignInButton />
					</SignedOut>

					<SidebarToggle
						isCollapsed={isCollapsed}
						toggleSidebar={toggleSidebar}
					/>
				</div>
			)}
		</div>
	);
}
