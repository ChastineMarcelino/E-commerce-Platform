import Joi from "joi"; // Import Joi validation library

// Define a validation schema for permission data
const permissionValidationSchema = Joi.object({
  // Token ID validation
  // - Must be a string
  // - Required field
  token_id: Joi.string().required().messages({
    "any.required": "Token ID is required",
    "string.empty": "Token ID cannot be empty",
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
  casher: Joi.boolean().required().messages({
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

// Helper function to validate permission data
// - Takes permission data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for permissionData as it's raw input that needs validation
export const validatePermission = (permissionData: any) => {
  return permissionValidationSchema.validate(permissionData, { abortEarly: false });
};