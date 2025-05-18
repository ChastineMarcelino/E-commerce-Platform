"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../models/user");
const db_1 = require("../config/db");
const userValidation_1 = require("../validations/userValidation");
const otpservice_1 = require("../services/otpservice");
const emailService_1 = require("../services/emailService");
const string_similarity_1 = __importDefault(require("string-similarity")); // make sure this is installed
dotenv_1.default.config();
const ADMIN_EMAIL = process.env.BIGBREW_ADMIN_EMAIL || "bigbrewmilkteashop@gmail.com";
class AuthController {
    constructor() {
        // Removed duplicate verifyForgotPasswordOTP method
        this.tokenBlacklist = new Set();
    }
    // ✅ Check if token is blacklisted
    isTokenBlacklisted(token) {
        return this.tokenBlacklist.has(token);
    }
    // ✅ Blacklist token for logout
    blacklistToken(token) {
        this.tokenBlacklist.add(token);
    }
    // ✅ User Registration
    async register(req, res) {
        try {
            const { error, value: payload } = (0, userValidation_1.validateUser)(req.body);
            if (error) {
                res.status(400).json({ message: error.details.map((err) => err.message) });
                return;
            }
            const email = payload.email.toLowerCase();
            const { password, name, address } = payload;
            const isAdmin = email === ADMIN_EMAIL;
            const existingUser = await user_1.User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: "User already exists. Please log in." });
                return;
            }
            // 🔐 Hash Password
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            // 🔢 Generate OTP
            const otpCode = (0, otpservice_1.generateOTP)();
            // 🆕 Create new user
            const newUser = new user_1.User({
                _id: new mongoose_1.default.Types.ObjectId(),
                name,
                address,
                email,
                passwordHistory: [
                    {
                        password: hashedPassword,
                        plainHint: password.toLowerCase().slice(0, 8), // ✅ only first 8 characters as hint
                        changedAt: new Date()
                    }
                ],
                password,
                role: isAdmin ? "ADMIN" : "STAFF",
                isVerified: false,
                isApproved: false,
                otp: otpCode, // ✅ Save OTP in database
                otpExpires: Date.now() + 5 * 60 * 1000, // ✅ Expire in 5 minutes
                status: "Pending",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await newUser.save();
            await (0, otpservice_1.sendOTP)(email, otpCode);
            res.status(201).json({
                message: "User registered successfully. Please verify OTP.",
                email
            });
        }
        catch (error) {
            console.error("❌ Error during registration:", error);
            res.status(500).json({ message: "Error during registration", error });
        }
    }
    // ✅ OTP Verification
    async verifyOTPHandler(req, res) {
        try {
            const { email, otp } = req.body;
            const user = await user_1.User.findOne({ email });
            if (!user || user.otp !== otp || new Date() > new Date(user.otpExpires || "")) {
                res.status(400).json({ message: "Invalid or expired OTP." });
                return;
            }
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            // 📧 Notify admin
            await (0, emailService_1.sendEmailNotification)(ADMIN_EMAIL, "New User Needs Approval", `User ${email} needs approval.`);
            res.json({ message: "OTP verified. Await admin approval.", user_id: user._id });
        }
        catch (error) {
            console.error("❌ Error verifying OTP:", error);
            res.status(500).json({ message: "Error verifying OTP", error });
        }
    }
    // ✅ Resend OTP
    async resendOTPHandler(req, res) {
        try {
            const { email } = req.body;
            // 🔍 Find user by email
            const user = await user_1.User.findOne({ email });
            if (!user) {
                res.status(400).json({ message: "User not found" });
                return;
            }
            if (user.isVerified) {
                res.status(400).json({ message: "User is already verified" });
                return;
            }
            // 🔢 Generate new OTP
            const otp = (0, otpservice_1.generateOTP)();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Set OTP expiry (10 minutes)
            await user.save();
            // 📧 Resend OTP via email
            const result = await (0, otpservice_1.sendOTP)(email, otp);
            if (!result.success) {
                res.status(500).json({ message: "Error sending OTP" });
                return;
            }
            res.json({ message: "OTP resent successfully" });
        }
        catch (error) {
            console.error("❌ Error resending OTP:", error);
            res.status(500).json({ message: "Error resending OTP", error });
        }
    }
    // ✅ Fetch Pending Users (Admin Only)
    async getPendingUsers(req, res) {
        try {
            const pendingUsers = await user_1.User.find({ status: "Pending", isVerified: true });
            res.json(pendingUsers);
        }
        catch (error) {
            console.error("❌ Error fetching pending users:", error);
            res.status(500).json({ message: "Error fetching users." });
        }
    }
    async approveUser(req, res) {
        try {
            const { id } = req.params;
            const { name, role_id } = req.body;
            const user = await user_1.User.findById(id);
            if (!user)
                return res.status(404).json({ error: "User not found" });
            if (user.isVerified) {
                return res.status(400).json({ error: "User is already approved" });
            }
            user.name = name;
            user.role = role_id;
            user.isVerified = true;
            await user.save();
            res.json({ message: "User approved successfully", user });
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    // Reject User
    async rejectUser(req, res) {
        try {
            const { id } = req.params;
            const user = await user_1.User.findByIdAndDelete(id);
            if (!user)
                return res.status(404).json({ error: "User not found" });
            res.json({ message: "User rejected and removed" });
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    // ✅ Login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await user_1.User.findOne({ email });
            // 🔍 Check if user exists
            if (!user) {
                console.warn(`❌ Login failed: No user found with email ${email}`);
                res.status(401).json({ message: "Invalid credentials or not approved." });
                return;
            }
            // 🔑 Check if password is correct
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                console.warn(`❌ Login failed: Incorrect password for ${email}`);
                res.status(401).json({ message: "Invalid credentials." });
                return;
            }
            // 🚀 Check if user is approved
            if (user.status !== "Active") {
                console.warn(`❌ Login failed: User ${email} is not approved (status: ${user.status})`);
                res.status(401).json({ message: "User is not approved. Please contact admin." });
                return;
            }
            // ✅ Set online status and last login
            user.isOnline = true;
            user.lastLogin = new Date();
            await user.save();
            // ✅ Attach userId to the request (so auditMiddleware can use it)
            req.userId = user._id.toString(); // Convert ObjectId to string
            // ✅ Generate Token
            const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, db_1.JWT_SECRET, { expiresIn: "7d" });
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, db_1.JWT_SECRET, { expiresIn: "7d" } // Refresh token lasts 7 days
            );
            console.log(`✅ Login successful for ${email}`);
            res.json({
                message: "Login successful",
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    address: user.address
                }
            });
        }
        catch (error) {
            console.error("❌ Error during login:", error);
            res.status(500).json({ message: "Error during login", error });
        }
    }
    // ✅ Refresh Access Token
    async refreshToken(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                res.status(400).json({ message: "Refresh token is required." });
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(token, db_1.JWT_SECRET);
            const newAccessToken = jsonwebtoken_1.default.sign({ userId: decoded.userId, role: decoded.role }, db_1.JWT_SECRET, { expiresIn: "7d" });
            res.json({ accessToken: newAccessToken });
        }
        catch (error) {
            console.error("❌ Error refreshing token:", error);
            res.status(401).json({ message: "Invalid or expired refresh token." });
        }
    }
    // 🔐 Forgot Password – Send OTP + Save Temporary New Password
    async forgotPassword(req, res) {
        try {
            const { email, newPassword, confirmPassword } = req.body;
            if (!email || !newPassword || !confirmPassword) {
                res.status(400).json({ message: "All fields are required." });
                return;
            }
            if (newPassword !== confirmPassword) {
                res.status(400).json({ message: "Passwords do not match." });
                return;
            }
            const user = await user_1.User.findOne({ email });
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            // 🔐 Hash the new password but do NOT apply it yet
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            // 🔢 Generate and store OTP
            const otp = (0, otpservice_1.generateOTP)();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
            user.pendingNewPassword = hashedPassword;
            user.pendingNewPasswordHint = newPassword.toLowerCase().slice(0, 8); // ✅ Store plain hint
            await user.save();
            await (0, otpservice_1.sendOTP)(email, otp);
            res.json({ message: "OTP sent to email. Please verify to complete password reset." });
        }
        catch (error) {
            console.error("❌ forgotPassword error:", error);
            res.status(500).json({ message: "Failed to send OTP", error });
        }
    }
    async verifyOldPasswordBeforeReset(req, res) {
        try {
            const { email, oldPassword } = req.body;
            const user = await user_1.User.findOne({ email });
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            const passwordHistory = user.passwordHistory || [];
            // ✅ Filter history to last 90 days
            const recentPasswords = passwordHistory.filter(p => Date.now() - new Date(p.changedAt).getTime() < 90 * 24 * 60 * 60 * 1000);
            const plainHints = recentPasswords
                .map(p => p.plainHint?.toLowerCase())
                .filter(Boolean);
            const entered = oldPassword.toLowerCase();
            // ✅ Check if any plainHint is similar (80% match)
            const matched = plainHints.some(hint => string_similarity_1.default.compareTwoStrings(hint, entered) > 0.8);
            if (!matched) {
                res.status(400).json({
                    message: "Old password does not match any password used in the last 3 months."
                });
                return;
            }
            res.json({ message: "Old password valid. Proceed with OTP." });
        }
        catch (error) {
            console.error("❌ verifyOldPasswordBeforeReset error:", error);
            res.status(500).json({ message: "Internal Server Error", error });
        }
    }
    // ✅ FINAL FIX – Verify OTP for Forgot Password and Apply Password
    async verifyForgotPasswordOTP(req, res) {
        try {
            const { email, otp } = req.body;
            const user = await user_1.User.findOne({ email });
            if (!user || user.otp !== otp) {
                res.status(400).json({ message: "Invalid OTP." });
                return;
            }
            if (user.otpExpires && new Date() > new Date(user.otpExpires)) {
                res.status(400).json({ message: "OTP has expired." });
                return;
            }
            const newPassword = user.pendingNewPassword;
            if (!newPassword) {
                res.status(400).json({ message: "No password reset request found." });
                return;
            }
            user.passwordHistory = [
                ...(user.passwordHistory || []).filter(p => Date.now() - new Date(p.changedAt).getTime() < 90 * 24 * 60 * 60 * 1000),
                {
                    password: user.password,
                    plainHint: user.pendingNewPasswordHint || '', // ✅ <— place this here
                    changedAt: new Date()
                }
            ];
            // Replace password
            user.password = newPassword;
            user.otp = undefined;
            user.otpExpires = undefined;
            user.pendingNewPassword = undefined;
            user.pendingNewPasswordHint = undefined;
            await user.save();
            // Return token for auto-login
            const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, db_1.JWT_SECRET, { expiresIn: "7d" });
            res.json({
                message: "✅ Password reset successful.",
                accessToken
            });
        }
        catch (error) {
            console.error("❌ verifyForgotPasswordOTP error:", error);
            res.status(500).json({ message: "Error verifying OTP", error });
        }
    }
    // ✅ Logout
    async logout(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(token, db_1.JWT_SECRET);
            console.log("✅ Logging out user ID:", decoded.userId);
            // ✅ Mark user as offline
            const user = await user_1.User.findById(decoded.userId);
            if (user) {
                user.isOnline = false;
                await user.save();
                console.log("✅ isOnline set to false for:", user.email);
            }
            this.blacklistToken(token);
            res.json({ message: "Logout successful" });
        }
        catch (error) {
            res.status(500).json({ message: "Error during logout", error });
        }
    }
}
exports.default = new AuthController();
