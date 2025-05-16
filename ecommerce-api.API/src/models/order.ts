import mongoose, { Schema, Document, Model } from 'mongoose';

// New Order Interface
export interface IOrder extends Document {
  product: string;
  image: string;
  sugarLevel: string;
  size: string;
  quantity: number;
  addOns: string[];
  status: string;
  date: Date;
  price: number;
  userId: mongoose.Types.ObjectId; // ✅ Add this
}

// Schema for placed orders
const OrderSchema = new Schema<IOrder>(
  {
    product: { type: String, required: true },
    image: { type: String },
    sugarLevel: { type: String },
    size: { type: String },
    quantity: { type: Number, required: true,  min: 1  },
    addOns: { type: [String], default: [] },
    status: { type: String, enum: ['Pending', 'Done'], default: 'Pending' },
    date: { type: Date, default: Date.now },
    price: { type: Number, required: true },
     // ✅ Add this line
     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

// Final export
export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);
