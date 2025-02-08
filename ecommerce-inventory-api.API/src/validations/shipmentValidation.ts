import Joi from "joi"; // Import Joi validation library

/**
 * @swagger
 * components:
 *   schemas:
 *     Shipment:
 *       type: object
 *       required:
 *         - shipmentID
 *         - orderID
 *         - shipmentDate
 *         - shipmentMethod
 *         - trackingNumber
 *         - status
 *       properties:
 *         shipmentID:
 *           type: string
 *           description: Unique identifier for the shipment
 *           example: "SH12345"
 *         orderID:
 *           type: string
 *           description: Reference to the related order
 *           example: "ORD67890"
 *         shipmentDate:
 *           type: string
 *           format: date
 *           description: Date when the shipment was created or shipped
 *           example: "2024-11-18"
 *         shipmentMethod:
 *           type: string
 *           maxLength: 50
 *           description: Method used for shipment (e.g., "Air", "Ground")
 *           example: "Air"
 *         trackingNumber:
 *           type: string
 *           description: Tracking number for monitoring the shipment
 *           example: "1Z999AA10123456789"
 *         status:
 *           type: string
 *           maxLength: 50
 *           description: Current status of the shipment (e.g., "Shipped", "Delivered")
 *           example: "In Transit"
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

// Define a validation schema for shipment data
const shipmentValidationSchema = Joi.object({
  // Shipment ID validation
  shipmentId: Joi.string().required().messages({
    "any.required": "Shipment ID is required",
  }),

  // Order ID validation
  orderId: Joi.string().required().messages({
    "any.required": "Order ID is required",
  }),

  // Shipment Date validation
  shipmentDate: Joi.date().required().messages({
    "date.base": "Shipment date must be a valid date",
    "any.required": "Shipment date is required",
  }),

  // Shipment Method validation
  shipmentMethod: Joi.string().max(50).required().messages({
    "string.max": "Shipment method cannot exceed 50 characters",
    "any.required": "Shipment method is required",
  }),

  // Tracking Number validation
  trackingNumber: Joi.string().required().messages({
    "any.required": "Tracking number is required",
  }),

  // Status validation
  status: Joi.string().max(50).required().messages({
    "string.max": "Status cannot exceed 50 characters",
    "any.required": "Status is required",
  }),
});

// Helper function to validate shipment data
export const validateShipment = (shipmentData: any) => {
  return shipmentValidationSchema.validate(shipmentData, { abortEarly: false });
};

export default shipmentValidationSchema;
