import express from "express";
import { ShipmentController } from "../controllers/shipmentController";
import { authMiddleware } from "../Middleware/authMiddleware";
import { createBaseRoutes } from "../routes/baseroutes"; 

// Initialize express Router
const router = express.Router();
const shipmentController = new ShipmentController();

/**
 * @swagger
 * tags:
 *   name: Shipment
 *   description: Shipment management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ShipmentItem:
 *       type: object
 *       required:
 *         - destination
 *         - status
 *         - shippedDate
 *       properties:
 *         destination:
 *           type: string
 *           description: Destination of the shipment
 *         status:
 *           type: string
 *           enum: [Pending, Shipped, Delivered, Canceled]
 *           description: Status of the shipment
 *         shippedDate:
 *           type: string
 *           format: date
 *           description: Date the shipment was shipped
 *     ShipmentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the shipment
 *         destination:
 *           type: string
 *           description: Destination of the shipment
 *         status:
 *           type: string
 *           enum: [Pending, Shipped, Delivered, Canceled]
 *           description: Current status of the shipment
 *         shippedDate:
 *           type: string
 *           format: date
 *           description: Date the shipment was shipped
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the shipment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the shipment was last updated
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
 */

/**
 * @swagger
 * /api/shipment:
 *   post:
 *     summary: Create a new shipment
 *     tags: [Shipment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShipmentItem'
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShipmentResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *   get:
 *     summary: Get all shipments
 *     tags: [Shipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of shipments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShipmentResponse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */

/**
 * @swagger
 * /api/shipment/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Shipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     responses:
 *       200:
 *         description: Shipment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShipmentResponse'
 *       404:
 *         description: Shipment not found
 *
 *   put:
 *     summary: Update shipment details
 *     tags: [Shipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered, Canceled]
 *               destination:
 *                 type: string
 *               shippedDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Shipment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShipmentResponse'
 *       404:
 *         description: Shipment not found
 *
 *   delete:
 *     summary: Delete shipment
 *     tags: [Shipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID
 *     responses:
 *       204:
 *         description: Shipment deleted successfully
 *       404:
 *         description: Shipment not found
 */

/**
 * Apply the base routes to shipment routes
 */
router.use("/api/v1/shipment", authMiddleware, createBaseRoutes(shipmentController));
router.use("/api/v2/shipment", authMiddleware, createBaseRoutes(shipmentController));
export default router;
