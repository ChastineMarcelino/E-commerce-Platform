"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoles = void 0;
const joi_1 = __importDefault(require("joi")); // Import Joi validation library
// Define a validation schema for roles data
const rolesValidationSchema = joi_1.default.object({
    // Role ID validation
    // - Must be a string
    // - Required field
    role_id: joi_1.default.string().required().messages({
        "any.required": "Role ID is required",
        "string.empty": "Role ID cannot be empty",
    }),
    // Manager validation
    // - Must be a boolean (true/false)
    // - Required field
    manager: joi_1.default.boolean().required().messages({
        "any.required": "Manager status is required",
        "boolean.base": "Manager must be a boolean value",
    }),
    // Casher validation
    // - Must be a boolean (true/false)
    // - Required field
    cashier: joi_1.default.boolean().required().messages({
        "any.required": "Casher status is required",
        "boolean.base": "Casher must be a boolean value",
    }),
    // Guest User validation
    // - Must be a boolean (true/false)
    // - Required field
    guess_user: joi_1.default.boolean().required().messages({
        "any.required": "Guest user status is required",
        "boolean.base": "Guest user must be a boolean value",
    }),
});
// Helper function to validate roles data
// - Takes roles data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for rolesData as it's raw input that needs validation
const validateRoles = (rolesData) => {
    return rolesValidationSchema.validate(rolesData, { abortEarly: false });
};
exports.validateRoles = validateRoles;
