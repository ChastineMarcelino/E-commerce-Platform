import { Document } from "mongoose";

export interface IOrder extends Document {

  OrderID: number;       // ID linking the detail to an order
  ProductID: number;     // ID of the product in the order
  Quantity: number;      // Quantity of the product in the order
  Price: number;         // Price of the product
}