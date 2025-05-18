"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_1 = require("../models/category");
const categoryvalidation_1 = require("../validations/categoryvalidation");
const BaseController_1 = require("./BaseController");
class CategoryController extends BaseController_1.BaseController {
    async get(req, res) {
        try {
            const categories = await category_1.Category.find().sort({ createdAt: -1 });
            res.status(200).json(categories);
        }
        catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    constructor() {
        super(category_1.Category);
    }
    // Create a new category with validation
    async create(req, res) {
        try {
            const { error, value: payload } = (0, categoryvalidation_1.validateCategoryData)(req.body);
            if (error) {
                res.status(400).json({
                    message: "Validation error",
                    errors: error.details.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
                return;
            }
            req.body = payload; // Ensure validated payload is used
            await super.create(req, res);
        }
        catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    // Update an existing category with validation
    async update(req, res) {
        try {
            const { error, value: payload } = (0, categoryvalidation_1.validateCategoryData)(req.body);
            if (error) {
                res.status(400).json({
                    message: "Validation error",
                    errors: error.details.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
                return;
            }
            req.body = payload; // Ensure validated payload is used
            await super.update(req, res);
        }
        catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}
exports.CategoryController = CategoryController;
