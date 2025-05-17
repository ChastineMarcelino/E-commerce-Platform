"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditTrail = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define possible event types (removed "read")
const EVENT_TYPES = [
    "create", "update", "delete", "read_by_id",
    "create_webhook",
    "login", "logout", "register", "verify_otp", "resend_otp", "approve"
];
const AuditTrailSchema = new mongoose_1.default.Schema({
    UserId: { type: String, required: false }, // ✅ Store as a plain string
    EventType: { type: String, enum: EVENT_TYPES, required: true },
    DataChanges: { type: mongoose_1.default.Schema.Types.Mixed, default: null },
    Description: { type: String, default: null },
}, { timestamps: true });
exports.AuditTrail = mongoose_1.default.model("AuditTrail", AuditTrailSchema);
