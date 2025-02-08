import express from "express";
import { SupplierController } from "../controllers/supplierController";
import { authMiddleware } from "../Middleware/authMiddleware";
import { createBaseRoutes } from "../routes/baseroutes"; // Assuming createBaseRoutes is in utils

// Initialize express Router
const router = express.Router();
const supplierController = new SupplierController();

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Supplier Management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - SupplierID
 *         - SupplierName
 *         - ContactInfo
 *         - Address
 *       properties:
 *         SupplierID:
 *           type: string
 *           description: Unique identifier for the supplier
 *         SupplierName:
 *           type: string
 *           description: Name of the supplier
 *         ContactInfo:
 *           type: string
 *           description: Contact information (e.g., phone number or email)
 *         Address:
 *           type: string
 *           description: Physical address of the supplier
 *     SupplierResponse:
 *       type: object
 *       properties:
 *         SupplierID:
 *           type: string
 *           description: Unique identifier of the supplier
 *         SupplierName:
 *           type: string
 *           description: Name of the supplier
 *         ContactInfo:
 *           type: string
 *           description: Contact information (e.g., phone number or email)
 *         Address:
 *           type: string
 *           description: Physical address of the supplier
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the supplier was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the supplier details were last updated
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
 * /api/suppliers:
 *   post:
 *     summary: Add a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SupplierResponse'
 *
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierResponse'
 *       404:
 *         description: Supplier not found
 *
 *   put:
 *     summary: Update supplier details
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierResponse'
 *       404:
 *         description: Supplier not found
 *
 *   delete:
 *     summary: Delete supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       204:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 */

/**
 * Apply the base routes to supplier routes
 */
router.use("/api/v1/suppliers", authMiddleware, createBaseRoutes(supplierController));
router.use("/api/v2/suppliers", authMiddleware, createBaseRoutes(supplierController));
export default router;
