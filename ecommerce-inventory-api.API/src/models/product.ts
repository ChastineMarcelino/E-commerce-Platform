import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Product
export interface IProduct extends Document {
  name: string;              // Name of the product
  description: string;       // Detailed description of the product
  price: number;             // Price of the product
  stockQuantity: number;     // Quantity available in stock
  categoryId: string;        // Category the product belongs to
  supplierId: string;        // Reference to the supplier providing the product
  createdAt?: Date;          // Timestamp when the product was created
  updatedAt?: Date;          // Timestamp when the product was last updated
}

// Schema for Product
const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    categoryId: { type: String, required: true },
    supplierId: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Model for Product
export const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);
