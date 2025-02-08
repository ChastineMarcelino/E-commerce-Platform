import express from "express";
import { OrderController } from "../controllers/orderController";
import { authMiddleware } from "../Middleware/authMiddleware";
import { createBaseRoutes } from "../routes/baseroutes"; // Assuming createBaseRoutes is in utils

// Initialize express Router
const router = express.Router();
const orderController = new OrderController();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order Management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - OrderID
 *         - ProductID
 *         - Quantity
 *         - Price
 *       properties:
 *         OrderID:
 *           type: string
 *           description: Unique identifier for the order detail
 *         ProductID:
 *           type: string
 *           description: Foreign key linking to the Product
 *         Quantity:
 *           type: integer
 *           description: Quantity of the product in the order
 *         Price:
 *           type: number
 *           description: Price per unit of the product
 *     OrderResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the order detail
 *         OrderID:
 *           type: string
 *           description: Foreign key linking to the Order
 *         ProductID:
 *           type: string
 *           description: Foreign key linking to the Product
 *         Quantity:
 *           type: integer
 *           description: Quantity of the product in the order
 *         Price:
 *           type: number
 *           description: Price per unit of the product
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
 * /api/order:
 *   post:
 *     summary: Add a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *   get:
 *     summary: Get all order 
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of order 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderResponse'
 *
 * /api/order/{id}:
 *   get:
 *     summary: Get order  by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order  ID
 *     responses:
 *       200:
 *         description: Order  
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       404:
 *         description: Order  not found
 *
 *   put:
 *     summary: Update order 
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       404:
 *         description: Order detail not found
 *
 *   delete:
 *     summary: Delete order 
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: OrderID
 *     responses:
 *       204:
 *         description: Order detail deleted successfully
 *       404:
 *         description: Order detail not found
 */

/**
 * Apply the base routes to order routes
 */
router.use("/api/v1/order", authMiddleware, createBaseRoutes(orderController));
router.use("/api/v2/order", authMiddleware, createBaseRoutes(orderController));
export default router;
