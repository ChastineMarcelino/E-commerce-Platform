import express from "express";
import { getMyOrders, OrderController } from "../controllers/orderController";
import { authMiddleware } from "../Middleware/authMiddleware";
import { createBaseRoutes } from "../routes/baseroutes"; // Assuming createBaseRoutes is in routes
import { Order } from "../models/order";

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
router.get('/order/my-orders', authMiddleware, getMyOrders);

// ✅ PATCH order status - /api/v1/order/:id/status
router.patch('/order/:id/status', authMiddleware, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).send('Order not found');
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update status', error: err });
  }
});

// ✅ PUT to update order fully - /api/v1/order/:id
router.put('/order/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          quantity: req.body.quantity,
          size: req.body.size,
          sugarLevel: req.body.sugarLevel,
          addOns: req.body.addOns,
          status: req.body.status,
          updatedAt: req.body.updatedAt
        }
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Update failed', error: err });
  }
});
router.get("/admin/orders", authMiddleware, async (req: any, res) => {
  try {
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders", error });
  }
});

// ✅ Base controller routes: /api/v1/order (POST, GET all, GET by id, DELETE)
router.use("/order", authMiddleware, createBaseRoutes(orderController));

export default router;
