import mongoose from "mongoose";

const defaultMaterialSchema = new mongoose.Schema({
  inventoryItemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }
});

export const DefaultMaterial = mongoose.model("DefaultMaterial", defaultMaterialSchema);
