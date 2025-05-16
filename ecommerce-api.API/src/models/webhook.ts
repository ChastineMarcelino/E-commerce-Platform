import mongoose, { Schema, Document } from "mongoose";

// Define possible webhook event types
const EVENT_TYPES = [
  "document.completed",
  "signature.requested",
  "document.declined",
  "document.viewed",
  "document.signed",
] as const;

export interface IWebhookEvent extends Document {
  event_type: typeof EVENT_TYPES[number]; // Use only the allowed event types
  document_url: string; // Changed from document_id to document_url
  signer_email: string;
  completed_at?: Date | null;
  reason?: string | null; // Only for declined events
  received_at: Date;
}

const WebhookEventSchema = new Schema<IWebhookEvent>(
  {
    event_type: { type: String, enum: EVENT_TYPES, required: true },
    document_url: { type: String, required: true }, // Accepts file/signed document URL
    signer_email: { type: String, required: true },
    completed_at: { type: Date, default: null },
    reason: { type: String, default: null }, // Only for declined events
    received_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const WebhookEvent = mongoose.model<IWebhookEvent>("WebhookEvent", WebhookEventSchema);
