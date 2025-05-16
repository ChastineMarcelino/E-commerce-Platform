import mongoose, { Schema, Document } from "mongoose";

export interface IPendingUser extends Document {
  email: string;
  hashedPassword: string;
  name: string;
  address: string;
  otp: string;
  otpExpires: Date;
}

const pendingUserSchema = new Schema<IPendingUser>(
  {
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },
  },
  { timestamps: true }
);

export const PendingUser = mongoose.model<IPendingUser>("PendingUser", pendingUserSchema);
