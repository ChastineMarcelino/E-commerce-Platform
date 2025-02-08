import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for Inventory Item
export interface IInventoryItem extends Document {
  name: string;           // The name of the inventory item
  description: string;    // A brief description of the item
  quantity: number;       // The quantity of the item in stock
  price: number;          // The price per unit of the item
  category: string;       // Category the item belongs to
  supplier?: string;      // Optional supplier information
  createdAt?: Date;       // Timestamp when the item was created
  updatedAt?: Date;       // Timestamp when the item was last updated
}

// Schema for Inventory Item
const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    supplier: { type: String },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Model for Inventory Item
export const InventoryItem: Model<IInventoryItem> = mongoose.model<IInventoryItem>(
  'InventoryItem',
  InventoryItemSchema
);
