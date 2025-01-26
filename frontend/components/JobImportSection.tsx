import { Job } from "@/server/db/schema";
import React, { useRef, useState } from "react";

interface JobImportSectionProps {
	onImport: (jsonData: Job[]) => Promise<void>;
}

const JobImportSection: React.FC<JobImportSectionProps> = ({ onImport }) => {
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [lastImportTime, setLastImportTime] = useState("2024-03-22 14:30");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("Importing jobs from form...");

		const file = fileInputRef.current?.files?.[0];
		console.log("Selected file:", file);

		if (!file) {
			console.log("No file selected");
			return;
		}

		const reader = new FileReader();
		reader.onload = async (e) => {
			try {
				console.log("FileReader onload event:", e.target);
				const json = JSON.parse(e.target?.result as string);
				console.log("Parsed JSON:", json);
				await onImport(json);
				setSelectedFile(null); // Reset the file selection after import

				// Also reset the actual file input
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}

				// Update the last import time
				setLastImportTime(new Date().toLocaleString());
			} catch (error) {
				console.error("Invalid JSON file:", error);
				// Handle error (e.g., show a toast message)
			}
		};
		reader.readAsText(file);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Truncate filename if it's too long
			const truncatedName =
				file.name.length > 20 ? file.name.substring(0, 17) + "..." : file.name;
			setSelectedFile(truncatedName);
		} else {
			setSelectedFile(null);
		}
	};

	const clearFileSelection = () => {
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		setSelectedFile(null);
	};

	return (
		<div>
			<div className="flex flex-col p-1 border border-gray-200 bg-white rounded-lg shadow-sm">
				<div className="flex items-center">
					<span className="mx-5 text-sm font-semibold text-gray-700">
						Import Jobs:
					</span>
					<form
						onSubmit={handleSubmit}
						className="inline-flex p-1 bg-gray-50 rounded-lg items-center"
					>
						<div className="relative group cursor-pointer">
							<input
								ref={fileInputRef}
								type="file"
								name="file"
								accept=".json"
								onChange={handleFileChange}
								className="hidden"
							/>
							<div className="flex items-center">
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-md transition-all duration-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm flex items-center"
								>
									{selectedFile ? (
										<>
											<svg
												className="w-4 h-4 mr-2 text-emerald-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
											<span className="mr-2 text-xs text-gray-600">
												{selectedFile}
											</span>
										</>
									) : (
										<>
											<svg
												className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-emerald-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
												/>
											</svg>
											<span>Choose File</span>
										</>
									)}
								</button>
								{selectedFile && (
									<button
										type="button"
										onClick={clearFileSelection}
										className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
										title="Clear selection"
									>
										<svg
											className="w-3 h-3 text-gray-500 hover:text-gray-700"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								)}
							</div>
						</div>
						<button
							type="submit"
							disabled={!selectedFile}
							className={`px-4 py-2 ml-2 text-sm font-medium rounded-md shadow-sm transition-all duration-200 
								${
									selectedFile
										? "bg-emerald-600 text-white hover:bg-emerald-700"
										: "bg-gray-100 text-gray-400 cursor-not-allowed"
								}`}
						>
							Import
						</button>
					</form>
				</div>
				<div className="px-5 pb-1 mt-1 border-t border-gray-100">
					<span className="text-xs text-gray-500 italic">
						Last import: {lastImportTime}
					</span>
				</div>
			</div>
		</div>
	);
};

export default JobImportSection;
