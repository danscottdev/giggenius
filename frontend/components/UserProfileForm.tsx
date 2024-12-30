"use client";

interface UserProfile {
  user_name: string;
  user_summary: string;
  //   user_skills: string;
  //   user_project_history: string;
  //   user_job_vetos: string;
}

export default function UserProfilePage({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  console.log("userProfile:", userProfile);

  // set userProfile to tempProfile

  // get user ID:

  //   const [profile, setProfile] = useState({
  //     userName: "",
  //     professionalSummary: "",
  //     techSkills: "",
  //     projectHistory: "",
  //     jobPreferences: "",
  //     vetoList: "",
  //   });
  //   useEffect(() => {
  //     async function loadProfile() {
  //       const data = await fetchUserProfile();
  //       setProfile(data);
  //     }
  //     loadProfile();
  //   }, []);

  //   const handleChange = (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //   ) => {
  //     const { name, value } = e.target;
  //     setProfile((prevProfile) => ({
  //       ...prevProfile,
  //       [name]: value,
  //     }));
  //   };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     await updateUserProfile(profile);
  //   };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              User Name:
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={userProfile.user_name}
              //   onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="professionalSummary"
              className="block text-sm font-medium text-gray-700"
            >
              Professional Summary:
            </label>
            <textarea
              id="professionalSummary"
              name="professionalSummary"
              value={userProfile.user_summary}
              //   onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          {/* <div>
            <label
              htmlFor="techSkills"
              className="block text-sm font-medium text-gray-700"
            >
              Tech Skills:
            </label>
            <input
              type="text"
              id="techSkills"
              name="techSkills"
              value={userProfile.user_skills}
              //   onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="projectHistory"
              className="block text-sm font-medium text-gray-700"
            >
              Project History:
            </label>
            <textarea
              id="projectHistory"
              name="projectHistory"
              value={userProfile.user_project_history}
              //   onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
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
          </div>
          <div>
            <label
              htmlFor="vetoList"
              className="block text-sm font-medium text-gray-700"
            >
              Veto List:
            </label>
            <input
              type="text"
              id="vetoList"
              name="vetoList"
              value={userProfile.user_job_vetos}
              //   onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div> */}
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
