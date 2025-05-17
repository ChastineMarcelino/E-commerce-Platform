"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrder = void 0;
const joi_1 = __importDefault(require("joi")); // Import Joi validation library
/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - size
 *       properties:
 *         product:
 *           type: string
 *           description: Name of the product
 *         image:
 *           type: string
 *           description: URL to product image
 *         sugarLevel:
 *           type: string
 *           description: Sugar level (e.g. 25%, 50%, 100%)
 *         size:
 *           type: string
 *           description: Size of drink (e.g. 16oz, 22oz)
 *         quantity:
 *           type: integer
 *           minimum: 1
 *         addOns:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *           enum: [Pending, Done]
 *         date:
 *           type: string
 *           format: date-time
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
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
// Define a validation schema for the new Order format
const orderValidationSchema = joi_1.default.object({
    product: joi_1.default.string().trim().required().messages({
        "any.required": "Product name is required",
        "string.empty": "Product name cannot be empty"
    }),
    image: joi_1.default.string().optional().messages({
        "string.base": "Image must be a string"
    }),
    sugarLevel: joi_1.default.string().valid("25%", "50%", "75%", "100%").optional().messages({
        "any.only": "Sugar level must be one of: 25%, 50%, 75%, or 100%"
    }),
    size: joi_1.default.string().valid("16oz", "22oz").required().messages({
        "any.required": "Size is required",
        "any.only": "Size must be either '16oz' or '22oz'"
    }),
    quantity: joi_1.default.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required"
    }),
    addOns: joi_1.default.array().items(joi_1.default.string()).optional(),
    status: joi_1.default.string().valid("Pending", "Done").optional(),
    date: joi_1.default.date().optional()
});
// Helper function to validate order data
const validateOrder = (orderData) => {
    return orderValidationSchema.validate(orderData, { abortEarly: false });
};
exports.validateOrder = validateOrder;
