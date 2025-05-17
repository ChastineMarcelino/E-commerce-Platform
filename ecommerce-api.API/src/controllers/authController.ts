import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { IUser, User } from "../models/user";
import { JWT_SECRET } from "../config/db";
import { validateUser } from "../validations/userValidation";
import { generateOTP, sendOTP } from "../services/otpservice";
import { sendEmailNotification } from "../services/emailService";
import stringSimilarity from "string-similarity"; // make sure this is installed

dotenv.config();

const ADMIN_EMAIL = process.env.BIGBREW_ADMIN_EMAIL || "bigbrewmilkteashop@gmail.com";

class AuthController {
  // Removed duplicate verifyForgotPasswordOTP method
  private tokenBlacklist = new Set<string>();

  // ✅ Check if token is blacklisted
  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  // ✅ Blacklist token for logout
  blacklistToken(token: string): void {
    this.tokenBlacklist.add(token);
  }

  // ✅ User Registration
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateUser(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }

      const email = payload.email.toLowerCase();
      const {  password, name, address } = payload;
      const isAdmin = email === ADMIN_EMAIL;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists. Please log in." });
        return;
      }

      // 🔐 Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 🔢 Generate OTP
      const otpCode = generateOTP();

      // 🆕 Create new user
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
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

    await sendOTP(email, otpCode);

    res.status(201).json({
      message: "User registered successfully. Please verify OTP.",
      email
    });

  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ message: "Error during registration", error });
  }
}
  // ✅ OTP Verification
  async verifyOTPHandler(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
  
      if (!user || user.otp !== otp || new Date() > new Date(user.otpExpires || "")) {
        res.status(400).json({ message: "Invalid or expired OTP." });
        return;
      }
  
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      // 📧 Notify admin
      await sendEmailNotification(ADMIN_EMAIL, "New User Needs Approval", `User ${email} needs approval.`);

      res.json({ message: "OTP verified. Await admin approval.", user_id: user._id });
    } catch (error) {
      console.error("❌ Error verifying OTP:", error);
      res.status(500).json({ message: "Error verifying OTP", error });
    }
  }

  // ✅ Resend OTP
  async resendOTPHandler(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      // 🔍 Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      if (user.isVerified) {
        res.status(400).json({ message: "User is already verified" });
        return;
      }

      // 🔢 Generate new OTP
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Set OTP expiry (10 minutes)

      await user.save();

      // 📧 Resend OTP via email
      const result = await sendOTP(email, otp);
      if (!result.success) {
        res.status(500).json({ message: "Error sending OTP" });
        return;
      }

      res.json({ message: "OTP resent successfully" });
    } catch (error) {
      console.error("❌ Error resending OTP:", error);
      res.status(500).json({ message: "Error resending OTP", error });
    }
  }
  // ✅ Fetch Pending Users (Admin Only)
async getPendingUsers(req: Request, res: Response): Promise<void> {
  try {
    const pendingUsers = await User.find({ status: "Pending", isVerified: true });
    res.json(pendingUsers);
  } catch (error) {
    console.error("❌ Error fetching pending users:", error);
    res.status(500).json({ message: "Error fetching users." });
  }
}


async approveUser(req: { params: { id: any; }; body: { name: any; role_id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; json: (arg0: { message: string; user: mongoose.Document<unknown, {}, IUser> & IUser & Required<{ _id: mongoose.Types.ObjectId; }> & { __v: number; }; }) => void; }) {
  try {
    const { id } = req.params;
    const { name, role_id } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ error: "User is already approved" });
    }

    user.name = name;
    user.role = role_id;
    user.isVerified = true;
    await user.save();

    res.json({ message: "User approved successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Reject User
async rejectUser(req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; json: (arg0: { message: string; }) => void; }) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User rejected and removed" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

  // ✅ Login
async login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // 🔍 Check if user exists
    if (!user) {
      console.warn(`❌ Login failed: No user found with email ${email}`);
      res.status(401).json({ message: "Invalid credentials or not approved." });
      return;
    }

    // 🔑 Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
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
    (req as any).userId = (user as any)._id.toString(); // Convert ObjectId to string


    // ✅ Generate Token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" } // Refresh token lasts 7 days
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
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Error during login", error });
  }
}
// ✅ Refresh Access Token
async refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ message: "Refresh token is required." });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    res.status(401).json({ message: "Invalid or expired refresh token." });
  }
}

// 🔐 Forgot Password – Send OTP + Save Temporary New Password

async forgotPassword(req: Request, res: Response): Promise<void> {
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

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // 🔐 Hash the new password but do NOT apply it yet
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔢 Generate and store OTP
    const otp = generateOTP();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    (user as any).pendingNewPassword = hashedPassword;
    user.pendingNewPasswordHint = newPassword.toLowerCase().slice(0, 8); // ✅ Store plain hint

    await user.save();

    await sendOTP(email, otp);

    res.json({ message: "OTP sent to email. Please verify to complete password reset." });
  } catch (error) {
    console.error("❌ forgotPassword error:", error);
    res.status(500).json({ message: "Failed to send OTP", error });
  }
}
async verifyOldPasswordBeforeReset(req: Request, res: Response): Promise<void> {
  try {
    const { email, oldPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const passwordHistory = user.passwordHistory || [];

    // ✅ Filter history to last 90 days
    const recentPasswords = passwordHistory.filter(p =>
      Date.now() - new Date(p.changedAt).getTime() < 90 * 24 * 60 * 60 * 1000
    );

    const plainHints = recentPasswords
      .map(p => p.plainHint?.toLowerCase())
      .filter(Boolean) as string[];

    const entered = oldPassword.toLowerCase();

    // ✅ Check if any plainHint is similar (80% match)
    const matched = plainHints.some(hint =>
      stringSimilarity.compareTwoStrings(hint, entered) > 0.8
    );

    if (!matched) {
      res.status(400).json({
        message: "Old password does not match any password used in the last 3 months."
      });
      return;
    }

    res.json({ message: "Old password valid. Proceed with OTP." });
  } catch (error) {
    console.error("❌ verifyOldPasswordBeforeReset error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

 // ✅ FINAL FIX – Verify OTP for Forgot Password and Apply Password
 async verifyForgotPasswordOTP(req: Request, res: Response): Promise<void> {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP." });
      return;
    }

    if (user.otpExpires && new Date() > new Date(user.otpExpires)) {
      res.status(400).json({ message: "OTP has expired." });
      return;
    }

    const newPassword = (user as any).pendingNewPassword;
    if (!newPassword) {
      res.status(400).json({ message: "No password reset request found." });
      return;
    }
user.passwordHistory = [
  ...(user.passwordHistory || []).filter(p =>
    Date.now() - new Date(p.changedAt).getTime() < 90 * 24 * 60 * 60 * 1000
  ),
  {
    password: user.password,
    plainHint: (user as any).pendingNewPasswordHint || '', // ✅ <— place this here
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
const accessToken = jwt.sign(
  { userId: user._id, role: user.role },
  JWT_SECRET,
  { expiresIn: "7d" }
);

res.json({
  message: "✅ Password reset successful.",
  accessToken
});

  } catch (error) {
    console.error("❌ verifyForgotPasswordOTP error:", error);
    res.status(500).json({ message: "Error verifying OTP", error });
  }
}

  // ✅ Logout
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log("✅ Logging out user ID:", decoded.userId);

      // ✅ Mark user as offline
      const user = await User.findById(decoded.userId);
if (user) {
  user.isOnline = false;
  await user.save();
  console.log("✅ isOnline set to false for:", user.email);
}
      this.blacklistToken(token);
      res.json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Error during logout", error });
    }
  }
}

export default new AuthController();
