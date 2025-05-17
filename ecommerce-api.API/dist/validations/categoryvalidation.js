"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCategoryMiddleware = exports.validateCategoryData = void 0;
const joi_1 = __importDefault(require("joi"));
// Define Joi validation schema
const categoryValidationSchema = joi_1.default.object({
    categoryName: joi_1.default.string().max(100).required().messages({
        "string.max": "Category name cannot exceed 100 characters",
        "any.required": "Category name is required",
    }),
    description: joi_1.default.string().max(500).optional().messages({
        "string.max": "Description cannot exceed 500 characters",
    }),
});
// ✅ Helper function to validate category data
const validateCategoryData = (data) => {
    return categoryValidationSchema.validate(data, { abortEarly: false });
};
exports.validateCategoryData = validateCategoryData;
// ✅ Middleware version for routes
const validateCategoryMiddleware = (req, res, next) => {
    const { error } = (0, exports.validateCategoryData)(req.body);
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
exports.validateCategoryMiddleware = validateCategoryMiddleware;
