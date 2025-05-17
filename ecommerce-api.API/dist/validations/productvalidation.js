"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProductMiddleware = exports.validateProductData = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productID
 *         - name
 *         - description
 *         - category
 *         - price
 *         - stockQuantity
 *         - supplierID
 *       properties:
 *         productID:
 *           type: string
 *           description: Unique identifier for the product
 *         name:
 *           type: string
 *           maxLength: 100
 *         description:
 *           type: string
 *           maxLength: 500
 *         category:
 *           type: string
 *           maxLength: 50
 *         price:
 *           type: number
 *         stockQuantity:
 *           type: integer
 *         supplierID:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
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
// ✅ Joi validation schema for product
const productValidationSchema = joi_1.default.object({
    name: joi_1.default.string().max(100).required().messages({
        "string.max": "Product name cannot exceed 100 characters",
        "any.required": "Product name is required",
    }),
    description: joi_1.default.string().max(500).required().messages({
        "string.max": "Description cannot exceed 500 characters",
        "any.required": "Description is required",
    }),
    category: joi_1.default.string().max(50).required().messages({
        "string.max": "Category cannot exceed 50 characters",
        "any.required": "Category is required",
    }),
    medioPrice: joi_1.default.number().greater(0).required().messages({
        "number.base": "Medio price must be a valid number",
        "number.greater": "Medio price must be greater than 0",
        "any.required": "Medio price is required",
    }),
    grandePrice: joi_1.default.number().greater(0).required().messages({
        "number.base": "Grande price must be a valid number",
        "number.greater": "Grande price must be greater than 0",
        "any.required": "Grande price is required",
    }),
    inStock: joi_1.default.number().integer().min(0).required().messages({
        "number.base": "Stock quantity must be a valid number",
        "number.min": "Stock quantity cannot be less than 0",
        "any.required": "Stock quantity is required",
    }),
    addOns: joi_1.default.array().items(joi_1.default.string()).optional().messages({
        'array.base': 'Add-ons must be an array of strings'
    }),
});
// ✅ Allow unknown fields (like id, image, imageUrl, price)
const validateProductData = (data) => {
    return productValidationSchema.validate(data, {
        abortEarly: false,
        allowUnknown: true, // ✅ Prevents 400 for extra frontend fields
    });
};
exports.validateProductData = validateProductData;
// ✅ Middleware for routes
const validateProductMiddleware = (req, res, next) => {
    const { error } = (0, exports.validateProductData)(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            errors: error.details.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            })),
        });
    }
    next();
};
exports.validateProductMiddleware = validateProductMiddleware;
