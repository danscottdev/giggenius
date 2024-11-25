import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 max-h-screen p-4 sm:p-6 md:p-8 lg:p-6 pt-16 lg:pt-8 overflow:auto">
        <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12 lg:pt-0 mt-2 space-y-6 sm:space-y-8 lg:space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
