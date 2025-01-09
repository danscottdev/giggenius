"use client";

import { useState } from "react";
import { UserProfile } from "@/server/db/schema";
import axios from "axios";

export default function UserProfilePage({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const [profile, setProfile] = useState<UserProfile>({
    user_id: userProfile.user_id,
    user_name: userProfile.user_name,
    user_summary: userProfile.user_summary,
    user_skills: userProfile.user_skills,
    user_project_history: userProfile.user_project_history,
    user_job_vetos: userProfile.user_job_vetos,
  });

  console.log("userProfile:", userProfile);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log("handleChange called");
    console.log("e:", e);
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("profile:", profile);
    await axios.post("/api/user", profile);
    console.log("Profile updated");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="user_name"
              className="block text-sm font-medium text-gray-700"
            >
              User Name:
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={profile.user_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="user_summary"
              className="block text-sm font-medium text-gray-700"
            >
              Professional Summary:
            </label>
            <textarea
              id="user_summary"
              name="user_summary"
              value={profile.user_summary}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="user_skills"
              className="block text-sm font-medium text-gray-700"
            >
              Tech Skills:
            </label>
            <input
              type="text"
              id="user_skills"
              name="user_skills"
              value={profile.user_skills}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="user_project_history"
              className="block text-sm font-medium text-gray-700"
            >
              Project History:
            </label>
            <textarea
              id="user_project_history"
              name="user_project_history"
              value={profile.user_project_history}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          {/* <div>
            <label
              htmlFor="jobPreferences"
              className="block text-sm font-medium text-gray-700"
            >
              Job Preferences:
            </label>
            <input
              type="text"
              id="jobPreferences"
              name="jobPreferences"
              value={userProfile.user_job_vetos}
              //   onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div> */}
          <div>
            <label
              htmlFor="user_job_vetos"
              className="block text-sm font-medium text-gray-700"
            >
              Veto List:
            </label>
            <input
              type="text"
              id="user_job_vetos"
              name="user_job_vetos"
              value={profile.user_job_vetos}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleSubmit}
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
