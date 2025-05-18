"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_1 = require("../models/product");
const productvalidation_1 = require("../validations/productvalidation");
const BaseController_1 = require("./BaseController");
class ProductController extends BaseController_1.BaseController {
    static getProducts(filter, sorting) {
        throw new Error("Method not implemented.");
    }
    static getProductById(id) {
        throw new Error("Method not implemented.");
    }
    constructor() {
        super(product_1.Product);
    }
    // ✅ Get all products with filtering, sorting, and full-text search
    async getProducts(req, res) {
        try {
            const { sort, search, category } = req.query;
            let filter = {};
            let sorting = {};
            if (search)
                filter.$text = { $search: search };
            if (category)
                filter.category = category;
            if (sort) {
                const [field, order] = sort.split("_");
                sorting[field] = order === "asc" ? 1 : -1;
            }
            const products = await product_1.Product.find(filter).sort(sorting);
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    // ✅ Get a product by ID
    async getProductById(req, res) {
        try {
            const product = await product_1.Product.findById(req.params.id);
            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }
            res.json(product);
        }
        catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    // ✅ Create product with validation (supports addOns)
    async create(req, res) {
        try {
            // ✅ Parse addOns from string if present
            if (typeof req.body.addOns === "string") {
                try {
                    req.body.addOns = JSON.parse(req.body.addOns);
                }
                catch (e) {
                    req.body.addOns = [];
                }
            }
            const { error, value: payload } = (0, productvalidation_1.validateProductData)(req.body);
            if (error) {
                res.status(400).json({ message: error.details.map((err) => err.message) });
                return;
            }
            const existingProduct = await product_1.Product.findOne({ name: payload.name });
            if (existingProduct) {
                res.status(400).json({ message: "Product name already exists" });
                return;
            }
            req.body = payload;
            await super.create(req, res);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    // ✅ Update product with validation (supports addOns)
    async update(req, res) {
        try {
            // ✅ Parse addOns from string if present
            if (typeof req.body.addOns === "string") {
                try {
                    req.body.addOns = JSON.parse(req.body.addOns);
                }
                catch (e) {
                    req.body.addOns = [];
                }
            }
            const { error, value: payload } = (0, productvalidation_1.validateProductData)(req.body);
            if (error) {
                res.status(400).json({ message: error.details.map((err) => err.message) });
                return;
            }
            const existingProduct = await product_1.Product.findOne({ name: payload.name, _id: { $ne: req.params.id } });
            if (existingProduct) {
                res.status(400).json({ message: "Product name already exists" });
                return;
            }
            req.body = payload;
            await super.update(req, res);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.ProductController = ProductController;
