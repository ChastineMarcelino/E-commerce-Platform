import { Document } from "mongoose";

// Interface for a Shipment document
export interface IShipment extends Document {
  shipmentId: string;         // Primary key, unique identifier for the shipment
  orderId: string;            // Foreign key, reference to the related order
  shipmentDate: Date;         // Date when the shipment was created or shipped
  shipmentMethod: string;     // Method used for shipment (e.g., "Air", "Ground")
  trackingNumber: string;     // Tracking number for monitoring the shipment
  status: string;             // Current status of the shipment (e.g., "Shipped", "Delivered", "Pending")
}
