import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for OrderDetail
export interface IOrderDetail extends Document {
  orderId: string;       // Unique identifier for the order
  productId: string;     // Foreign key, links to the Product
  quantity: number;      // Quantity of the product in the order
  price: number;         // Price of the product
  totalPrice: number;    // Total price for the quantity of product
}

// Schema for OrderDetail
const OrderDetailSchema = new Schema<IOrderDetail>(
  {
    orderId: { type: String, required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// **PRE-SAVE HOOK TO AUTO-CALCULATE TOTAL PRICE**
OrderDetailSchema.pre("save", function (next) {
  this.totalPrice = this.quantity * this.price;
  next();
});

// Model for OrderDetail
export const OrderDetail: Model<IOrderDetail> = mongoose.model<IOrderDetail>(
  "OrderDetail",
  OrderDetailSchema
);
