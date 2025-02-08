import Joi from "joi"; // Import Joi validation library

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - paymentId
 *         - orderId
 *         - paymentDate
 *         - paymentMethod
 *         - paymentAmount
 *       properties:
 *         paymentId:
 *           type: string
 *           maxLength: 30
 *           description: Payment's unique identifier
 *           example: "PAY12345"
 *         orderId:
 *           type: string
 *           maxLength: 30
 *           description: The unique identifier of the related order
 *           example: "ORD123"
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           description: The date and time when the payment was made
 *           example: "2024-12-10T14:30:00Z"
 *         paymentMethod:
 *           type: string
 *           description: The method used for payment (e.g., credit card, PayPal, etc.)
 *           example: "Credit Card"
 *         paymentAmount:
 *           type: number
 *           format: float
 *           description: The amount of the payment
 *           example: 100.50
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         paymentId:
 *           type: string
 *           description: Payment's unique identifier
 *         orderId:
 *           type: string
 *         paymentDate:
 *           type: string
 *           format: date-time
 *         paymentMethod:
 *           type: string
 *         paymentAmount:
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

// Define a validation schema for payment data
const paymentValidationSchema = Joi.object({
  // Payment ID validation
  // - Must be a string with a max length of 30 characters
  // - Required field
  paymentId: Joi.string().max(30).required().messages({
    "string.max": "Payment ID cannot exceed 30 characters",
    "any.required": "Payment ID is required",
  }),

  // Order ID validation
  // - Must be a string with a max length of 30 characters
  // - Required field
  orderId: Joi.string().max(30).required().messages({
    "string.max": "Order ID cannot exceed 30 characters",
    "any.required": "Order ID is required",
  }),

  // Payment date validation
  // - Must be a valid date-time string
  // - Required field
  paymentDate: Joi.string().isoDate().required().messages({
    "string.isoDate": "Payment date must be a valid date-time string",
    "any.required": "Payment date is required",
  }),

  // Payment method validation
  // - Must be a string
  // - Required field
  paymentMethod: Joi.string().required().messages({
    "any.required": "Payment method is required",
  }),

  // Payment amount validation
  // - Must be a positive number (float)
  // - Required field
  paymentAmount: Joi.number().positive().required().messages({
    "number.positive": "Payment amount must be a positive number",
    "any.required": "Payment amount is required",
  }),
});

// Helper function to validate payment data
// - Takes payment data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for paymentData as it's raw input that needs validation
export const validatePayment = (paymentData: any) => {
  return paymentValidationSchema.validate(paymentData, { abortEarly: false });
};