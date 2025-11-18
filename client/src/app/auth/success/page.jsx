"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    const parsedUser = JSON.parse(decodeURIComponent(user));
    if (parsedUser.role == "pending") {
      localStorage.setItem("temp_token", token);
      localStorage.setItem("temp_user", JSON.stringify(parsedUser));

      setUserData({ token, user: parsedUser });
      setShowRoleSelection(true);
    } else {
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
      router.push(`/${parsedUser.role}`);
    }
  }, [router, searchParams]);

  const handleRoleSelection = async (selectedRole) => {
    setLoading(true);

    try {
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/update-role`,
        { role: selectedRole },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (data.success) {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        localStorage.removeItem("temp_token");
        localStorage.removeItem("temp_user");

        router.push(`/${selectedRole}`);
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showRoleSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Choose Your Role
            </h2>
            <p className="text-gray-600 mt-2">
              How would you like to use our platform?
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelection("teacher")}
              disabled={loading}
              className="w-full p-6 border-2 hover:border-blue-500 border-gray-200 rounded-xl hover:bg-blue-50 transition-all duration-200 text-left group hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 text-xl">👨‍🏫</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Teacher
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create courses, manage students, and track progress
                  </p>
                </div>
              </div>
              {loading && (
                <div className="flex justify-end mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </button>

            <button
              onClick={() => handleRoleSelection("student")}
              disabled={loading}
              className="w-full p-6 border-2 hover:border-green-500 border-gray-200 rounded-xl hover:bg-green-50 transition-all duration-200 text-left group hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600 text-xl">👨‍🎓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Student
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Enroll in courses, learn, and track your progress
                  </p>
                </div>
              </div>
              {loading && (
                <div className="flex justify-end mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">
          Completing Login...
        </h2>
        <p className="text-gray-600 mt-2">Please wait while we sign you in</p>
      </div>
    </div>
  );
}
