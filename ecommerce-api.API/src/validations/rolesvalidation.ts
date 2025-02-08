import Joi from "joi"; // Import Joi validation library
import { AnyKeys } from "mongoose";

// Define a validation schema for roles data
const rolesValidationSchema = Joi.object({
  // Role ID validation
  // - Must be a string
  // - Required field
  role_id: Joi.string().required().messages({
    "any.required": "Role ID is required",
    "string.empty": "Role ID cannot be empty",
  }),

  // Manager validation
  // - Must be a boolean (true/false)
  // - Required field
  manager: Joi.boolean().required().messages({
    "any.required": "Manager status is required",
    "boolean.base": "Manager must be a boolean value",
  }),

  // Casher validation
  // - Must be a boolean (true/false)
  // - Required field
  cashier: Joi.boolean().required().messages({
    "any.required": "Casher status is required",
    "boolean.base": "Casher must be a boolean value",
  }),

  // Guest User validation
  // - Must be a boolean (true/false)
  // - Required field
  guess_user: Joi.boolean().required().messages({
    "any.required": "Guest user status is required",
    "boolean.base": "Guest user must be a boolean value",
  }),
});

// Helper function to validate roles data
// - Takes roles data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for rolesData as it's raw input that needs validation
export const validateRoles = (rolesData: any) => {
  return rolesValidationSchema.validate(rolesData, { abortEarly: false });
};