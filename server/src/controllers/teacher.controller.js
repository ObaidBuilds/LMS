import User from "../models/user.model.js";
import Result from "../models/result.model.js";
import { catchErrors } from "../utils/index.js";

const getAllStudents = catchErrors(async (req, res) => {
  const students = await User.find({ role: "student" }).select("-password");

  return res.status(200).json({
    success: true,
    message: "Students fetched successfully",
    students,
  });
});

const getAllResults = catchErrors(async (req, res) => {
  const results = await Result.find()
    .populate("student", "name email")
    .populate("teacher", "name email");

  return res.status(200).json({
    success: true,
    message: "Results fetched successfully",
    results,
  });
});

const createResult = catchErrors(async (req, res) => {
  const teacher = req.user._id;
  const { student, subject, marks } = req.body;

  const result = await Result.create({
    student,
    subject,
    marks,
    teacher,
  })
    .populate("student", "name email")
    .populate("teacher", "name email");

  return res.status(200).json({
    success: true,
    message: "Result created successfully",
    result,
  });
});

const updateResult = catchErrors(async (req, res) => {
  const { id } = req.params;
  const teacher = req.user._id;
  const { subject, marks } = req.body;

  const updatedResult = await Result.findByIdAndUpdate(
    id,
    { subject, marks, teacher },
    { new: true }
  )
    .populate("student", "name email")
    .populate("teacher", "name email");

  return res.status(200).json({
    success: true,
    message: "Result updated successfully",
    updatedResult,
  });
});

export { getAllResults, getAllStudents, updateResult, createResult };
