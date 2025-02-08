import Joi from "joi"; // Import Joi validation library

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
 *           example: "P12345"
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Name of the product
 *           example: "Wireless Mouse"
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Detailed description of the product
 *           example: "A compact and reliable wireless mouse with ergonomic design."
 *         category:
 *           type: string
 *           maxLength: 50
 *           description: Category the product belongs to
 *           example: "Electronics"
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the product
 *           example: 29.99
 *         stockQuantity:
 *           type: integer
 *           description: Quantity of the product available in stock
 *           example: 150
 *         supplierID:
 *           type: string
 *           description: Reference to the supplier providing the product
 *           example: "SUP45678"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp for when the product was added
 *           example: "2024-11-18T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp for when the product details were last updated
 *           example: "2024-11-20T15:45:12Z"
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

// Define a validation schema for product data
const productValidationSchema = Joi.object({


  // Name validation
  name: Joi.string().max(100).required().messages({
    "string.max": "Product name cannot exceed 100 characters",
    "any.required": "Product name is required",
  }),

  // Description validation
  description: Joi.string().max(500).required().messages({
    "string.max": "Description cannot exceed 500 characters",
    "any.required": "Description is required",
  }),

  // Category validation
  categoryId: Joi.string().max(50).required().messages({
    "string.max": "Category cannot exceed 50 characters",
    "any.required": "Category is required",
  }),

  // Price validation
  price: Joi.number().greater(0).required().messages({
    "number.base": "Price must be a valid number",
    "number.greater": "Price must be greater than 0",
    "any.required": "Price is required",
  }),

  // Stock Quantity validation
  stockQuantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock quantity must be a valid number",
    "number.min": "Stock quantity cannot be less than 0",
    "any.required": "Stock quantity is required",
  }),

  // Supplier ID validation
  supplierId: Joi.string().required().messages({
    "any.required": "Supplier ID is required",
  }),
});

// Helper function to validate product data
export const validateProduct = (productData: any) => {
  return productValidationSchema.validate(productData, { abortEarly: false });
};

export default productValidationSchema;