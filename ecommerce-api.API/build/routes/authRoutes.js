"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController")); // ✅ Ensure correct import
const auditTrailMiddleware_1 = require("../Middleware/auditTrailMiddleware");
const authMiddleware_1 = require("../Middleware/authMiddleware"); // ✅ Protect logout
const authController_2 = __importDefault(require("../controllers/authController"));
const router = (0, express_1.Router)();
// ✅ Correct way to call instance methods (No `.bind(AuthController)`)
router.post("/register", auditTrailMiddleware_1.auditTrailMiddleware, (req, res) => authController_1.default.register(req, res));
router.post("/verify-otp", auditTrailMiddleware_1.auditTrailMiddleware, (req, res) => authController_1.default.verifyOTPHandler(req, res));
router.post("/login", auditTrailMiddleware_1.auditTrailMiddleware, (req, res) => authController_1.default.login(req, res));
router.post("/verify-old-password", authController_2.default.verifyOldPasswordBeforeReset);
router.post("/forgot-password", authController_1.default.forgotPassword);
router.post("/resend-otp", auditTrailMiddleware_1.auditTrailMiddleware, (req, res) => authController_1.default.resendOTPHandler(req, res));
router.post("/api/auth/refresh-token", authController_2.default.refreshToken);
router.post("/logout", authMiddleware_1.authMiddleware, auditTrailMiddleware_1.auditTrailMiddleware, (req, res) => authController_1.default.logout(req, res));
exports.default = router;
