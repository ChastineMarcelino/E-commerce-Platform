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
exports.InventoryController = void 0;
const inventory_1 = require("../models/inventory");
const inventoryvalidation_1 = require("../validations/inventoryvalidation");
const BaseController_1 = require("./BaseController");
class InventoryController extends BaseController_1.BaseController {
    constructor() {
        super(inventory_1.Inventory);
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = (0, inventoryvalidation_1.validateInventoryData)(req.body);
                if (error) {
                    res.status(400).json({ message: error.details.map(err => err.message) });
                    return;
                }
                const newItem = new inventory_1.Inventory(value);
                yield newItem.save();
                res.status(201).json(newItem);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = (0, inventoryvalidation_1.validateInventoryData)(req.body);
                if (error) {
                    res.status(400).json({ message: error.details.map(err => err.message) });
                    return;
                }
                const updated = yield inventory_1.Inventory.findByIdAndUpdate(req.params.id, value, { new: true });
                if (!updated) {
                    res.status(404).json({ message: 'Item not found' });
                    return;
                }
                res.status(200).json(updated);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page - 1) * limit;
                const total = yield inventory_1.Inventory.countDocuments();
                const items = yield inventory_1.Inventory.find().skip(skip).limit(limit).sort({ createdAt: -1 });
                res.status(200).json({
                    data: items,
                    pagination: {
                        total,
                        pages: Math.ceil(total / limit),
                        page,
                        limit,
                    },
                });
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.InventoryController = InventoryController;
