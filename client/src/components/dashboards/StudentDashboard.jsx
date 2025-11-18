"use client";

import { useStore } from "@/context";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import StatCard from "../cards/StatCard";

const StudentDashboard = () => {
  const { getStudentsResult, studentResult } = useStore();
  const [selectedSubject, setSelectedSubject] = useState("All");

  useEffect(() => {
    getStudentsResult();
  }, []);

  const subjects = [
    "All",
    ...new Set(studentResult.map((result) => result.subject)),
  ];

  const filteredResults =
    selectedSubject === "All"
      ? studentResult
      : studentResult.filter((result) => result.subject === selectedSubject);

  const totalResults = studentResult.length;
  const averageMarks =
    totalResults > 0
      ? Math.round(
          studentResult.reduce((sum, result) => sum + result.marks, 0) /
            totalResults
        )
      : 0;
  const highestMark =
    totalResults > 0
      ? Math.max(...studentResult.map((result) => result.marks))
      : 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGrade = (marks) => {
    if (marks >= 90)
      return { grade: "A+", color: "text-green-600", bg: "bg-green-50" };
    if (marks >= 80)
      return { grade: "A", color: "text-green-600", bg: "bg-green-50" };
    if (marks >= 70)
      return { grade: "B", color: "text-blue-600", bg: "bg-blue-50" };
    if (marks >= 60)
      return { grade: "C", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (marks >= 50)
      return { grade: "D", color: "text-orange-600", bg: "bg-orange-50" };
    return { grade: "F", color: "text-red-600", bg: "bg-red-50" };
  };

  const stats = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      label: "Total Subjects",
      value: totalResults,
      color: "bg-blue-100",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      label: "Average Marks",
      value: averageMarks,
      color: "bg-green-100",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      label: "Highest Score",
      value: highestMark,
      color: "bg-purple-100",
    },
  ];

  return (
    <ProtectedRoute allowedRole="student">
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                color={stat.color}
              />
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Academic Results
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Your performance across all subjects
                  </p>
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {studentResult.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg
                      className="w-16 h-16 mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No results available</p>
                    <p className="text-sm">
                      Your results will appear here once they are published
                    </p>
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Marks
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredResults.map((result) => {
                      const gradeInfo = getGrade(result.marks);
                      return (
                        <tr
                          key={result._id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="shrink-0 h-10 w-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                {result.subject.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {result.subject}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {result.teacher.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {result.teacher.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {result.marks}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Out of 100
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gradeInfo.bg} ${gradeInfo.color}`}
                            >
                              {gradeInfo.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(result.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentDashboard;
