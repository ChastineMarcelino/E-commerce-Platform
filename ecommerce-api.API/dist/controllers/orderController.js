"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrders = exports.OrderController = void 0;
const order_1 = require("../models/order");
const product_1 = require("../models/product");
const inventory_1 = require("../models/inventory");
const ordervalidation_1 = require("../validations/ordervalidation");
const BaseController_1 = require("./BaseController");
const defaultMaterial_1 = require("../models/defaultMaterial"); // ✅ Import dynamic default materials
class OrderController extends BaseController_1.BaseController {
    constructor() {
        super(order_1.Order);
    }
    create(req, res) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { error, value: payload } = (0, ordervalidation_1.validateOrder)(req.body);
                if (error) {
                    res.status(400).json({ message: error.details.map((e) => e.message) });
                    return;
                }
                // 1. Fetch product by name
                const product = yield product_1.Product.findOne({ name: payload.product });
                if (!product) {
                    res.status(404).json({ message: `Product not found: ${payload.product}` });
                    return;
                }
                // ✅ Compute base price based on selected size
                let basePrice = 0;
                if (payload.size === 'Medio') {
                    basePrice = product.medioPrice;
                }
                else if (payload.size === 'Grande') {
                    basePrice = product.grandePrice;
                }
                else {
                    basePrice = product.medioPrice; // Default fallback
                }
                // ✅ Add-on price computation
                let addOnsPrice = 0;
                if ((_a = payload.addOns) === null || _a === void 0 ? void 0 : _a.length) {
                    for (const addOn of payload.addOns) {
                        const addOnItem = yield inventory_1.Inventory.findOne({ name: addOn });
                        if (addOnItem) {
                            addOnsPrice += addOnItem.price || 0;
                        }
                    }
                }
                const totalPrice = (basePrice + addOnsPrice) * payload.quantity;
                // 2. Use product's materialsUsed or fallback to default materials from DB
                let materialsToUse = product.materialsUsed || [];
                if (!materialsToUse || materialsToUse.length === 0) {
                    materialsToUse = yield defaultMaterial_1.DefaultMaterial.find({});
                }
                // 3. Use product-specific ingredients if defined
                const ingredientsToUse = product.ingredientsUsed || [];
                // 4. Combine materials and ingredients
                let allItemsToDeduct = [...materialsToUse, ...ingredientsToUse];
                // 🔁 Determine selected size and required cup
                const cupSize = payload.size === "Medio" ? "Plastic Cup 16oz" : "Plastic Cup 22oz";
                // 🔁 Filter out incorrect plastic cup
                allItemsToDeduct = allItemsToDeduct.filter((item) => {
                    if (item.inventoryItemName.includes("Plastic Cup")) {
                        return item.inventoryItemName === cupSize;
                    }
                    return true; // keep everything else
                });
                // 5. Deduct each inventory item
                for (const item of allItemsToDeduct) {
                    const inventoryItem = yield inventory_1.Inventory.findOne({ name: item.inventoryItemName });
                    if (!inventoryItem)
                        continue;
                    const totalUsed = item.quantity * payload.quantity;
                    if (inventoryItem.quantity < totalUsed) {
                        res.status(400).json({ message: `Insufficient stock for ${item.inventoryItemName}` });
                        return;
                    }
                    inventoryItem.quantity -= totalUsed;
                    // Update inventory status
                    if (inventoryItem.quantity <= 0) {
                        inventoryItem.status = "Out of Stock";
                    }
                    else if (inventoryItem.quantity <= inventoryItem.reorderLevel) {
                        inventoryItem.status = "Low Stock";
                    }
                    else {
                        inventoryItem.status = "In Stock";
                    }
                    yield inventoryItem.save();
                }
                // 6. Deduct add-ons if any
                if ((_b = payload.addOns) === null || _b === void 0 ? void 0 : _b.length) {
                    for (const addOn of payload.addOns) {
                        const addOnItem = yield inventory_1.Inventory.findOne({ name: addOn });
                        if (addOnItem) {
                            const totalUsed = payload.quantity;
                            addOnItem.quantity -= totalUsed;
                            if (addOnItem.quantity <= 0) {
                                addOnItem.status = "Out of Stock";
                            }
                            else if (addOnItem.quantity <= addOnItem.reorderLevel) {
                                addOnItem.status = "Low Stock";
                            }
                            else {
                                addOnItem.status = "In Stock";
                            }
                            yield addOnItem.save();
                        }
                    }
                }
                // 7. Save the order
                req.body = payload;
                req.body.userId = req.userId;
                req.body.price = totalPrice; // ✅ Attach computed price
                yield _super.create.call(this, req, res);
            }
            catch (error) {
                console.error("Order Error:", error);
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.OrderController = OrderController;
// ✅ My Orders function
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.Order.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch your orders', error });
    }
});
exports.getMyOrders = getMyOrders;
