import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for individual material or ingredient used
export interface MaterialUsage {
  name?: any; // Optional for now, but can be extended later
  inventoryItemName: string;  // Must match an item in the Inventory collection
  quantity: number;           // Amount used per order
  unit: string;               // Unit (e.g., Liter, Scoop, Piece)
}

// Extended Product Interface
export interface IProduct extends Document {
  price: number;
  name: string;
  description: string;
  medioPrice: number;
  grandePrice: number;
  inStock: number;
  category: string;
  imageUrl?: string;
  addOns?: string[];
  materialsUsed?: MaterialUsage[];   // ✅ General materials
  ingredientsUsed?: MaterialUsage[]; // ✅ Specific ingredients
  createdAt?: Date;
  updatedAt?: Date;
}

// Product Schema
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (name: string) {
          const existingProduct = await mongoose.models.Product.findOne({ name });
          return !existingProduct;
        },
        message: "Product name must be unique",
      },
    },
    description: { type: String, required: true },
    medioPrice: { type: Number, required: true, min: 0 },
    grandePrice: { type: Number, required: true, min: 0 },
    inStock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    imageUrl: { type: String },
    addOns: [{ type: String }],

    // ✅ Shared general materials (e.g., milk, cup, ice)
    materialsUsed: [
      {
        inventoryItemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true }
      }
    ],

    // ✅ Product-specific ingredients (e.g., taro syrup)
    ingredientsUsed: [
      {
        inventoryItemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

// Create a full-text index for name and description
ProductSchema.index({ name: "text", description: "text" });

// Export Product model
export const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);
