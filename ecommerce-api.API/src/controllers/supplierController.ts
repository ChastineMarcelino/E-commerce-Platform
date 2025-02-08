import { Request, Response } from "express";
import { Supplier } from "../models/supplier";
import { ISupplier } from "../interface/supplierInterface";
import { validateSupplier } from "../validations/supplierValidation";
import { BaseController } from "./BaseController";

export class SupplierController extends BaseController<ISupplier> {
  constructor() {
    super(Supplier);
  }

  // Create a new supplier with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateSupplier(req.body);
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

  // Update a supplier with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateSupplier(req.body);
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
