import express from "express";
import {
  login,
  logout,
  register,
} from "../controllers/authentication.controller.js";
import {
  googleAuth,
  googleCallback,
  updateRole,
} from "../controllers/goggleAuth.controller.js";
import {
  getAllResults,
  getAllStudents,
  createResult,
  updateResult,
} from "../controllers/teacher.controller.js";
import {
  getStudentResult,
  getStudentProfile,
} from "../controllers/student.controller.js";
import verifyAuthority from "../middlewares/index.js";

const router = express.Router();

// Authentication Routes
router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/auth/logout", verifyAuthority(["teacher", "student"]), logout);

// Google OAuth Routes
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleCallback);
router.patch("/auth/update-role", verifyAuthority(["pending"]), updateRole);

// Teacher Routes
router.get("/results", verifyAuthority(["teacher"]), getAllResults);
router.get("/students", verifyAuthority(["teacher"]), getAllStudents);
router.post("/results", verifyAuthority(["teacher"]), createResult);
router.patch("/results/:id", verifyAuthority(["teacher"]), updateResult);

// Student Routes
router.get("/profile", verifyAuthority(["student"]), getStudentProfile);
router.get("/results/my", verifyAuthority(["student"]), getStudentResult);

export default router;
