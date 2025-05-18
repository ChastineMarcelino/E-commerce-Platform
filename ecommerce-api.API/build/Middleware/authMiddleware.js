"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../models/user");
const authController_1 = __importDefault(require("../controllers/authController")); // ✅ Import for token blacklist check
dotenv_1.default.config(); // ✅ Load environment variables
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }
        // 🔒 Check if token is blacklisted (Prevent reuse after logout)
        if (authController_1.default.isTokenBlacklisted(token)) {
            return res.status(403).json({ message: "Session expired. Please log in again." });
        }
        // 🔑 Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            return res.status(401).json({ message: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token" });
        }
        // 🔍 Find user by ID
        const user = await user_1.User.findById(decoded.userId);
        if (!user) {
            console.error(`❌ User not found for ID: ${decoded.userId}`);
            return res.status(401).json({ message: "User not found or unauthorized" });
        }
        // ✅ Convert `_id` to a string safely
        req.userId = user._id instanceof mongoose_1.default.Types.ObjectId ? user._id.toHexString() : String(user._id);
        req.user = user.toObject();
        req.role = user.role;
        console.log(`🔍 [DEBUG] authMiddleware - User ID: ${req.userId}, Role: ${req.role}`);
        next();
    }
    catch (error) {
        console.error("❌ Error in authMiddleware:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
