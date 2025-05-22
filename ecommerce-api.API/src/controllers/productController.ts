import { Request, Response } from "express";
import { Product } from "../models/product";
import { IProduct } from "../interface/productInterface";
import { validateProductData } from "../validations/productvalidation";
import { BaseController } from "./BaseController";

export class ProductController extends BaseController<IProduct> {
  static getProducts(filter: Record<string, any>, sorting: Record<string, 1 | -1>) {
    throw new Error("Method not implemented.");
  }

  static getProductById(id: string) {
    throw new Error("Method not implemented.");
  }

  constructor() {
    super(Product as any);
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { sort, search, category } = req.query;

      let filter: Record<string, any> = {};
      let sorting: Record<string, 1 | -1> = {};

      if (search) filter.$text = { $search: search };
      if (category) filter.category = category;

      if (sort) {
        const [field, order] = (sort as string).split("_");
        sorting[field] = order === "asc" ? 1 : -1;
      }

      const products = await Product.find(filter).sort(sorting);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      if (typeof req.body.addOns === "string") {
        try {
          req.body.addOns = JSON.parse(req.body.addOns);
        } catch {
          req.body.addOns = [];
        }
      }

      const { error, value: payload } = validateProductData(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }

      const existingProduct = await Product.findOne({ name: payload.name });
      if (existingProduct) {
        res.status(400).json({ message: "Product name already exists" });
        return;
      }

      // ✅ Set image URL if file is uploaded
      if (req.file) {
        const protocol = req.protocol;
        const host = req.get("host");
        req.body.imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      }

      req.body = payload;
      await super.create(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      if (typeof req.body.addOns === "string") {
        try {
          req.body.addOns = JSON.parse(req.body.addOns);
        } catch {
          req.body.addOns = [];
        }
      }

      const { error, value: payload } = validateProductData(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }

      const existingProduct = await Product.findOne({ name: payload.name, _id: { $ne: req.params.id } });
      if (existingProduct) {
        res.status(400).json({ message: "Product name already exists" });
        return;
      }

      // ✅ Update image URL if new file uploaded
     if (req.file) {
const protocol = 'https'; // always use HTTPS in production

  const host = req.get("host");
  req.body.imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
}

      req.body = payload;
      await super.update(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
