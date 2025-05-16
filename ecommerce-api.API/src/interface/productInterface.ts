import { Document, ObjectId } from "mongoose";

/**
 * Interface for a Product Document.
 */
export interface IProduct extends Document {
  name: string;              // Name of the product
  description: string;       // Detailed description of the product
  categoryId:ObjectId;        // Category the product belongs to
  price: number;             // Price of the product
  stockQuantity: number;     // Quantity of the product available in stock
  supplierId: string;        // Reference to the supplier providing the product
  createdAt?: Date;          // Timestamp when the product was created
  updatedAt?: Date;          // Timestamp when the product was last updated
}
