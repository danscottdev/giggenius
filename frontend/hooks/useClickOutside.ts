import { useEffect, RefObject } from "react";

type Handler = () => void;

export function useClickOutside<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T>,
	handler: Handler
) {
	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			const target = event.target as Node;
			if (!ref.current || ref.current.contains(target)) {
				return;
			}
			handler();
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler]);
}
