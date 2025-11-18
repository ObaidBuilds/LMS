import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { catchErrors } from "../utils/index.js";

const verifyAuthority = (roles = []) =>
  catchErrors(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) throw new Error("Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new Error("Unauthorized");

    if (roles.length && !roles.includes(user.role))
      throw new Error("Forbidden");

    req.user = user;
    next();
  });

export default verifyAuthority;