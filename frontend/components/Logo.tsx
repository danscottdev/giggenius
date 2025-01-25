interface LogoProps {
	isCollapsed?: boolean;
}

export function Logo({ isCollapsed }: LogoProps) {
	if (isCollapsed) return null;

	return (
		<h1 className="text-3xl font-bold mb-10 relative border-radius-lg-full">
			<span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent relative inline-block px-6 py-2 border-radius-lg-full">
				GigGenius
				<span
					className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-20 blur-sm -z-10 px-6 py-2 border-radius-lg"
					aria-hidden="true"
				>
					GigGenius
				</span>
			</span>
		</h1>
	);
}
