"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierController = void 0;
const supplier_1 = require("../models/supplier");
const supplierValidation_1 = require("../validations/supplierValidation");
const BaseController_1 = require("./BaseController");
class SupplierController extends BaseController_1.BaseController {
    constructor() {
        super(supplier_1.Supplier);
    }
    // Create a new supplier with validation
    async create(req, res) {
        try {
            const { error, value: payload } = (0, supplierValidation_1.validateSupplier)(req.body);
            if (error) {
                res.status(400).json({ message: error.details.map((err) => err.message) });
                return;
            }
            req.body = payload; // Ensure validated payload is used
            await super.create(req, res);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    // Update a supplier with validation
    async update(req, res) {
        try {
            const { error, value: payload } = (0, supplierValidation_1.validateSupplier)(req.body);
            if (error) {
                res.status(400).json({ message: error.details.map((err) => err.message) });
                return;
            }
            req.body = payload; // Ensure validated payload is used
            await super.update(req, res);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.SupplierController = SupplierController;
