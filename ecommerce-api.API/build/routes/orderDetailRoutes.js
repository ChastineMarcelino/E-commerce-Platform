"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderdetailController_1 = require("../controllers/orderdetailController");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const baseroutes_1 = require("../routes/baseroutes"); // Assuming createBaseRoutes is in utils
// Initialize express Router
const router = express_1.default.Router();
const orderDetailController = new orderdetailController_1.OrderDetailController();
/**
 * @swagger
 * tags:
 *   name: OrderDetail
 *   description: Order Detail Management endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderDetail:
 *       type: object
 *       required:
 *         - orderId
 *         - productId
 *         - quantity
 *         - price
 *       properties:
 *         orderId:
 *           type: string
 *           description: Unique identifier for the order
 *         productId:
 *           type: string
 *           description: Foreign key, links to the Product
 *         quantity:
 *           type: integer
 *           description: Quantity of the product in the order
 *         price:
 *           type: number
 *           description: Price of the product
 *         totalPrice:
 *           type: number
 *           description: Total price for the quantity of product
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order detail was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order detail was last updated
 */
/**
 * @swagger
 * /api/orderdetails:
 *   post:
 *     summary: Add a new order detail
 *     tags: [OrderDetail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDetail'
 *     responses:
 *       201:
 *         description: Order detail created successfully
 *       400:
 *         description: Validation error
 *
 *   get:
 *     summary: Get all order details
 *     tags: [OrderDetail]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of order details
 */
/**
 * @swagger
 * /api/orderdetails/{id}:
 *   get:
 *     summary: Get order detail by ID
 *     tags: [OrderDetail]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order detail ID
 *     responses:
 *       200:
 *         description: Order detail found
 *       404:
 *         description: Order detail not found
 *
 *   put:
 *     summary: Update order detail
 *     tags: [OrderDetail]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order detail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDetail'
 *     responses:
 *       200:
 *         description: Order detail updated successfully
 *       404:
 *         description: Order detail not found
 *
 *   delete:
 *     summary: Delete order detail
 *     tags: [OrderDetail]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order detail ID
 *     responses:
 *       204:
 *         description: Order detail deleted successfully
 *       404:
 *         description: Order detail not found
 */
/**
 * Apply the base routes to order detail routes
 */
router.use("/api/v1/orderdetails", authMiddleware_1.authMiddleware, (0, baseroutes_1.createBaseRoutes)(orderDetailController));
router.use("/api/v2/orderdetails", authMiddleware_1.authMiddleware, (0, baseroutes_1.createBaseRoutes)(orderDetailController));
exports.default = router;
