import { Document } from "mongoose";

/**
 * Interface for a Category Document.
 */
export interface ICategory extends Document {
  categoryId: string;      // Unique identifier for the category
  categoryName: string;    // The name of the category
  description?: string;    // Optional description of the category
}
