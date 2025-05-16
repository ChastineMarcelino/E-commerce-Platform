import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// Define User Interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  verificationAttempts: number;
  name?: string;
  role?: string;
  address?: string;
  profileImageUrl?: string;
  isApproved?: boolean;
  status: "Pending" | "Active" | "Disabled";
  pendingNewPassword?: string;
  pendingNewPasswordHint?: string; // ✅ Add this
  passwordHistory?: {
    password: string;
    plainHint?: string;            // ✅ Add this
    changedAt: Date;
  }[];
  isOnline?: boolean;           // ✅ NEW
  lastLogin?: Date;  
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define User Schema
export const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, maxlength: 100 },
    password: { type: String, required: true, maxlength: 255 },

    // ✅ Full password history with plainHint
    passwordHistory: {
      type: [
        {
          password: { type: String },
          plainHint: { type: String },
          changedAt: { type: Date }
        }
      ],
      default: []
    },

    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    verificationAttempts: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    name: { type: String, maxlength: 100, default: null },
    address: { type: String, maxlength: 255, default: null },
    role: { type: String, default: null },
    status: {
      type: String,
      enum: ["Pending", "Active", "Disabled"],
      default: "Pending"
    },
    pendingNewPassword: { type: String, default: null },
    pendingNewPasswordHint: { type: String, default: null }, // ✅ Schema field added
    profileImageUrl: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },      // ✅ NEW
    lastLogin: { type: Date, default: null },   
  },
  { timestamps: true }
);

// 🔒 Hash Password Before Saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password.startsWith('$2b$')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 🔑 Password Comparison Method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export User Model
export const User = mongoose.model<IUser>("User", userSchema);
