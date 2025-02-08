import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  transactionID: string;
  productID: string;
  inventoryID: string;
  orderID: string;
  transactionType: "purchase" | "sale";
  transactionDate: Date;
  quantity: number;
  payment: number;
}

const TransactionSchema = new Schema<ITransaction>({
  transactionID: { type: String, required: true },
  productID: { type: String, required: true },
  inventoryID: { type: String, required: true },
  orderID: { type: String, ref: "Order", required: true },
  transactionType: { type: String, enum: ["purchase", "sale"], required: true },
  transactionDate: { type: Date, default: Date.now },
  quantity: { type: Number, required: true, min: 1 },
  payment: { type: Number, required: true },
});

export const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
