"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controllers/controller");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const inventoryvalidation_1 = require("../validations/inventoryvalidation");
const baseroutes_1 = require("./baseroutes");
const router = express_1.default.Router();
const inventoryController = new controller_1.InventoryController();
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
 *         - name
 *         - description
 *         - price
 *         - quantity
 *         - category
 *         - reorderLevel
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the inventory item
 *         description:
 *           type: string
 *           description: Description of the item
 *         quantity:
 *           type: integer
 *           description: Quantity of the item in stock
 *         price:
 *           type: number
 *           description: Price per unit
 *         category:
 *           type: string
 *           description: Category of the item
 *         supplier:
 *           type: string
 *           description: Supplier name (optional)
 *         reorderLevel:
 *           type: integer
 *           description: Reorder threshold level
 *     InventoryResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/InventoryItem'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *             status:
 *               type: string
 *               enum: [In Stock, Low Stock, Out of Stock]
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         pages:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /api/v1/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of inventory items
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
 *   post:
 *     summary: Add a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       201:
 *         description: Created inventory item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryResponse'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 * /api/v1/inventory/{id}:
 *   get:
 *     summary: Get inventory item by ID
 *     tags: [Inventory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Found inventory item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryResponse'
 *       404:
 *         description: Inventory item not found
 *
 *   put:
 *     summary: Update an inventory item
 *     tags: [Inventory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       200:
 *         description: Updated inventory item
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
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item deleted
 *       404:
 *         description: Item not found
 */
/**
* Apply versioning to category routes
 */
const apiVersionV1 = "v1";
const apiVersionV2 = "v2";
router.use(`/api/${apiVersionV1}/inventory`, authMiddleware_1.authMiddleware, (0, baseroutes_1.createBaseRoutes)(inventoryController));
router.use(`/api/${apiVersionV2}/inventory`, authMiddleware_1.authMiddleware, inventoryvalidation_1.validateInventoryMiddleware, (0, baseroutes_1.createBaseRoutes)(inventoryController));
exports.default = router;
