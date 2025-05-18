"use strict";
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
    async create(req, res) {
        try {
            const { error, value: payload } = (0, ordervalidation_1.validateOrder)(req.body);
            if (error) {
                res.status(400).json({ message: error.details.map((e) => e.message) });
                return;
            }
            // 1. Fetch product by name
            const product = await product_1.Product.findOne({ name: payload.product });
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
            if (payload.addOns?.length) {
                for (const addOn of payload.addOns) {
                    const addOnItem = await inventory_1.Inventory.findOne({ name: addOn });
                    if (addOnItem) {
                        addOnsPrice += addOnItem.price || 0;
                    }
                }
            }
            const totalPrice = (basePrice + addOnsPrice) * payload.quantity;
            // 2. Use product's materialsUsed or fallback to default materials from DB
            let materialsToUse = product.materialsUsed || [];
            if (!materialsToUse || materialsToUse.length === 0) {
                materialsToUse = await defaultMaterial_1.DefaultMaterial.find({});
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
                const inventoryItem = await inventory_1.Inventory.findOne({ name: item.inventoryItemName });
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
                await inventoryItem.save();
            }
            // 6. Deduct add-ons if any
            if (payload.addOns?.length) {
                for (const addOn of payload.addOns) {
                    const addOnItem = await inventory_1.Inventory.findOne({ name: addOn });
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
                        await addOnItem.save();
                    }
                }
            }
            // 7. Save the order
            req.body = payload;
            req.body.userId = req.userId;
            req.body.price = totalPrice; // ✅ Attach computed price
            await super.create(req, res);
        }
        catch (error) {
            console.error("Order Error:", error);
            res.status(500).json({ message: error.message });
        }
    }
}
exports.OrderController = OrderController;
// ✅ My Orders function
const getMyOrders = async (req, res) => {
    try {
        const orders = await order_1.Order.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch your orders', error });
    }
};
exports.getMyOrders = getMyOrders;
