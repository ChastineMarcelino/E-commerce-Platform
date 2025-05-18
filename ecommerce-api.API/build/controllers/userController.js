"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = require("../models/user");
const BaseController_1 = require("./BaseController");
const auditTrails_1 = require("../models/auditTrails");
class UserController extends BaseController_1.BaseController {
    constructor() {
        super(user_1.User);
    }
    // ✅ Approve user and assign role
    async approveUser(req, res) {
        try {
            console.log("🔹 Approve Request Received:", req.body);
            console.log("🔹 User ID from Params:", req.params.id);
            const { id } = req.params;
            const { name, role } = req.body;
            const adminId = req.user?.id;
            if (!name || !role) {
                console.error("❌ Missing required fields: name or role");
                res.status(400).json({ message: "Name and role are required" });
                return;
            }
            const user = await user_1.User.findById(id);
            if (!user) {
                console.error(`❌ User not found: ${id}`);
                res.status(404).json({ message: "User not found" });
                return;
            }
            if (user.status === "Active") {
                console.error(`❌ User already approved: ${user.name}`);
                res.status(400).json({ message: "User is already approved" });
                return;
            }
            // if (!user.isVerified) {
            //   console.error(`❌ User has not verified OTP: ${user.name}`);
            //   res.status(400).json({ message: "User must verify OTP before approval" });
            //   return;
            // }
            // ✅ Update user details
            user.name = name;
            user.role = role;
            user.status = "Active";
            user.isApproved = true;
            await user.save();
            console.log(`✅ User approved: ${user.name} (New Role: ${role})`);
            // 📝 Log approval in Audit Trail
            await auditTrails_1.AuditTrail.create({
                UserId: adminId,
                EventType: "approve",
                Description: `Approved user ${name} (ID: ${id})`,
                DataChanges: { previousStatus: user.status, newStatus: "Active", role },
            });
            res.status(200).json({ message: "User approved successfully", user });
        }
        catch (error) {
            console.error("❌ Internal Server Error:", error.message);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
    // ✅ Reject user
    async rejectUser(req, res) {
        try {
            console.log("🔹 Reject Request Received:", req.params.id);
            const { id } = req.params;
            const adminId = req.user?.id;
            const user = await user_1.User.findById(id);
            if (!user) {
                console.error(`❌ User not found: ${id}`);
                res.status(404).json({ message: "User not found" });
                return;
            }
            if (user.status === "Disabled") { // Adjusted to match a valid status
                console.error(`❌ User already rejected: ${user.name}`);
                res.status(400).json({ message: "User is already rejected" });
                return;
            }
            // ❌ Delete user
            await user.deleteOne();
            console.log(`✅ User rejected and deleted: ${user.name}`);
            // 📝 Log rejection in Audit Trail
            // await AuditTrail.create({
            //   UserId: adminId,
            //   EventType: "reject",
            //   Description: `Rejected user ${user.name} (ID: ${id})`,
            //   DataChanges: { previousStatus: user.status, newStatus: "Deleted" },
            // });
            res.status(200).json({ message: "User rejected successfully" });
        }
        catch (error) {
            console.error("❌ Internal Server Error:", error.message);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
    // 📍 Get logged-in user's profile
    async getMyProfile(req, res) {
        try {
            const user = req.user; // ⬅ already available from authMiddleware
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json({
                fullName: user.name,
                email: user.email,
                address: user.address,
                role: user.role,
            });
        }
        catch (error) {
            console.error("❌ Error fetching user profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.UserController = UserController;
