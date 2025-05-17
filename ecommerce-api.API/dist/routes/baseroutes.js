"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auditTrailMiddleware_1 = require("../Middleware/auditTrailMiddleware");
const createBaseRoutes = (controller) => {
    const router = express_1.default.Router();
    router.post("/", auditTrailMiddleware_1.auditTrailMiddleware, controller.create.bind(controller));
    router.get("/", controller.read.bind(controller));
    router.get("/:id", auditTrailMiddleware_1.auditTrailMiddleware, controller.readById.bind(controller));
    router.put("/:id", auditTrailMiddleware_1.auditTrailMiddleware, controller.update.bind(controller));
    router.delete("/:id", auditTrailMiddleware_1.auditTrailMiddleware, controller.delete.bind(controller));
    return router;
};
exports.createBaseRoutes = createBaseRoutes;
