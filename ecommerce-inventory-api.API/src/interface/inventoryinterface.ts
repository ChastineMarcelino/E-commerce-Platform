import { Document } from "mongoose";

/**
 * Interface for an Inventory Item Document.
 */
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
