import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/user";
import { IUser } from "../interface/userInterface";
import AuthController from "../controllers/authController"; // ✅ Import for token blacklist check

dotenv.config(); // ✅ Load environment variables

// ✅ Extend Express Request to include `userId` and `role`
export interface AuthRequest extends Request {
  userId?: string;
  user?: IUser;
  role?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 🔒 Check if token is blacklisted (Prevent reuse after logout)
    if (AuthController.isTokenBlacklisted(token)) {
      return res.status(403).json({ message: "Session expired. Please log in again." });
    }

    // 🔑 Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    } catch (error: any) {
      return res.status(401).json({ message: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token" });
    }

    // 🔍 Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error(`❌ User not found for ID: ${decoded.userId}`);
      return res.status(401).json({ message: "User not found or unauthorized" });
    }

    // ✅ Convert `_id` to a string safely
    req.userId = user._id instanceof mongoose.Types.ObjectId ? user._id.toHexString() : String(user._id);
    req.user = user.toObject() as IUser;
    req.role = user.role;

    console.log(`🔍 [DEBUG] authMiddleware - User ID: ${req.userId}, Role: ${req.role}`);

    next();
  } catch (error) {
    console.error("❌ Error in authMiddleware:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
