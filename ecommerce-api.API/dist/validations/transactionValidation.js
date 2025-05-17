"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransaction = void 0;
const joi_1 = __importDefault(require("joi")); // Import Joi validation library
/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - transactionID
 *         - productID
 *         - inventoryID
 *         - orderID
 *         - transactionType
 *         - transactionDate
 *         - quantity
 *         - payment
 *       properties:
 *         transactionID:
 *           type: string
 *           description: Unique identifier for the transaction
 *           example: "TX12345"
 *         productID:
 *           type: string
 *           description: Foreign key, reference to the related product
 *           example: "PRD67890"
 *         inventoryID:
 *           type: string
 *           description: Foreign key, reference to the related inventory item
 *           example: "INV12345"
 *         orderID:
 *           type: string
 *           description: Identifier for the related order
 *           example: "ORD56789"
 *         transactionType:
 *           type: string
 *           description: Type of transaction (e.g., "Sale", "Purchase", "Return")
 *           example: "Sale"
 *         transactionDate:
 *           type: string
 *           format: date
 *           description: Date when the transaction took place
 *           example: "2024-11-18"
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           description: Quantity involved in the transaction
 *           example: 10
 *         payment:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Payment amount related to the transaction
 *           example: 199.99
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               path:
 *                 type: array
 *                 items:
 *                   type: string
 */
// Define a validation schema for transaction data
const transactionValidationSchema = joi_1.default.object({
    // Transaction ID validation
    transactionID: joi_1.default.string().required().messages({
        "any.required": "Transaction ID is required and must be a string",
    }),
    // Product ID validation
    productID: joi_1.default.string().required().messages({
        "any.required": "Product ID is required and must be a string",
    }),
    // Inventory ID validation
    inventoryID: joi_1.default.string().required().messages({
        "any.required": "Inventory ID is required and must be a string",
    }),
    // Order ID validation
    orderID: joi_1.default.string().required().messages({
        "any.required": "Order ID is required and must be a string",
    }),
    // Transaction Type validation (using valid values)
    transactionType: joi_1.default.string()
        .valid('sale', 'purchase', 'return') // Ensure only these values are allowed
        .required()
        .messages({
        "any.required": "Transaction type is required and must be one of 'Sale', 'Purchase', or 'Return'",
        "any.only": "Transaction type must be one of 'Sale', 'Purchase', or 'Return'",
    }),
    // Transaction Date validation
    transactionDate: joi_1.default.date().required().messages({
        "date.base": "Transaction date must be a valid date",
        "any.required": "Transaction date is required and must be a valid date",
    }),
    // Quantity validation
    quantity: joi_1.default.number().integer().min(0).required().messages({
        "number.base": "Quantity must be a valid integer",
        "number.min": "Quantity cannot be less than 0",
        "any.required": "Quantity is required and must be a positive number",
    }),
    // Payment validation
    payment: joi_1.default.number().min(0).required().messages({
        "number.base": "Payment must be a valid number",
        "number.min": "Payment cannot be less than 0",
        "any.required": "Payment is required and must be a valid number",
    }),
});
// Helper function to validate transaction data
const validateTransaction = (transactionData) => {
    return transactionValidationSchema.validate(transactionData, { abortEarly: false });
};
exports.validateTransaction = validateTransaction;
exports.default = transactionValidationSchema;
