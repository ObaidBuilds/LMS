import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { catchErrors, generateToken } from "../utils/index.js";

const register = catchErrors(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role)
    throw new Error("All fields are required");

  const isUserExist = await User.findOne({ email });
  if (isUserExist) throw new Error("Email already exist");

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return res.status(200).json({
    success: true,
    message: "Registration successfuly 🔑",
  });
});

const login = catchErrors(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) throw new Error("All fields are required");

  const user = await User.findOne({ email, role });
  if (!user) throw new Error("Invalid credentials");

  if (!user.password) {
    throw new Error("Please use Google to login with this account");
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) throw new Error("Invalid credentials");

  const token = generateToken(user);

  return res.status(200).json({
    success: true,
    message: "Logged in successfuly 🔑",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    },
  });
});

const logout = catchErrors(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export { register, login, logout };