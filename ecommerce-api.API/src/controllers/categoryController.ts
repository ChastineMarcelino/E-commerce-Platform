import { Request, Response } from "express";
import { Category } from "../models/category";
import { ICategory } from "../interface/categoryInterface";
import { validateCategoryData } from "../validations/categoryvalidation";
import { BaseController } from "./BaseController";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export class CategoryController extends BaseController<ICategory> {
  public async get(req: Request, res: Response): Promise<void> {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

  constructor() {
    super(Category as any);
  }

  // Create a new category with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateCategoryData(req.body);
      if (error) {
        res.status(400).json({
          message: "Validation error",
          errors: error.details.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }

      req.body = payload; // Ensure validated payload is used
      await super.create(req, res);
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Update an existing category with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateCategoryData(req.body);
      if (error) {
        res.status(400).json({
          message: "Validation error",
          errors: error.details.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }

      req.body = payload; // Ensure validated payload is used
      await super.update(req, res);
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
