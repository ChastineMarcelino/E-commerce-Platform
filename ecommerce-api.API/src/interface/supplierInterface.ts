import { Document } from "mongoose";

export interface ISupplier extends Document {
  supplierId: string;      // Unique identifier for the supplier
  supplierName: string;    // Name of the supplier
  contactInfo: string;     // Contact information (e.g., phone, email)
  address: string;         // Physical address of the supplier
}