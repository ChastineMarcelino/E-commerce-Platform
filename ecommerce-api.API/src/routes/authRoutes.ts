import { Router } from "express";
import AuthController from "../controllers/authController"; // ✅ Ensure correct import
import { auditTrailMiddleware } from "../Middleware/auditTrailMiddleware";
import { authMiddleware } from "../Middleware/authMiddleware"; // ✅ Protect logout
import authController from "../controllers/authController";

const router = Router();

// ✅ Correct way to call instance methods (No `.bind(AuthController)`)
router.post("/register", auditTrailMiddleware, (req, res) => AuthController.register(req, res));
router.post("/verify-otp", auditTrailMiddleware, (req, res) => AuthController.verifyOTPHandler(req, res));
router.post("/login", auditTrailMiddleware, (req, res) => AuthController.login(req, res));
router.post("/verify-old-password", authController.verifyOldPasswordBeforeReset);
router.post("/forgot-password", AuthController.forgotPassword);


router.post("/resend-otp", auditTrailMiddleware, (req, res) => AuthController.resendOTPHandler(req, res));
router.post("/api/auth/refresh-token", authController.refreshToken);

router.post("/logout", authMiddleware, auditTrailMiddleware, (req, res) => AuthController.logout(req, res));

export default router;
