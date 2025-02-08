import { Document } from "mongoose";

export interface IOrder extends Document {

  orderId: number;       // ID linking the detail to an order
  productId: number;     // ID of the product in the order
  quantity: number;      // Quantity of the product in the order
  price: number;         // Price of the product
}