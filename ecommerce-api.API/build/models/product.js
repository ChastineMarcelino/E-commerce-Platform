"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Product Schema
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (name) {
                const existingProduct = await mongoose_1.default.models.Product.findOne({ name });
                return !existingProduct;
            },
            message: "Product name must be unique",
        },
    },
    description: { type: String, required: true },
    medioPrice: { type: Number, required: true, min: 0 },
    grandePrice: { type: Number, required: true, min: 0 },
    inStock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    imageUrl: { type: String },
    addOns: [{ type: String }],
    // ✅ Shared general materials (e.g., milk, cup, ice)
    materialsUsed: [
        {
            inventoryItemName: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: true }
        }
    ],
    // ✅ Product-specific ingredients (e.g., taro syrup)
    ingredientsUsed: [
        {
            inventoryItemName: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: true }
        }
    ]
}, { timestamps: true });
// Create a full-text index for name and description
ProductSchema.index({ name: "text", description: "text" });
// Export Product model
exports.Product = mongoose_1.default.model("Product", ProductSchema);
