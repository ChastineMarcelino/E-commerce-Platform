import express from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../Middleware/authMiddleware";
import { createBaseRoutes } from "./baseroutes";
import authController from "../controllers/authController";
import { User } from "../models/user";
import multer from "multer";
import path from "path";

// Initialize express Router
const router = express.Router();
const userController = new UserController();
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
// Setup multer for profile uploads
const profileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/profile-images"),
  filename: (_req, file, cb) => {
    const sanitized = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${sanitized}`);
  },
});
const upload = multer({ storage: profileStorage });
// 📌 Route to get current user's profile
router.get("/api/users/profile", authMiddleware, userController.getMyProfile.bind(userController));

// 🔐 Forgot Password (send OTP + store temp password)
router.post("/api/users/forgot-password", authController.forgotPassword);

// 🔐 Verify Forgot Password OTP (apply new password)
router.post("/api/users/verify-forgot-password-otp", authController.verifyForgotPasswordOTP);

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
router.get("/api/users/pending", authMiddleware, authController.getPendingUsers);

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
router.put("/api/users/:id/approve", authMiddleware, userController.approveUser);

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
router.delete("/api/users/:id/reject", authMiddleware, userController.rejectUser.bind(userController));

/**
 * Apply the base routes to user management routes
 */

router.get("/api/staff-members", authMiddleware, async (_req: express.Request, res: express.Response) => {
  try {
    const staff = await User.find({
      role: { $in: ["Staff", "ADMIN"] },
      isApproved: true,
      isVerified: true,
      status: "Active"
    }).select("name email role status isOnline profileImageUrl");

    res.status(200).json(staff);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Error fetching staff members", error: errorMessage });
  }
});


  // ✅ Add this route for deleting a staff member
router.delete("/api/users/staff/:id", authMiddleware, async (req, res) => {
  try {
    const staffId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(staffId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
    res.status(500).json({ message: "Error deleting staff member", error: errorMessage });
  }
});
router.put(
  "/api/users/profile/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId); // Ensure userId is set in authMiddleware
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!req.file) return res.status(400).json({ message: "No image uploaded" });

      user.profileImageUrl = `/uploads/profile-images/${req.file.filename}`;
      await user.save();

      res.status(200).json({ message: "Profile image updated", imageUrl: user.profileImageUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.use("/api/v1/users", authMiddleware, createBaseRoutes(userController));
router.use("/api/v2/users", authMiddleware, createBaseRoutes(userController));

export default router;
