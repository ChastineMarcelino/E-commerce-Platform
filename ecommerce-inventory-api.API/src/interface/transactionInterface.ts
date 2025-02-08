import { Document } from "mongoose";

// Interface for a Transaction document
export interface ITransaction extends Document {
  transactionID: string;     // Primary key, unique identifier for the transaction
  productID: string;         // Foreign key, reference to the related product
  inventoryID: string;       // Foreign key, reference to the related inventory item
  orderID: string;           // Identifier for the related order
  transactionType: string;   // Type of transaction (e.g., "Sale", "Purchase", "Return")
  transactionDate: Date;     // Date when the transaction took place
  quantity: number;          // Quantity involved in the transaction
  payment: number;           // Payment amount related to the transaction
}
