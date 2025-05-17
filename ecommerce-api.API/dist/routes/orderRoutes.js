"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const baseroutes_1 = require("../routes/baseroutes"); // Assuming createBaseRoutes is in routes
const order_1 = require("../models/order");
const router = express_1.default.Router();
const orderController = new orderController_1.OrderController();
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
 *         - product
 *         - quantity
 *         - size
 *       properties:
 *         product:
 *           type: string
 *           description: Name of the product
 *         image:
 *           type: string
 *           description: Image URL of the product
 *         sugarLevel:
 *           type: string
 *           description: Selected sugar level (e.g., 25%, 50%, 100%)
 *         size:
 *           type: string
 *           description: Size of the product (e.g., 16oz, 22oz)
 *         quantity:
 *           type: integer
 *           description: Quantity ordered
 *         addOns:
 *           type: array
 *           items:
 *             type: string
 *           description: Optional add-ons
 *         status:
 *           type: string
 *           enum: [Pending, Done]
 *           default: Pending
 *         date:
 *           type: string
 *           format: date-time
 *           description: Order placement date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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
 *               message:
 *                 type: string
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /api/v1/order:
 *   post:
 *     summary: Place a new order
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
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *
 * /api/v1/order/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *
 *   put:
 *     summary: Update an order (e.g. mark as done)
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
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
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *
 *   delete:
 *     summary: Delete an order
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
// ✅ Special route: GET /api/v1/my-orders
router.get('/order/my-orders', authMiddleware_1.authMiddleware, orderController_1.getMyOrders);
// ✅ PATCH order status - /api/v1/order/:id/status
router.patch('/order/:id/status', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedOrder = yield order_1.Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!updatedOrder)
            return res.status(404).send('Order not found');
        res.json(updatedOrder);
    }
    catch (err) {
        res.status(400).json({ message: 'Failed to update status', error: err });
    }
}));
// ✅ PUT to update order fully - /api/v1/order/:id
router.put('/order/:id', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield order_1.Order.findByIdAndUpdate(req.params.id, {
            $set: {
                quantity: req.body.quantity,
                size: req.body.size,
                sugarLevel: req.body.sugarLevel,
                addOns: req.body.addOns,
                status: req.body.status,
                updatedAt: req.body.updatedAt
            }
        }, { new: true });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Update failed', error: err });
    }
}));
router.get("/admin/orders", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.userRole !== 'ADMIN') {
            return res.status(403).json({ message: "Access denied" });
        }
        const orders = yield order_1.Order.find().sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching all orders", error });
    }
}));
// ✅ Base controller routes: /api/v1/order (POST, GET all, GET by id, DELETE)
router.use("/order", authMiddleware_1.authMiddleware, (0, baseroutes_1.createBaseRoutes)(orderController));
exports.default = router;
