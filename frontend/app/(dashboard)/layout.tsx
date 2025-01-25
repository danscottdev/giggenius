import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar />
			<main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-6 pt-16 lg:pt-8">
				{children}
			</main>
		</div>
	);
}
