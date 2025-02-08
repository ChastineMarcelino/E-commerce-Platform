import { Request, Response } from "express";
import { Product } from "../models/product";
import { IProduct } from "../interface/productInterface";
import { validateProduct } from "../validations/productvalidation";
import { BaseController } from "./BaseController";

export class ProductController extends BaseController<IProduct> {
  constructor() {
    super(Product);
  }

  // Create a new product with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateProduct(req.body);
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

  // Update an existing product with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateProduct(req.body);
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
