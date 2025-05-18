"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const defaultMaterial_1 = require("../models/defaultMaterial");
const router = express_1.default.Router();
router.post("/default-materials", async (req, res) => {
    try {
        const material = await defaultMaterial_1.DefaultMaterial.create(req.body);
        res.status(201).json({ message: "Material added", data: material });
    }
    catch (err) {
        res.status(400).json({ message: "Failed to add material", error: err });
    }
});
exports.default = router;
