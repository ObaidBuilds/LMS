import Result from "../models/result.model.js";
import User from "../models/user.model.js";
import { catchErrors } from "../utils/index.js";

const getStudentProfile = catchErrors(async (req, res) => {
  const user = req.user.id;

  const profile = await User.findById(user).select("-password");

  return res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    profile,
  });
});

const getStudentResult = catchErrors(async (req, res) => {
  const student = req.user.id;
  const results = await Result.find({ student })
    .populate("teacher", "name email")
    .populate("student", "name email");

  return res.status(200).json({
    success: true,
    message: "Result fetched successfully",
    results,
  });
});

export { getStudentProfile, getStudentResult };
