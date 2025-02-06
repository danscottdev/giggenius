"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/server/db/schema";
import axios from "axios";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserProfileForm({
	userProfile,
}: {
	userProfile: UserProfile;
}) {
	const [profile, setProfile] = useState<UserProfile>(userProfile);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Handle unsaved changes warning when navigating away
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [hasUnsavedChanges]);

	// Handle in-app navigation
	useEffect(() => {
		const handleBeforeNavigate = () => {
			if (hasUnsavedChanges) {
				const confirm = window.confirm(
					"You have unsaved changes. Are you sure you want to leave?"
				);
				if (!confirm) {
					throw "Route Cancelled";
				}
			}
		};

		window.addEventListener("beforeNavigate", handleBeforeNavigate);
		return () =>
			window.removeEventListener("beforeNavigate", handleBeforeNavigate);
	}, [hasUnsavedChanges]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setProfile((prev) => ({ ...prev, [name]: value }));

		// Track which fields have changed
		if (value !== userProfile[name as keyof UserProfile]) {
			setChangedFields((prev) => new Set(prev).add(name));
			setHasUnsavedChanges(true);
		} else {
			setChangedFields((prev) => {
				const newSet = new Set(prev);
				newSet.delete(name);
				// Check if there are any remaining changed fields
				setHasUnsavedChanges(newSet.size > 0);
				return newSet;
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await axios.post("/api/user", profile);
			toast.success("Profile updated successfully!");
			setChangedFields(new Set());
			setHasUnsavedChanges(false);
		} catch (error) {
			toast.error("Failed to update profile");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderField = (
		name: keyof UserProfile,
		label: string,
		Component: typeof Input | typeof Textarea,
		props: { placeholder?: string; rows?: number } = {}
	) => {
		const isChanged = changedFields.has(name);

		const commonProps = {
			id: name,
			name: name,
			value: profile[name] || "",
			onChange: handleChange,
			className: cn(
				isChanged && "border-orange-500 focus-visible:ring-orange-500"
			),
			...props,
		};

		return (
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label htmlFor={name} className={cn(isChanged && "text-orange-500")}>
						{label}
						{isChanged && (
							<AlertCircle className="inline ml-2 h-4 w-4 text-orange-500" />
						)}
					</Label>
				</div>
				{Component === Input ? (
					<Input type="text" {...commonProps} />
				) : (
					<Textarea {...commonProps} />
				)}
			</div>
		);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
			<Tabs defaultValue="basic" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="basic">
						Basic Info
						{Array.from(changedFields).some((field) =>
							["user_name", "user_focus", "user_summary"].includes(field)
						) && <AlertCircle className="ml-2 h-4 w-4 text-orange-500" />}
					</TabsTrigger>
					<TabsTrigger value="skills">
						Skills & Experience
						{Array.from(changedFields).some((field) =>
							["user_skills", "user_project_history"].includes(field)
						) && <AlertCircle className="ml-2 h-4 w-4 text-orange-500" />}
					</TabsTrigger>
					<TabsTrigger value="preferences">
						Preferences
						{Array.from(changedFields).some((field) =>
							["user_job_vetos"].includes(field)
						) && <AlertCircle className="ml-2 h-4 w-4 text-orange-500" />}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="basic">
					<Card>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
							<CardDescription>
								Your core profile information used for job matching
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{renderField("user_name", "Name", Input)}
							{renderField("user_focus", "Area of Focus", Input, {
								placeholder:
									"e.g., Full Stack Development, DevOps, Mobile Development",
							})}
							{renderField("user_summary", "Professional Summary", Textarea, {
								rows: 4,
								placeholder:
									"Write a brief summary of your professional background...",
							})}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="skills">
					<Card>
						<CardHeader>
							<CardTitle>Skills & Experience</CardTitle>
							<CardDescription>
								Detail your technical expertise and project history
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="user_skills">Technical Skills</Label>
								<Textarea
									id="user_skills"
									name="user_skills"
									value={profile.user_skills}
									onChange={handleChange}
									rows={3}
									placeholder="List your technical skills (e.g., JavaScript, React, Node.js)"
								/>
								<p className="text-sm text-muted-foreground">
									Separate skills with commas
								</p>
							</div>

							<Separator className="my-4" />

							<div className="space-y-2">
								<Label htmlFor="user_project_history">Project History</Label>
								<Textarea
									id="user_project_history"
									name="user_project_history"
									value={profile.user_project_history}
									onChange={handleChange}
									rows={6}
									placeholder="Describe your most relevant projects..."
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="preferences">
					<Card>
						<CardHeader>
							<CardTitle>Job Preferences</CardTitle>
							<CardDescription>
								Configure your job matching preferences and filters
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="user_job_vetos">
									Job Types to Avoid (Veto List)
								</Label>
								<Textarea
									id="user_job_vetos"
									name="user_job_vetos"
									value={profile.user_job_vetos}
									onChange={handleChange}
									rows={4}
									placeholder="Enter keywords or phrases for jobs you want to avoid..."
								/>
								<p className="text-sm text-muted-foreground">
									Separate items with commas. These will be used to
									automatically filter out unwanted job matches.
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<div className="flex justify-between items-center">
				{hasUnsavedChanges && (
					<p className="text-orange-500 flex items-center gap-2">
						<AlertCircle className="h-4 w-4" />
						You have unsaved changes
					</p>
				)}
				<div className="flex gap-4">
					<Button
						type="submit"
						disabled={isSubmitting || !hasUnsavedChanges}
						className={cn(
							hasUnsavedChanges &&
								"bg-orange-500 hover:bg-orange-600 transition-colors"
						)}
					>
						{isSubmitting ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</div>
		</form>
	);
}
