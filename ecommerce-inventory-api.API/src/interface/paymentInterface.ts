import { Document } from "mongoose";

export interface IPayment extends Document {
  paymentId: string;      // Unique identifier for the payment
  orderId: string;        // Reference ID linking to the related order
  paymentDate: Date;      // Date when the payment was made
  paymentMethod: string;  // Method of payment (e.g., credit card, cash)
  paymentAmount: number;  // Amount paid
}