import express from "express";
import { InventoryController } from "../controllers/controller";
import { authMiddleware } from "../Middleware/authMiddleware";
import { createBaseRoutes } from "../routes/baseroutes";  // Assuming createBaseRoutes is in utils

// Initialize express Router
const router = express.Router();
const inventoryController = new InventoryController();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory Management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItem:
 *       type: object
 *       required:
 *         - itemName
 *         - description
 *         - price
 *         - stockQuantity
 *       properties:
 *         itemName:
 *           type: string
 *           description: Name of the inventory item
 *         description:
 *           type: string
 *           description: Detailed description of the inventory item
 *         price:
 *           type: number
 *           description: Price of the inventory item
 *         stockQuantity:
 *           type: integer
 *           description: Available stock for the inventory item
 *     InventoryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the inventory item
 *         itemName:
 *           type: string
 *           description: Name of the inventory item
 *         description:
 *           type: string
 *           description: Detailed description of the inventory item
 *         price:
 *           type: number
 *           description: Price of the inventory item
 *         stockQuantity:
 *           type: integer
 *           description: Available stock for the inventory item
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the item was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the item was last updated
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
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total number of items
 *         pages:
 *           type: integer
 *           description: Total number of pages for pagination
 *         page:
 *           type: integer
 *           description: Current page number
 *         limit:
 *           type: integer
 *           description: Number of items per page
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Add a new inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       201:
 *         description: Inventory item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
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
 *         description: List of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *
 * /api/inventory/{id}:
 *   get:
 *     summary: Get inventory item by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     responses:
 *       200:
 *         description: Inventory item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryResponse'
 *       404:
 *         description: Inventory item not found
 *
 *   put:
 *     summary: Update inventory item details
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryResponse'
 *       404:
 *         description: Inventory item not found
 *
 *   delete:
 *     summary: Delete inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     responses:
 *       204:
 *         description: Inventory item deleted successfully
 *       404:
 *         description: Inventory item not found
 */
/**
 * Apply the base routes to inventory routes
 */
router.use("/api/v1/inventory", authMiddleware, createBaseRoutes(inventoryController));
router.use("/api/v2/inventory", authMiddleware, createBaseRoutes(inventoryController));
export default router;
