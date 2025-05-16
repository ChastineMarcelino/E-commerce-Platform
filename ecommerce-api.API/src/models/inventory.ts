import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInventory extends Document {
  name: string;
  quantity: number;
  unit: string; // ✅ NEW: e.g., "kilo", "scoop", "bundle"
  price: number;
  category: string;
  supplier?: string;
  reorderLevel: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true }, // ✅ Add this line
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    supplier: { type: String },
    reorderLevel: { type: Number, required: true, default: 10 },
    status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
  },
  { timestamps: true }
);

// Auto-update status based on quantity
InventorySchema.pre('save', function (next) {
  const item = this as IInventory;
  if (item.quantity <= 0) item.status = 'Out of Stock';
  else if (item.quantity <= item.reorderLevel) item.status = 'Low Stock';
  else item.status = 'In Stock';
  next();
});

export const Inventory: Model<IInventory> = mongoose.model<IInventory>('Inventory', InventorySchema);
