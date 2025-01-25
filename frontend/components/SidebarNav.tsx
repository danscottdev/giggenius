import React from "react";
import { Button } from "./ui/button";
import { Home, Compass, NotebookPen, Settings, UserPen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
	isMobile: boolean;
	isCollapsed: boolean;
}

interface NavItem {
	href: string;
	label: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	isActive: (pathname: string) => boolean;
}

function SidebarNav({ isMobile, isCollapsed }: SidebarNavProps) {
	const pathname = usePathname();
	const navItems: NavItem[] = [
		{
			href: "/jobfeed",
			label: "Job Feed",
			icon: Home,
			isActive: (pathname: string) => pathname === "/jobfeed",
		},
		{
			href: "/profile",
			label: "User Profile",
			icon: UserPen,
			isActive: (pathname: string) => pathname === "/profile",
		},
		{
			href: "/proposals",
			label: "Proposals",
			icon: NotebookPen,
			isActive: (pathname: string) =>
				pathname === "/proposals" || pathname.startsWith("/proposal/"),
		},
		{
			href: "/finetune",
			label: "Fine Tuning",
			icon: Compass,
			isActive: (pathname: string) =>
				pathname === "/finetune" || pathname.startsWith("/finetune/"),
		},
		{
			href: "/settings",
			label: "Settings",
			icon: Settings,
			isActive: (pathname: string) => pathname === "/settings",
		},
	];
	return (
		<div className="space-y-2 overflow-hidden mb-auto">
			{navItems.map((item) => (
				<Button
					key={item.href}
					variant="ghost"
					asChild
					className={cn(
						"w-full justify-start hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg flex items-center text-[15px] font-medium transition-all duration-200 border border-gray-100/50 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
						item.isActive(pathname) &&
							"text-emerald-600 bg-emerald-50/50 font-semibold border-emerald-100 shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
					)}
				>
					<Link href={item.href} className="flex items-center py-2">
						<item.icon
							className={cn(
								"h-[20px] w-[20px]",
								item.isActive(pathname) ? "text-emerald-600" : "text-gray-500"
							)}
						/>
						{(isMobile || !isCollapsed) && (
							<span
								className="ml-3"
								style={{ display: "block", height: "100%" }}
							>
								{item.label}
							</span>
						)}
					</Link>
				</Button>
			))}
		</div>
	);
}

export default SidebarNav;
