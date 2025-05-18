"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_1 = require("../models/payment");
const paymentvalidation_1 = require("../validations/paymentvalidation");
const BaseController_1 = require("./BaseController");
class PaymentController extends BaseController_1.BaseController {
    constructor() {
        super(payment_1.Payment);
    }
    // Create a new payment with validation
    async create(req, res) {
        try {
            const { error, value: payload } = (0, paymentvalidation_1.validatePayment)(req.body);
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
    // Update a payment with validation
    async update(req, res) {
        try {
            const { error, value: payload } = (0, paymentvalidation_1.validatePayment)(req.body);
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
exports.PaymentController = PaymentController;
