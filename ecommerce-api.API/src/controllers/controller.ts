import { Request, Response } from "express";
import { InventoryItem } from "../models/InventoryItem";
import { IInventoryItem } from "../interface/inventoryinterface";
import { validateInventoryItem } from "../validations/inventoryvalidation";
import { BaseController } from "./BaseController";

export class InventoryController extends BaseController<IInventoryItem> {
  constructor() {
    super(InventoryItem);
  }

  // Create a new inventory item with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateInventoryItem(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }
      req.body = payload; // Ensure validated payload is used
      await super.create(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update an inventory item with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateInventoryItem(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }
      req.body = payload; // Ensure validated payload is used
      await super.update(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
