import jwt from "jsonwebtoken";

const catchErrors = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err.message);
    });
  };
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export { catchErrors, generateToken };
