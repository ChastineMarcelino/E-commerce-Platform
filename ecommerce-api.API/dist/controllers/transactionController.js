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
exports.TransactionController = void 0;
const Transaction_1 = require("../models/Transaction");
const transactionValidation_1 = require("../validations/transactionValidation");
const BaseController_1 = require("./BaseController");
class TransactionController extends BaseController_1.BaseController {
    constructor() {
        super(Transaction_1.Transaction);
    }
    // Create a new transaction with validation
    create(req, res) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value: payload } = (0, transactionValidation_1.validateTransaction)(req.body);
                if (error) {
                    res.status(400).json({ message: error.details.map((err) => err.message) });
                    return;
                }
                req.body = payload; // Ensure validated payload is used
                yield _super.create.call(this, req, res);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Update a transaction with validation
    update(req, res) {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value: payload } = (0, transactionValidation_1.validateTransaction)(req.body);
                if (error) {
                    res.status(400).json({ message: error.details.map((err) => err.message) });
                    return;
                }
                req.body = payload; // Ensure validated payload is used
                yield _super.update.call(this, req, res);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.TransactionController = TransactionController;
