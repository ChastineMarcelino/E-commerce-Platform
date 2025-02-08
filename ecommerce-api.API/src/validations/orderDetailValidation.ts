import Joi from "joi"; // Import Joi validation library

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderDetail:
 *       type: object
 *       required:
 *         - OrderID
 *         - ProductID
 *         - Quantity
 *         - Price
 *       properties:
 *         OrderID:
 *           type: string
 *           description: Unique identifier for the order this detail belongs to
 *           example: "order12345"
 *         ProductID:
 *           type: string
 *           description: Unique identifier for the product
 *           example: "product12345"
 *         Quantity:
 *           type: integer
 *           description: Quantity of the product ordered
 *           example: 2
 *         Price:
 *           type: number
 *           description: Price per unit of the product
 *           example: 100.50
 *         TotalPrice:
 *           type: number
 *           description: Total price (Quantity * Price) for this order detail
 *           example: 201.00
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order detail was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order detail was last updated
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
const orderDetailValidationSchema = Joi.object({
  // OrderID validation
  // - Required field
  OrderID: Joi.string().required().messages({
    "any.required": "Order ID is required",
  }),

  // ProductID validation
  // - Required field
  ProductID: Joi.string().required().messages({
    "any.required": "Product ID is required",
  }),

  // Quantity validation
  // - Must be an integer
  // - Minimum value 1
  // - Required field
  Quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity should be a number",
    "number.min": "Quantity should be greater than or equal to 1",
    "any.required": "Quantity is required",
  }),

  // Price validation
  // - Must be a positive number
  // - Maximum of 2 decimal places
  // - Required field
  Price: Joi.number().precision(2).positive().required().messages({
    "number.base": "Price should be a positive number",
    "number.precision": "Price should have a maximum of 2 decimal places",
    "any.required": "Price is required",
  }),

  // TotalPrice validation (calculated field: Quantity * Price)
  TotalPrice: Joi.number().precision(2).positive().required().messages({
    "number.base": "TotalPrice should be a positive number",
    "any.required": "TotalPrice is required",
  }),
});

// Helper function to validate order detail data
// - Takes order detail data as input
// - Returns validation result with all errors (abortEarly: false)
export const validateOrderDetail = (orderDetailData: any) => {
  return orderDetailValidationSchema.validate(orderDetailData, { abortEarly: false });
};

export default orderDetailValidationSchema;
