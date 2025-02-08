import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Supplier
export interface ISupplier extends Document {
  supplierId: string;       // Unique identifier for the supplier
  supplierName: string;     // Name of the supplier
  contactInfo: string;      // Contact information (e.g., phone or email)
  address: string;          // Address of the supplier
}

// Schema for Supplier
const SupplierSchema = new Schema<ISupplier>(
  {
    supplierId: { type: String, required: true, unique: true },
    supplierName: { type: String, required: true, maxlength: 100 },
    contactInfo: { type: String, required: true, maxlength: 100 },
    address: { type: String, required: true, maxlength: 255 },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Model for Supplier
export const Supplier: Model<ISupplier> = mongoose.model<ISupplier>("Supplier", SupplierSchema);