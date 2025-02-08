import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Shipment
export interface IShipment extends Document {
  trackingNumber: string; // Unique tracking number for the shipment
  destination: string;    // Destination address of the shipment
  status: string;         // Current status of the shipment
  createdAt?: Date;       // Timestamp when the shipment was created
  updatedAt?: Date;       // Timestamp when the shipment was last updated
}

// Schema for Shipment
const ShipmentSchema = new Schema<IShipment>(
  {
    trackingNumber: { type: String, required: true },
    destination: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Model for Shipment
export const Shipment: Model<IShipment> = mongoose.model<IShipment>(
  "Shipment",
  ShipmentSchema
);
