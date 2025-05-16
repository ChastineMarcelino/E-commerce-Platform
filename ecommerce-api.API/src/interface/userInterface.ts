import { Document } from "mongoose";

export interface IUser extends Document {
  role: any;
  address: any;
  email: string;
  password: string;
  name?: string; // Full name (assigned after approval)
  role_id?: string; // Role (Admin, Cashier, etc.)
  status: "Pending" | "Active" | "Disabled"; // Approval status
  isVerified: boolean;
  isApproved?: boolean; // Email verification status
  otp?: string; // OTP for verification
  otpExpires?: Date; // OTP expiration time
  verificationAttempts: number; // Track OTP retries
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>; // Function to check passwords
}
