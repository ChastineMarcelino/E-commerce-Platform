import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/userInterface";

// Define the schema for the User model
// Schema specifies the structure and validation rules for User documents in MongoDB
export const userSchema = new Schema(
  {
    // User email field - must be unique, required, and max 100 characters
    email: { type: String, length: 100, required: true, unique: true },
    // Password field - required and max 50 characters
    password: { type: String, length: 50, required: true },
  },
  // Enable automatic timestamp fields (createdAt and updatedAt)
  { timestamps: true }
);

// Create and export the User model
export const User = mongoose.model<IUser>("Users", userSchema);