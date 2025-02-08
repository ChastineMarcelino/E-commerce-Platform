import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Category
export interface ICategory extends Document {
  categoryId: string;     // Unique identifier for the category
  categoryName: string;   // The name of the category
  description?: string;   // Optional description of the category
}

// Schema for Category
const CategorySchema = new Schema<ICategory>(
  {
    categoryId: { type: String, required: true, unique: true },
    categoryName: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Model for Category
export const Category: Model<ICategory> = mongoose.model<ICategory>("Category", CategorySchema);
