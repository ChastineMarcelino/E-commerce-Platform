"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const authMiddleware_1 = require("../Middleware/authMiddleware");
const baseroutes_1 = require("../routes/baseroutes");
const productController_1 = require("../controllers/productController");
const productvalidation_1 = require("../validations/productvalidation");
const router = express_1.default.Router();
const productController = new productController_1.ProductController();
const apiVersionV1 = "v1";
const apiVersionV2 = "v2";
// ✅ MULTER SETUP
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // Replace spaces with dashes and lowercase the filename
        const sanitizedFilename = file.originalname.replace(/\s+/g, '-').toLowerCase();
        cb(null, `${Date.now()}-${sanitizedFilename}`);
    },
});
const upload = (0, multer_1.default)({ storage });
/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product Management endpoints
 */
/**
 * @swagger
 * /api/{version}/product:
 *   get:
 *     summary: Get all products with sorting and filtering
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: price_asc
 *         description: Sort products by price_asc, price_desc, name_asc, etc.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search by product name or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductResponse'
 */
router.get(`/api/${apiVersionV1}/product`, authMiddleware_1.authMiddleware, async (req, res) => {
    productController.getProducts(req, res);
});
/**
 * @swagger
 * /api/{version}/product/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 */
router.get(`/api/${apiVersionV1}/product/:id`, authMiddleware_1.authMiddleware, async (req, res) => {
    productController.getProductById(req, res);
});
/**
 * @swagger
 * /api/{version}/product:
 *   post:
 *     summary: Add a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - medioPrice
 *               - grandePrice
 *               - inStock
 *               - category
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               medioPrice:
 *                 type: number
 *               grandePrice:
 *                 type: number
 *               inStock:
 *                 type: integer
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post(`/api/${apiVersionV1}/product`, authMiddleware_1.authMiddleware, upload.single("image"), // ✅ multer handles file upload
async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file?.filename}`;
    req.body.imageUrl = imageUrl;
    productController.create(req, res);
});
/**
 * @swagger
 * /api/{version}/product/{id}:
 *   put:
 *     summary: Update product details
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductItem'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 */
router.put(`/api/${apiVersionV1}/product/:id`, authMiddleware_1.authMiddleware, upload.single("image"), // ✅ Added multer support to PUT route
async (req, res) => {
    try {
        if (req.file) {
            req.body.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }
        productController.update(req, res);
    }
    catch (error) {
        console.error("❌ PUT Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Internal server error", error: errorMessage });
    }
});
/**
 * @swagger
 * /api/{version}/product/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(`/api/${apiVersionV1}/product/:id`, authMiddleware_1.authMiddleware, async (req, res) => {
    productController.delete(req, res);
});
// ✅ Version 2 routing
router.use(`/api/${apiVersionV2}/product`, authMiddleware_1.authMiddleware, productvalidation_1.validateProductMiddleware, (0, baseroutes_1.createBaseRoutes)(productController));
exports.default = router;
