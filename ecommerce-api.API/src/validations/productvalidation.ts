import Joi from "joi";
import { Request, Response, NextFunction } from "express";

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
const productValidationSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.max": "Product name cannot exceed 100 characters",
    "any.required": "Product name is required",
  }),

  description: Joi.string().max(500).required().messages({
    "string.max": "Description cannot exceed 500 characters",
    "any.required": "Description is required",
  }),

  category: Joi.string().max(50).required().messages({
    "string.max": "Category cannot exceed 50 characters",
    "any.required": "Category is required",
  }),

  medioPrice: Joi.number().greater(0).required().messages({
    "number.base": "Medio price must be a valid number",
    "number.greater": "Medio price must be greater than 0",
    "any.required": "Medio price is required",
  }),

  grandePrice: Joi.number().greater(0).required().messages({
    "number.base": "Grande price must be a valid number",
    "number.greater": "Grande price must be greater than 0",
    "any.required": "Grande price is required",
  }),

  inStock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock quantity must be a valid number",
    "number.min": "Stock quantity cannot be less than 0",
    "any.required": "Stock quantity is required",
  }),
  addOns: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Add-ons must be an array of strings'
  }),
});

// ✅ Allow unknown fields (like id, image, imageUrl, price)
export const validateProductData = (data: any) => {
  return productValidationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true, // ✅ Prevents 400 for extra frontend fields
  });
};

// ✅ Middleware for routes
export const validateProductMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateProductData(req.body);

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
