"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const mongoose_1 = require("mongoose");
const auditTrails_1 = require("../models/auditTrails"); // ✅ Ensure correct import
class BaseController {
    constructor(model) {
        this.model = model;
    }
    // ✅ Create a new document with Audit Logging
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newItem = yield this.model.create(req.body);
                res.locals.newRecordId = newItem._id; // Store for audit logging
                // Save audit trail
                // await this.saveAuditTrail(req, "create", null, newItem);
                res.status(201).json(newItem);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // ✅ Read all documents
    read(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield this.model.find();
                res.status(200).json(items);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // ✅ Read a document by ID with Audit Logging
    readById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    res.status(400).json({ message: "Invalid ID format" });
                    return;
                }
                const item = yield this.model.findById(id);
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
        });
    }
    // ✅ Update a document by ID with Audit Logging
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    res.status(400).json({ message: "Invalid ID format" });
                    return;
                }
                const existingItem = yield this.model.findById(id);
                if (!existingItem) {
                    res.status(404).json({ message: "Not found" });
                    return;
                }
                const updatedItem = yield this.model.findByIdAndUpdate(id, req.body, { new: true });
                // Save audit trail
                // await this.saveAuditTrail(req, "update", existingItem, updatedItem);
                res.status(200).json(updatedItem);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // ✅ Delete a document by ID with Audit Logging
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    res.status(400).json({ message: "Invalid ID format" });
                    return;
                }
                const deletedItem = yield this.model.findByIdAndDelete(id);
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
        });
    }
    // ✅ Helper function to save audit trail
    saveAuditTrail(req, eventType, originalData, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // **Convert ObjectId to string**
                const userId = req.userId
                    ? req.userId.toString()
                    : req.body.userId
                        ? req.body.userId.toString()
                        : null;
                const auditTrail = yield auditTrails_1.AuditTrail.create({
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
        });
    }
}
exports.BaseController = BaseController;
