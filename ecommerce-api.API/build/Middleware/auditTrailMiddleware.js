"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditTrailMiddleware = void 0;
const auditTrails_1 = require("../models/auditTrails");
const mongoose_1 = __importDefault(require("mongoose"));
const EVENT_TYPES = [
    "create", "update", "delete", "read_by_id",
    "logout", "register", "verify_otp", "approve", "resend_otp", "login", "unknown", "reject"
];
const auditTrailMiddleware = async (req, res, next) => {
    try {
        if (res.locals.auditLogged)
            return next(); // ✅ Prevent duplicate logging
        res.locals.auditLogged = true;
        let eventType = null;
        const method = req.method.toLowerCase();
        const path = req.path.toLowerCase();
        // ✅ Determine event type
        if (method === "post")
            eventType = "create";
        else if (method === "put" || method === "patch")
            eventType = "update";
        else if (method === "delete")
            eventType = "delete";
        else if (method === "get" && req.params.id)
            eventType = "read_by_id";
        // ✅ Authentication-related actions
        const authActions = {
            "logout": "logout",
            "register": "register",
            "resend-otp": "resend_otp",
            "verify-otp": "verify_otp",
            "approve": "approve",
            "login": "login"
        };
        const authAction = Object.keys(authActions).find(action => path.includes(action));
        if (authAction)
            eventType = authActions[authAction];
        if (!eventType || !EVENT_TYPES.includes(eventType)) {
            eventType = "read_by_id"; // ✅ Default to a valid event type
            console.warn("⚠️ [AUDIT WARNING] EventType is undefined or invalid. Setting default to 'read_by_id'.");
        }
        console.log("🔍 [DEBUG] Checking req.userId in middleware:", req.userId);
        // ✅ Extract userId and ensure it's a stringified ObjectId
        let userId = req.userId ? String(req.userId) : null;
        // ✅ Ensure userId is a valid ObjectId before saving
        if (userId && !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            console.warn("⚠️ [AUDIT WARNING] Invalid ObjectId format for userId. Setting to null.");
            userId = null;
        }
        if (!userId) {
            console.warn("⚠️ [AUDIT WARNING] UserId is still missing for event:", eventType);
        }
        // ✅ Event Descriptions
        const descriptions = {
            create: "Created a new record.",
            update: "Updated an existing record.",
            delete: "Deleted a record.",
            read_by_id: "Retrieved a specific record.",
            logout: "User logged out.",
            register: "New user registered.",
            verify_otp: "User verified OTP.",
            resend_otp: "User requested OTP resend.",
            login: "User logged in successfully.",
            unknown: "Performed an unspecified event.",
            approve: "User approval action performed.",
            reject: "Rejected a user.",
        };
        const description = descriptions[eventType];
        // ✅ Capture response changes after request finishes
        res.once("finish", async () => {
            try {
                console.log("[AUDIT MIDDLEWARE] Saving audit log...");
                await auditTrails_1.AuditTrail.create({
                    UserId: userId, // ✅ Always store userId as a stringified ObjectId
                    EventType: eventType,
                    DataChanges: eventType === "update" ? { before: req.body.oldData, after: req.body.newData } : null,
                    Description: description,
                });
                console.log("[AUDIT MIDDLEWARE] Audit log saved successfully.");
            }
            catch (err) {
                console.error("[AUDIT ERROR] Error saving audit log:", err);
            }
        });
        next();
    }
    catch (error) {
        console.error("[AUDIT ERROR] Middleware error:", error);
        next();
    }
};
exports.auditTrailMiddleware = auditTrailMiddleware;
