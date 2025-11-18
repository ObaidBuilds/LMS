"use client";

import { useStore } from "@/context";
import { useEffect, useState } from "react";
import Image from "next/image";

const Navbar = ({ role }) => {
  const { logOut } = useStore();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logOut();
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setLoggedInUser(JSON.parse(user));
  }, []);

  // Get user initials for fallback avatar
  const getUserInitials = () => {
    if (!loggedInUser?.name) return "?";
    return loggedInUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Check if avatar is a valid URL
  const isValidAvatar = (avatar) => {
    if (!avatar) return false;
    try {
      new URL(avatar);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="shrink-0">
              <h1 className="text-xl font-bold text-gray-800">
                {role === "teacher" ? "👨‍🏫" : "👨‍🎓"}{" "}
                {role?.charAt(0).toUpperCase() + role?.slice(1)} Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-700">
                {loggedInUser?.name}
              </span>
              <span className="text-xs text-gray-500">
                {loggedInUser?.email}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="shrink-0 h-8 w-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                  {isValidAvatar(loggedInUser?.avatar) ? (
                    <Image
                      src={loggedInUser.avatar}
                      alt={loggedInUser?.name || "User"}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      isValidAvatar(loggedInUser?.avatar) ? "hidden" : "flex"
                    }`}
                  >
                    {getUserInitials()}
                  </div>
                </div>

                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
