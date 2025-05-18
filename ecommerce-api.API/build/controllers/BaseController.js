"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const mongoose_1 = require("mongoose");
const auditTrails_1 = require("../models/auditTrails"); // ✅ Ensure correct import
class BaseController {
    constructor(model) {
        this.model = model;
    }
    // ✅ Create a new document with Audit Logging
    async create(req, res) {
        try {
            const newItem = await this.model.create(req.body);
            res.locals.newRecordId = newItem._id; // Store for audit logging
            // Save audit trail
            // await this.saveAuditTrail(req, "create", null, newItem);
            res.status(201).json(newItem);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    // ✅ Read all documents
    async read(_req, res) {
        try {
            const items = await this.model.find();
            res.status(200).json(items);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // ✅ Read a document by ID with Audit Logging
    async readById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
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
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // ✅ Update a document by ID with Audit Logging
    async update(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
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
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    // ✅ Delete a document by ID with Audit Logging
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
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
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // ✅ Helper function to save audit trail
    async saveAuditTrail(req, eventType, originalData, newData) {
        try {
            // **Convert ObjectId to string**
            const userId = req.userId
                ? req.userId.toString()
                : req.body.userId
                    ? req.body.userId.toString()
                    : null;
            const auditTrail = await auditTrails_1.AuditTrail.create({
                UserId: userId, // ✅ Now ensures UserId is never null during login
                EventType: eventType,
                DataChanges: ["create", "update", "delete", "read_by_id"].includes(eventType)
                    ? { original: originalData, new: eventType === "delete" ? null : newData }
                    : null,
                Description: `${eventType} operation performed`,
            });
            console.log(`✅ Audit trail saved: ${eventType}`);
        }
        catch (error) {
            console.error("❌ Error saving audit trail:", error);
        }
    }
}
exports.BaseController = BaseController;
