import { Request, Response } from "express";
import { Order } from "../models/order";
import { Product } from "../models/product";
import { Inventory } from "../models/inventory";
import { IOrder } from "../interface/orderInterface";
import { validateOrder } from "../validations/ordervalidation";
import { BaseController } from "./BaseController";
import { AuthRequest } from "../Middleware/authMiddleware";
import { DefaultMaterial } from "../models/defaultMaterial"; // ✅ Import dynamic default materials

export class OrderController extends BaseController<IOrder> {
  constructor() {
    super(Order as any);
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateOrder(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((e) => e.message) });
        return;
      }

      // 1. Fetch product by name
      const product = await Product.findOne({ name: payload.product });
      if (!product) {
        res.status(404).json({ message: `Product not found: ${payload.product}` });
        return;
      }
      
    // ✅ Compute base price based on selected size
    let basePrice = 0;
    if (payload.size === 'Medio') {
      basePrice = product.medioPrice;
    } else if (payload.size === 'Grande') {
      basePrice = product.grandePrice;
    } else {
      basePrice = product.medioPrice; // Default fallback
    }

    // ✅ Add-on price computation
    let addOnsPrice = 0;
    if (payload.addOns?.length) {
      for (const addOn of payload.addOns) {
        const addOnItem = await Inventory.findOne({ name: addOn });
        if (addOnItem) {
          addOnsPrice += addOnItem.price || 0;
        }
      }
    }

    const totalPrice = (basePrice + addOnsPrice) * payload.quantity;


      // 2. Use product's materialsUsed or fallback to default materials from DB
      let materialsToUse = product.materialsUsed || [];
      if (!materialsToUse || materialsToUse.length === 0) {
        materialsToUse = await DefaultMaterial.find({});
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
        const inventoryItem = await Inventory.findOne({ name: item.inventoryItemName });
        if (!inventoryItem) continue;

        const totalUsed = item.quantity * payload.quantity;

        if (inventoryItem.quantity < totalUsed) {
          res.status(400).json({ message: `Insufficient stock for ${item.inventoryItemName}` });
          return;
        }

        inventoryItem.quantity -= totalUsed;

        // Update inventory status
        if (inventoryItem.quantity <= 0) {
          inventoryItem.status = "Out of Stock";
        } else if (inventoryItem.quantity <= inventoryItem.reorderLevel) {
          inventoryItem.status = "Low Stock";
        } else {
          inventoryItem.status = "In Stock";
        }

        await inventoryItem.save();
      }

      // 6. Deduct add-ons if any
      if (payload.addOns?.length) {
        for (const addOn of payload.addOns) {
          const addOnItem = await Inventory.findOne({ name: addOn });
          if (addOnItem) {
            const totalUsed = payload.quantity;
            addOnItem.quantity -= totalUsed;

            if (addOnItem.quantity <= 0) {
              addOnItem.status = "Out of Stock";
            } else if (addOnItem.quantity <= addOnItem.reorderLevel) {
              addOnItem.status = "Low Stock";
            } else {
              addOnItem.status = "In Stock";
            }

            await addOnItem.save();
          }
        }
      }

      

      // 7. Save the order
      req.body = payload;
      (req.body as any).userId = (req as any).userId;
      (req.body as any).price = totalPrice; // ✅ Attach computed price
      await super.create(req, res);

    } catch (error: any) {
      console.error("Order Error:", error);
      res.status(500).json({ message: error.message });
    }
  }
}

// ✅ My Orders function
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your orders', error });
  }
};
