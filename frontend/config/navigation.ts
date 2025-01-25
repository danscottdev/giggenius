import { Home, Compass, NotebookPen, Settings, UserPen } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
	href: string;
	label: string;
	icon: LucideIcon;
	isActive: (pathname: string) => boolean;
}

export const navigationItems: NavItem[] = [
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
