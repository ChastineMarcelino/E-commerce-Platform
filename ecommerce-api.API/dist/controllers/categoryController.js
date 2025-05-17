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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_1 = require("../models/category");
const categoryvalidation_1 = require("../validations/categoryvalidation");
const BaseController_1 = require("./BaseController");
class CategoryController extends BaseController_1.BaseController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield category_1.Category.find().sort({ createdAt: -1 });
                res.status(200).json(categories);
            }
            catch (error) {
                res.status(500).json({ message: "Server error", error: error.message });
            }
        });
    }
    constructor() {
        super(category_1.Category);
    }
    // Create a new category with validation
    create(req, res) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
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
                yield _super.create.call(this, req, res);
            }
            catch (error) {
                res.status(500).json({ message: "Server error", error: error.message });
            }
        });
    }
    // Update an existing category with validation
    update(req, res) {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
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
                yield _super.update.call(this, req, res);
            }
            catch (error) {
                res.status(500).json({ message: "Server error", error: error.message });
            }
        });
    }
}
exports.CategoryController = CategoryController;
