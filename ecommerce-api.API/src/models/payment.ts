import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Payment
export interface IPayment extends Document {
  paymentId: string;       // Unique identifier for the payment
  orderId: string;         // Foreign Key, links to Order
  paymentDate: Date;       // Date of the payment
  paymentMethod: string;   // Method of payment (e.g., GCash, Credit Card, etc.)
  paymentAmount: number;   // Amount paid
}

// Schema for Payment
const PaymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true, maxlength: 100 },
    paymentAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Model for Payment
export const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", PaymentSchema);
