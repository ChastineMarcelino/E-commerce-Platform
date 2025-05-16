import { Document } from "mongoose";

// Interface for a Shipment document
export interface IShipment extends Document {
  trackingNumber: string;     // Tracking number for monitoring the shipment
  destination: string;
  status: string;             // Current status of the shipment (e.g., "Shipped", "Delivered", "Pending")
}
