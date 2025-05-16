import express, { Request } from "express";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../Middleware/authMiddleware";
import { createBaseRoutes } from "../routes/baseroutes";
import { ProductController } from "../controllers/productController";
import { validateProductMiddleware } from "../validations/productvalidation";

const router = express.Router();
const productController = new ProductController();

const apiVersionV1 = "v1";
const apiVersionV2 = "v2";

// ✅ MULTER SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Replace spaces with dashes and lowercase the filename
    const sanitizedFilename = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  },
});



const upload = multer({ storage });
// Extend the Request type to include the 'file' property
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
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
router.get(`/api/${apiVersionV1}/product`, authMiddleware, async (req, res) => {
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
router.get(`/api/${apiVersionV1}/product/:id`, authMiddleware, async (req, res) => {
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


router.post(
  `/api/${apiVersionV1}/product`,
  authMiddleware,
  upload.single("image"), // ✅ multer handles file upload
  async (req: MulterRequest, res) => {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file?.filename}`;
    req.body.imageUrl = imageUrl;
    productController.create(req, res);
  }
);

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
router.put(
  `/api/${apiVersionV1}/product/:id`,
  authMiddleware,
  upload.single("image"), // ✅ Added multer support to PUT route
  async (req: MulterRequest, res) => {
    try {
      if (req.file) {
        req.body.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }
      productController.update(req, res);
    } catch (error) {
      console.error("❌ PUT Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Internal server error", error: errorMessage });
    }
  }
);

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
router.delete(`/api/${apiVersionV1}/product/:id`, authMiddleware, async (req, res) => {
  productController.delete(req, res);
});

// ✅ Version 2 routing
router.use(
  `/api/${apiVersionV2}/product`,
  authMiddleware,
  validateProductMiddleware,
  createBaseRoutes(productController)
);

export default router;
