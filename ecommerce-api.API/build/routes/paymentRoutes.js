"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const baseroutes_1 = require("../routes/baseroutes"); // Assuming createBaseRoutes is in utils
// Initialize express Router
const router = express_1.default.Router();
const paymentController = new paymentController_1.PaymentController();
/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment Management endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - PaymentID
 *         - OrderID
 *         - PaymentDate
 *         - PaymentMethod
 *         - PaymentAmount
 *       properties:
 *         PaymentID:
 *           type: string
 *           description: Unique identifier for the payment
 *         OrderID:
 *           type: string
 *           description: Foreign key linking to the Order
 *         PaymentDate:
 *           type: string
 *           format: date-time
 *           description: Date when the payment was made
 *         PaymentMethod:
 *           type: string
 *           description: Method of payment (e.g., GCash, Credit Card, etc.)
 *         PaymentAmount:
 *           type: number
 *           description: Amount paid for the order
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         PaymentID:
 *           type: string
 *           description: Unique identifier of the payment
 *         OrderID:
 *           type: string
 *           description: Foreign key linking to the Order
 *         PaymentDate:
 *           type: string
 *           format: date-time
 *           description: Date when the payment was made
 *         PaymentMethod:
 *           type: string
 *           description: Method of payment (e.g., GCash, Credit Card, etc.)
 *         PaymentAmount:
 *           type: number
 *           description: Amount paid for the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the payment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the payment details were last updated
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
 *                 description: The field that caused the validation error
 *               message:
 *                 type: string
 *                 description: Details about the validation error
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Add a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentResponse'
 *
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       404:
 *         description: Payment not found
 *
 *   put:
 *     summary: Update payment details
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       404:
 *         description: Payment not found
 *
 *   delete:
 *     summary: Delete payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       204:
 *         description: Payment deleted successfully
 *       404:
 *         description: Payment not found
 */
/**
 * Apply the base routes to payment routes
 */
router.use("/api/v1/payments", authMiddleware_1.authMiddleware, (0, baseroutes_1.createBaseRoutes)(paymentController));
router.use("/api/v2/payments", authMiddleware_1.authMiddleware, (0, baseroutes_1.createBaseRoutes)(paymentController));
exports.default = router;
