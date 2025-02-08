import Joi from "joi"; // Import Joi validation library

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - supplierId
 *         - supplierName
 *         - contactInfo
 *         - address
 *       properties:
 *         supplierId:
 *           type: string
 *           maxLength: 30
 *           description: Supplier's unique identifier
 *           example: "SUP12345"
 *         supplierName:
 *           type: string
 *           maxLength: 100
 *           description: Supplier's name
 *           example: "ABC Suppliers"
 *         contactInfo:
 *           type: string
 *           maxLength: 50
 *           description: Supplier's contact information (e.g., phone number or email)
 *           example: "contact@abc.com"
 *         address:
 *           type: string
 *           maxLength: 200
 *           description: Supplier's address
 *           example: "123 Supplier St, Cityville, ABC"
 *     SupplierResponse:
 *       type: object
 *       properties:
 *         supplierId:
 *           type: string
 *           description: Supplier's unique identifier
 *         supplierName:
 *           type: string
 *         contactInfo:
 *           type: string
 *         address:
 *           type: string
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

// Define a validation schema for supplier data
const supplierValidationSchema = Joi.object({
  // Supplier ID validation
  // - Must be a string with a max length of 30 characters
  // - Required field
  supplierId: Joi.string().max(30).required().messages({
    "string.max": "Supplier ID cannot exceed 30 characters",
    "any.required": "Supplier ID is required",
  }),

  // Supplier Name validation
  // - Must be a string with a max length of 100 characters
  // - Required field
  supplierName: Joi.string().max(100).required().messages({
    "string.max": "Supplier name cannot exceed 100 characters",
    "any.required": "Supplier name is required",
  }),

  // Contact Info validation
  // - Must be a string with a max length of 50 characters
  // - Required field
  contactInfo: Joi.string().max(50).required().messages({
    "string.max": "Contact info cannot exceed 50 characters",
    "any.required": "Contact info is required",
  }),

  // Address validation
  // - Must be a string with a max length of 200 characters
  // - Required field
  address: Joi.string().max(200).required().messages({
    "string.max": "Address cannot exceed 200 characters",
    "any.required": "Address is required",
  }),
});

// Helper function to validate supplier data
// - Takes supplier data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for supplierData as it's raw input that needs validation
export const validateSupplier = (supplierData: any) => {
  return supplierValidationSchema.validate(supplierData, { abortEarly: false });
};