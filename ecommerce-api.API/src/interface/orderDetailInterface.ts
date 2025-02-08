import { Document } from "mongoose";

export interface IOrderDetail extends Document{
  productId: string;        // ID of the product being ordered
  quantity: number;         // Quantity of the product
  price: number;        // Price per unit of the product
  totalPrice: number;       // Total price for the quantity (calculated field)
  orderId: string;          // ID of the associated order
  createdAt: Date;          // Timestamp for when the order detail was created
  updatedAt: Date;          // Timestamp for when the order detail was last updated
}
