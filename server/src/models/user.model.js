import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    googleId: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["teacher", "student", "pending"],
      required: true,
    },
    avatar: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
