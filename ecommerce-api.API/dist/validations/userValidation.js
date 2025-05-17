"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi")); // Import Joi validation library
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - address
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: User's password (min 8 chars, must contain uppercase, lowercase, number, special char)
 *           example: "Pass123!@#"
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: "John Doe"
 *         address:
 *           type: string
 *           description: Address of the user
 *           example: "123 Main St, City, Country"
 *         role_id:
 *           type: string
 *           description: Role assigned to the user (e.g., ADMIN, CASHIER)
 *           example: "CASHIER"
 *         status:
 *           type: string
 *           enum: ["Pending", "Active", "Disabled"]
 *           description: User account status
 *           example: "Pending"
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User's unique identifier
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         role_id:
 *           type: string
 *         status:
 *           type: string
 *           enum: ["Pending", "Active", "Disabled"]
 *         createdAt:
 *           type: string
 *           format: date-time
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
// ✅ Define a validation schema for user data
const userValidationSchema = joi_1.default.object({
    // Email validation
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    // Password validation
    password: joi_1.default.string()
        .min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
        .required()
        .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required",
    }),
    // Name validation (required)
    name: joi_1.default.string().min(3).max(100).required().messages({
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name cannot be more than 100 characters",
        "any.required": "Name is required",
    }),
    // Address validation (required)
    address: joi_1.default.string().min(5).max(255).required().messages({
        "string.min": "Address must be at least 5 characters long",
        "string.max": "Address cannot be more than 255 characters",
        "any.required": "Address is required",
    }),
    // Role validation (optional, required for approved users)
    role_id: joi_1.default.string().valid("ADMIN", "CASHIER", "KITCHEN", "DELIVERY").optional().messages({
        "any.only": "Invalid role. Must be ADMIN, CASHIER, KITCHEN, or DELIVERY",
    }),
    // Status validation (must be one of the allowed values)
    status: joi_1.default.string()
        .valid("Pending", "Active", "Disabled")
        .default("Pending")
        .messages({
        "any.only": "Invalid status. Must be Pending, Active, or Disabled",
    }),
});
// ✅ Helper function to validate user data
const validateUser = (userData) => {
    return userValidationSchema.validate(userData, { abortEarly: false });
};
exports.validateUser = validateUser;
