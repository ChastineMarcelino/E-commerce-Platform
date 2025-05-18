"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const Transaction_1 = require("../models/Transaction");
const transactionValidation_1 = require("../validations/transactionValidation");
const BaseController_1 = require("./BaseController");
class TransactionController extends BaseController_1.BaseController {
    constructor() {
        super(Transaction_1.Transaction);
    }
    // Create a new transaction with validation
    async create(req, res) {
        try {
            const { error, value: payload } = (0, transactionValidation_1.validateTransaction)(req.body);
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
    // Update a transaction with validation
    async update(req, res) {
        try {
            const { error, value: payload } = (0, transactionValidation_1.validateTransaction)(req.body);
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
exports.TransactionController = TransactionController;
