"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const baseroutes_1 = require("./baseroutes");
const authController_1 = __importDefault(require("../controllers/authController"));
const user_1 = require("../models/user");
const multer_1 = __importDefault(require("multer"));
// Initialize express Router
const router = express_1.default.Router();
const userController = new userController_1.UserController();
// Setup multer for profile uploads
const profileStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/profile-images"),
    filename: (_req, file, cb) => {
        const sanitized = file.originalname.replace(/\s+/g, '-').toLowerCase();
        cb(null, `${Date.now()}-${sanitized}`);
    },
});
const upload = (0, multer_1.default)({ storage: profileStorage });
// 📌 Route to get current user's profile
router.get("/api/users/profile", authMiddleware_1.authMiddleware, userController.getMyProfile.bind(userController));
// 🔐 Forgot Password (send OTP + store temp password)
router.post("/api/users/forgot-password", authController_1.default.forgotPassword);
// 🔐 Verify Forgot Password OTP (apply new password)
router.post("/api/users/verify-forgot-password-otp", authController_1.default.verifyForgotPasswordOTP);
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User endpoints
 */
/**
 * @swagger
 * /api/users/pending:
 *   get:
 *     summary: Get all users pending approval (Admin Only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending users
 *       403:
 *         description: Unauthorized
 */
router.get("/api/users/pending", authMiddleware_1.authMiddleware, authController_1.default.getPendingUsers);
/**
 * @swagger
 * /api/users/{id}/approve:
 *   put:
 *     summary: Approve a user and assign a role (Admin Only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               role_id:
 *                 type: string
 *                 example: CASHIER
 *     responses:
 *       200:
 *         description: User approved successfully
 *       400:
 *         description: User already approved or invalid data
 *       404:
 *         description: User not found
 */
router.put("/api/users/:id/approve", authMiddleware_1.authMiddleware, userController.approveUser);
/**
 * @swagger
 * /api/users/{id}/reject:
 *   delete:
 *     summary: Reject a user (Admin Only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User rejected successfully
 *       404:
 *         description: User not found
 */
router.delete("/api/users/:id/reject", authMiddleware_1.authMiddleware, userController.rejectUser.bind(userController));
/**
 * Apply the base routes to user management routes
 */
router.get("/api/staff-members", authMiddleware_1.authMiddleware, async (_req, res) => {
    try {
        const staff = await user_1.User.find({
            role: { $in: ["Staff", "ADMIN"] },
            isApproved: true,
            isVerified: true,
            status: "Active"
        }).select("name email role status isOnline profileImageUrl");
        res.status(200).json(staff);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error fetching staff members", error: errorMessage });
    }
});
// ✅ Add this route for deleting a staff member
router.delete("/api/users/staff/:id", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const staffId = req.params.id;
        const deletedUser = await user_1.User.findByIdAndDelete(staffId);
        if (!deletedUser) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        res.status(200).json({ message: "Staff member deleted successfully" });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500).json({ message: "Error deleting staff member", error: errorMessage });
    }
});
router.put("/api/users/profile/upload", authMiddleware_1.authMiddleware, upload.single("image"), async (req, res) => {
    try {
        const user = await user_1.User.findById(req.userId); // Ensure userId is set in authMiddleware
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (!req.file)
            return res.status(400).json({ message: "No image uploaded" });
        user.profileImageUrl = `/uploads/profile-images/${req.file.filename}`;
        await user.save();
        res.status(200).json({ message: "Profile image updated", imageUrl: user.profileImageUrl });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
router.use("/api/v1/users", authMiddleware_1.authMiddleware, (0, baseroutes_1.createBaseRoutes)(userController));
router.use("/api/v2/users", authMiddleware_1.authMiddleware, (0, baseroutes_1.createBaseRoutes)(userController));
exports.default = router;
