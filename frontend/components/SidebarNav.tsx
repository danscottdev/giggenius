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
    <div className="space-y4 overflow-hidden mb-auto">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          asChild
          className={cn(
            "w-full justify-start hover:text-main hover:bg-gray-200 flex items-center text-lg font-medium",
            item.isActive(pathname) && "text-main bg-gray-200"
          )}
        >
          <Link href={item.href}>
            <item.icon className="h-[22px] w-[22px]" />
            {(isMobile || !isCollapsed) && (
              <span className="ml-4">{item.label}</span>
            )}
          </Link>
        </Button>
      ))}
    </div>
  );
}

export default SidebarNav;
