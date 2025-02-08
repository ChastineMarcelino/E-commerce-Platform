import { Request, Response } from "express";
import { Model, Document, Types } from "mongoose";

export class BaseController<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // Create a new document
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newItem = await this.model.create(req.body);
      res.status(201).json(newItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Read all documents
  public async read(_req: Request, res: Response): Promise<void> {
    try {
      const items = await this.model.find();
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Read a document by ID
  public async readById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Ensure the ID is valid before querying the database
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }

      const item = await this.model.findById(id);
      if (!item) {
        res.status(404).json({ message: "Not found" });
        return;
      }
      res.status(200).json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update a document by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }

      const updatedItem = await this.model.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedItem) {
        res.status(404).json({ message: "Not found" });
        return;
      }
      res.status(200).json(updatedItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a document by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Ensure the ID is valid before querying the database
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }

      const deletedItem = await this.model.findByIdAndDelete(id);
      if (!deletedItem) {
        res.status(404).json({ message: "Not found" });
        return;
      }

      res.status(200).json({ message: "Deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
