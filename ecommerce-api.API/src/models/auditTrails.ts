import mongoose, { Schema, Document } from "mongoose";

// Define possible event types (removed "read")
const EVENT_TYPES = [
  "create", "update", "delete", "read_by_id",
  "create_webhook",
  "login", "logout", "register", "verify_otp", "resend_otp", "approve"
] as const;

export interface IAuditTrail extends Document {
  UserId: mongoose.Types.ObjectId | null;
  EventType: typeof EVENT_TYPES[number]; // Allowed event types
  DataChanges?: any; // Consolidated field for changes
  Description?: string; // Additional details
}

const AuditTrailSchema = new mongoose.Schema(
  {
    UserId: { type: String, required: false }, // ✅ Store as a plain string
    EventType: { type: String, enum: EVENT_TYPES, required: true },
    DataChanges: { type: mongoose.Schema.Types.Mixed, default: null },
    Description: { type: String, default: null },
  },
  { timestamps: true }
);
export const AuditTrail = mongoose.model<IAuditTrail>("AuditTrail", AuditTrailSchema);
