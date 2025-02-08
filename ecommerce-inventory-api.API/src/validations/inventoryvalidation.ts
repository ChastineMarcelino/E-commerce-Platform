import Joi from "joi"; // Import Joi validation library

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItem:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Name of the inventory item
 *           example: "Wireless Mouse"
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           description: Quantity of the item in stock
 *           example: 150
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Price per unit of the item
 *           example: 29.99
 *         category:
 *           type: string
 *           maxLength: 50
 *           description: Category the item belongs to
 *           example: "Electronics"
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Brief description of the item
 *           example: "A high-quality wireless mouse with ergonomic design."
 *         supplier:
 *           type: string
 *           maxLength: 100
 *           description: Supplier of the item (optional)
 *           example: "Tech Supplies Co."
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

// Define a validation schema for inventory item data
const inventoryValidationSchema = Joi.object({
  // Item name validation
  name: Joi.string().trim().max(100).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),

  // Quantity validation
  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity cannot be less than 0",
    "any.required": "Quantity is required",
  }),

  // Price validation
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be less than 0",
    "any.required": "Price is required",
  }),

  // Category validation
  category: Joi.string().trim().max(50).required().messages({
    "string.base": "Category must be a string",
    "string.empty": "Category cannot be empty",
    "string.max": "Category cannot exceed 50 characters",
    "any.required": "Category is required",
  }),

  // Description validation (optional field)
  description: Joi.string().trim().max(500).optional().messages({
    "string.base": "Description must be a string",
    "string.max": "Description cannot exceed 500 characters",
  }),

  // Supplier validation (optional field)
  supplier: Joi.string().trim().max(100).optional().messages({
    "string.base": "Supplier must be a string",
    "string.max": "Supplier cannot exceed 100 characters",
  }),
});

// Helper function to validate inventory item data
export const validateInventoryItem = (itemData: any) => {
  const { error, value } = inventoryValidationSchema.validate(itemData, {
    abortEarly: false, // Report all validation errors
    stripUnknown: true, // Remove unknown keys from the input
  });

  return { error, value };
};

export default inventoryValidationSchema;
