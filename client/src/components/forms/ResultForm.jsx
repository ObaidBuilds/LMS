import React from "react";

const ResultForm = ({
  loading,
  students,
  formData,
  isEditMode,
  setFormData,
  handleSubmit,
  selectedResult,
  closeModal
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          {isEditMode ? "Update Result" : "Add New Result"}
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {isEditMode
            ? `Update result details for ${
                selectedResult?.student?.name || "student"
              }`
            : "Enter student result details"}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student
          </label>
          <select
            required
            value={formData.student}
            onChange={(e) =>
              setFormData({ ...formData, student: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} - {student.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter subject name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marks (%)
          </label>
          <input
            type="number"
            required
            min="0"
            max="100"
            value={formData.marks}
            onChange={(e) =>
              setFormData({ ...formData, marks: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter marks (0-100)"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={closeModal}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Result"
            ) : (
              "Create Result"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResultForm;
