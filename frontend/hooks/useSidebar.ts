import { useState, useEffect } from "react";
import { LAYOUT_CONSTANTS } from "@/constants/layout";

export function useSidebar() {
	const [isMobile, setIsMobile] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			const isWindowMobile =
				window.innerWidth <= LAYOUT_CONSTANTS.MOBILE_BREAKPOINT;
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

	const toggleSidebar = () => {
		if (isMobile) {
			setIsOpen((prev) => !prev);
		} else {
			setIsCollapsed((prev) => !prev);
		}
	};

	return {
		isMobile,
		isOpen,
		isCollapsed,
		toggleSidebar,
		setIsOpen,
	};
}
