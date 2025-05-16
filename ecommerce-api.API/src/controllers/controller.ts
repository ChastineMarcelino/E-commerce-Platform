import { Request, Response } from "express";
import { Inventory } from "../models/inventory";
import { IInventoryItem } from "../interface/inventoryinterface";
import { validateInventoryData } from "../validations/inventoryvalidation";
import { BaseController } from "./BaseController";

export class InventoryController extends BaseController<IInventoryItem> {
  constructor() {
    super(Inventory as any);
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateInventoryData(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map(err => err.message) });
        return;
      }
      const newItem = new Inventory(value);
      await newItem.save();
      res.status(201).json(newItem);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateInventoryData(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map(err => err.message) });
        return;
      }
      const updated = await Inventory.findByIdAndUpdate(req.params.id, value, { new: true });
      if (!updated) {
        res.status(404).json({ message: 'Item not found' });
        return;
      }
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const total = await Inventory.countDocuments();
      const items = await Inventory.find().skip(skip).limit(limit).sort({ createdAt: -1 });

      res.status(200).json({
        data: items,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
