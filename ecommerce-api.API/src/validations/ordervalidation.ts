import Joi from "joi"; // Import Joi validation library


/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - orderId
 *         - productId
 *         - quantity
 *         - price
 *       properties:
 *         
 *     OrderResponse:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *         productId:
 *           type: string
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
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

// Define a validation schema for order detail data
const orderValidationSchema = Joi.object({
  // OrderDetail ID validation
  // - Must be a string with a max length of 30 characters
  // - Required field

  // Order ID validation
  // - Must be a string with a max length of 30 characters
  // - Required field
  orderId: Joi.string().max(30).required().messages({
    "string.max": "Order ID cannot exceed 30 characters",
    "any.required": "Order ID is required",
  }),

  // Product ID validation
  // - Must be a string with a max length of 30 characters
  // - Required field
  productId: Joi.string().max(30).required().messages({
    "string.max": "Product ID cannot exceed 30 characters",
    "any.required": "Product ID is required",
  }),

  // Quantity validation
  // - Must be an integer and greater than or equal to 1
  // - Required field
  quantity: Joi.number().integer().min(1).required().messages({
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),

  // Price validation
  // - Must be a number (floating-point)
  // - Required field
  price: Joi.number().positive().required().messages({
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),
});

// Helper function to validate order detail data
// - Takes order detail data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for orderDetailData as it's raw input that needs validation
export const validateOrder = (orderData: any) => {
  return orderValidationSchema.validate(orderData, { abortEarly: false });
};