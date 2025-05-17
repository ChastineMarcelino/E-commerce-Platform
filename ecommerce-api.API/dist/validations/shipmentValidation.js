"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateShipment = void 0;
const joi_1 = __importDefault(require("joi")); // Import Joi validation library
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
const shipmentValidationSchema = joi_1.default.object({
    // Shipment ID validation
    shipmentId: joi_1.default.string().required().messages({
        "any.required": "Shipment ID is required",
    }),
    // Order ID validation
    orderId: joi_1.default.string().required().messages({
        "any.required": "Order ID is required",
    }),
    // Shipment Date validation
    shipmentDate: joi_1.default.date().required().messages({
        "date.base": "Shipment date must be a valid date",
        "any.required": "Shipment date is required",
    }),
    // Shipment Method validation
    shipmentMethod: joi_1.default.string().max(50).required().messages({
        "string.max": "Shipment method cannot exceed 50 characters",
        "any.required": "Shipment method is required",
    }),
    // Tracking Number validation
    trackingNumber: joi_1.default.string().required().messages({
        "any.required": "Tracking number is required",
    }),
    // Status validation
    status: joi_1.default.string().max(50).required().messages({
        "string.max": "Status cannot exceed 50 characters",
        "any.required": "Status is required",
    }),
});
// Helper function to validate shipment data
const validateShipment = (shipmentData) => {
    return shipmentValidationSchema.validate(shipmentData, { abortEarly: false });
};
exports.validateShipment = validateShipment;
exports.default = shipmentValidationSchema;
