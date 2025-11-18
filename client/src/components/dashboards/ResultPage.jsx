"use client";

import { useStore } from "@/context";
import React, { useEffect, useState } from "react";
import StatCard from "../cards/StatCard";
import ResultForm from "../forms/ResultForm";

const ResultPage = () => {
  const {
    getResults,
    results = [],
    createResult,
    updateResult,
    students = [],
    getAllStudents,
  } = useStore();

  const [selectedSubject, setSelectedSubject] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    marks: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getResults();
    getAllStudents();
  }, []);

  const totalResults = results?.length || 0;

  const averageMarks =
    totalResults > 0
      ? Math.round(
          results.reduce((sum, result) => {
            const marks = result?.marks || 0;
            return sum + (isNaN(marks) ? 0 : marks);
          }, 0) / totalResults
        )
      : 0;

  const highestMark =
    totalResults > 0
      ? Math.max(
          ...results.map((result) => {
            const marks = result?.marks || 0;
            return isNaN(marks) ? 0 : marks;
          })
        )
      : 0;

  const subjects = [
    "All",
    ...new Set(results?.map((result) => result?.subject).filter(Boolean) || []),
  ];

  const filteredResults =
    selectedSubject === "All"
      ? results
      : results.filter((result) => result?.subject === selectedSubject);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getGrade = (marks) => {
    const numericMarks = Number(marks);
    if (isNaN(numericMarks))
      return { grade: "N/A", color: "text-gray-600", bg: "bg-gray-50" };
    if (numericMarks >= 90)
      return { grade: "A+", color: "text-green-600", bg: "bg-green-50" };
    if (numericMarks >= 80)
      return { grade: "A", color: "text-green-600", bg: "bg-green-50" };
    if (numericMarks >= 70)
      return { grade: "B", color: "text-blue-600", bg: "bg-blue-50" };
    if (numericMarks >= 60)
      return { grade: "C", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (numericMarks >= 50)
      return { grade: "D", color: "text-orange-600", bg: "bg-orange-50" };
    return { grade: "F", color: "text-red-600", bg: "bg-red-50" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedResult) {
        await updateResult(selectedResult._id, formData);
      } else {
        await createResult(formData);
      }

      closeModal();
      getResults();
    } catch (error) {
      console.error("Error saving result:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedResult(null);
    setFormData({ student: "", subject: "", marks: "" });
    setShowModal(true);
  };

  const openUpdateModal = (result) => {
    setSelectedResult(result);
    setFormData({
      student: result?.student?._id || "",
      subject: result?.subject || "",
      marks: result?.marks?.toString() || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResult(null);
    setFormData({ student: "", subject: "", marks: "" });
  };

  const isEditMode = Boolean(selectedResult);

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
      label: "Total Results",
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
      value: `${averageMarks}%`,
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
      value: `${highestMark}%`,
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-6">
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

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <div className="flex gap-4 items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Student Results
                  </h2>
                  <button
                    className="text-xs font-semibold text-green-400"
                    onClick={openCreateModal}
                  >
                    Add New Result
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Manage all student results and performance
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
            {results.length === 0 ? (
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
                    Create your first result to get started
                  </p>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Subject
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredResults.map((result, i) => {
                    const gradeInfo = getGrade(result?.marks);
                    return (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="shrink-0 h-10 w-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {result?.student?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "?"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {result?.student?.name || "Unknown"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {result?.student?.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {result?.subject || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {result?.marks || 0}%
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
                          {formatDate(result?.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openUpdateModal(result)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 mr-2"
                          >
                            Edit
                          </button>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
          <ResultForm
            loading={loading}
            students={students}
            formData={formData}
            closeModal={closeModal}
            isEditMode={isEditMode}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            selectedResult={setSelectedResult}
            setSelectedResult={setSelectedResult}
          />
        </div>
      )}
    </div>
  );
};

export default ResultPage;
