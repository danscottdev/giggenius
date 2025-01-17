"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import SidebarNav from "./SidebarNav";
import SidebarToggle from "./SidebarToggle";
import { SignInButton, SignedOut, useUser } from "@clerk/nextjs";
import UserProfileSection from "./UserProfileSection";

const MOBILE_WINDOW_WIDTH_LIMIT = 1024;

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { isSignedIn } = useUser();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (
    e: MouseEvent,
    isMobile: boolean,
    isOpen: boolean
  ) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
      if (isMobile && isOpen) {
        setIsOpen(false);
      }
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isWindowMobile = window.innerWidth <= MOBILE_WINDOW_WIDTH_LIMIT;
      setIsMobile(isWindowMobile);

      if (isWindowMobile) {
        setIsCollapsed(false);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) =>
      handleClickOutside(e, isMobile, isOpen);
    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [isMobile, isOpen]);

  // Functions
  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const renderMenuIcon = (isOpen: boolean) => {
    return isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />;
  };

  return (
    <div>
      {isMobile && (
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          className={cn(
            "fixed top-4 left-4 z-50 bg-transparent hover:bg-gray-100/50 backdrop-blur-sm"
          )}
        >
          {renderMenuIcon(isOpen)}
        </Button>
      )}

      {(!isMobile || isOpen) && (
        <div
          ref={sidebarRef}
          className={cn(
            "bg-gray-100 flex flex-col h-screen transition-all duration-300 overflow-y-auto",
            !isMobile
              ? ""
              : `fixed inset-y-0 left-0 z-40 w-64 transoform ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
                }`,
            isMobile
              ? ""
              : isCollapsed
              ? "w-28 h-screen sticky top-0"
              : "w-64 h-screen sticky top-0"
          )}
        >
          <div
            className={cn(
              "flex flex-col flex-grow p-6",
              isMobile ? "pt-16" : "pt-10"
            )}
          >
            {!isCollapsed && (
              <h1 className="text-4xl font-bold mb-10">GigGenius</h1>
            )}
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
