import Joi from "joi";
import { Request, Response, NextFunction } from "express";

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
 *         - reorderLevel
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
 *         supplier:
 *           type: string
 *           maxLength: 100
 *           description: Supplier of the item (optional)
 *           example: "Tech Supplies Co."
 *         reorderLevel:
 *           type: integer
 *           minimum: 0
 *           description: Minimum stock level before reorder is needed
 *           example: 10
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 */

// 🧪 Define the validation schema
const inventoryValidationSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),

  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity cannot be less than 0",
    "any.required": "Quantity is required",
  }),

  unit: Joi.string().trim().max(50).required().messages({
    "string.base": "Unit must be a string",
    "string.empty": "Unit is required",
    "string.max": "Unit cannot exceed 50 characters",
    "any.required": "Unit is required"
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be less than 0",
    "any.required": "Price is required",
  }),

  category: Joi.string().trim().max(50).required().messages({
    "string.base": "Category must be a string",
    "string.empty": "Category cannot be empty",
    "string.max": "Category cannot exceed 50 characters",
    "any.required": "Category is required",
  }),


  supplier: Joi.string().trim().max(100).optional().messages({
    "string.base": "Supplier must be a string",
    "string.max": "Supplier cannot exceed 100 characters",
  }),

  reorderLevel: Joi.number().integer().min(0).required().messages({
    "number.base": "Reorder level must be a number",
    "number.integer": "Reorder level must be an integer",
    "number.min": "Reorder level cannot be less than 0",
    "any.required": "Reorder level is required",
  }),
});

// ✅ Function to validate the data (used in controller)
export const validateInventoryData = (data: any) => {
  return inventoryValidationSchema.validate(data, { abortEarly: false });
};

// ✅ Middleware for route-level validation
export const validateInventoryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateInventoryData(req.body);

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
