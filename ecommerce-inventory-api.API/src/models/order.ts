import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for OrderDetail
export interface IOrder extends Document {
  OrderID: string;        // Foreign Key, links to Order
  ProductID: string;      // Foreign Key, links to Product
  Quantity: number;       // Quantity of the product in the order
  Price: number;          // Price per unit of the product
  createdAt?: Date;       // Timestamp when the order detail was created
  updatedAt?: Date;       // Timestamp when the order detail was last updated
}

// Schema for OrderDetail
const OrderSchema = new Schema<IOrder>(
  {
    OrderID: { type: String, required: true },
    ProductID: { type: String, required: true },
    Quantity: { type: Number, required: true, min: 0 },
    Price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Model for OrderDetail
export const Order: Model<IOrder> = mongoose.model<IOrder>(
  'Order',
  OrderSchema
);
