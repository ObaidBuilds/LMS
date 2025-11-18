import passport from "passport";
import User from "../models/user.model.js";
import { catchErrors, generateToken } from "../utils/index.js";

const googleAuth = catchErrors(async (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
});

const googleCallback = catchErrors(async (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) {
      return res.redirect(`${process.env.CLIENT_URL}/login`);
    }

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login`
      );
    }

    try {
      const token = generateToken(user);

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      };

      res.redirect(
        `${
          process.env.CLIENT_URL
        }/auth/success?token=${token}&user=${encodeURIComponent(
          JSON.stringify(userData)
        )}`
      );
    } catch (error) {
      console.error("Token generation error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=token_error`);
    }
  })(req, res, next);
});

const updateRole = catchErrors(async (req, res) => {
  const { role } = req.body;

  if (!role || !["teacher", "student"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { role },
    { new: true }
  );

  res.json({
    success: true,
    message: "Role updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

export { googleAuth, googleCallback, updateRole };
