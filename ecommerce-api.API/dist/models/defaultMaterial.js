"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMaterial = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const defaultMaterialSchema = new mongoose_1.default.Schema({
    inventoryItemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
});
exports.DefaultMaterial = mongoose_1.default.model("DefaultMaterial", defaultMaterialSchema);
