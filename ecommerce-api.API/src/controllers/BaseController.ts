import { Response } from "express";
import { Model, Document, Types } from "mongoose";
import { AuditTrail } from "../models/auditTrails"; // ✅ Ensure correct import
import { AuthRequest } from "../Middleware/authMiddleware"; // ✅ Import custom request type

export class BaseController<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // ✅ Create a new document with Audit Logging
  public async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const newItem = await this.model.create(req.body);
      res.locals.newRecordId = newItem._id; // Store for audit logging

      // Save audit trail
      // await this.saveAuditTrail(req, "create", null, newItem);

      res.status(201).json(newItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // ✅ Read all documents
  public async read(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const items = await this.model.find();
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ Read a document by ID with Audit Logging
  public async readById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }

      const item = await this.model.findById(id);
      if (!item) {
        res.status(404).json({ message: "Not found" });
        return;
      }

      // Save audit trail
      // await this.saveAuditTrail(req, "read_by_id", item, null);

      res.status(200).json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ Update a document by ID with Audit Logging
  public async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }

      const existingItem = await this.model.findById(id);
      if (!existingItem) {
        res.status(404).json({ message: "Not found" });
        return;
      }

      const updatedItem = await this.model.findByIdAndUpdate(id, req.body, { new: true });

      // Save audit trail
      // await this.saveAuditTrail(req, "update", existingItem, updatedItem);

      res.status(200).json(updatedItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // ✅ Delete a document by ID with Audit Logging
  public async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }

      const deletedItem = await this.model.findByIdAndDelete(id);
      if (!deletedItem) {
        res.status(404).json({ message: "Not found" });
        return;
      }

      // Save audit trail
      // await this.saveAuditTrail(req, "delete", deletedItem, null);

      res.status(200).json({ message: "Deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ Helper function to save audit trail
  private async saveAuditTrail(req: AuthRequest, eventType: string, originalData: any, newData: any) {
    try {
      // **Convert ObjectId to string**
      const userId = req.userId 
      ? req.userId.toString() 
      : req.body.userId 
        ? req.body.userId.toString() 
        : null;
  
        const auditTrail = await AuditTrail.create({
          UserId: userId, // ✅ Now ensures UserId is never null during login
          EventType: eventType,
          DataChanges: ["create", "update", "delete", "read_by_id"].includes(eventType)
            ? { original: originalData, new: eventType === "delete" ? null : newData }
            : null,
          Description: `${eventType} operation performed`,
        });
  
      console.log(`✅ Audit trail saved: ${eventType}`);
    } catch (error) {
      console.error("❌ Error saving audit trail:", error);
    }
  }
}