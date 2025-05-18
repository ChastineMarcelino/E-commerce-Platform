"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Define User Schema
exports.userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, maxlength: 100 },
    password: { type: String, required: true, maxlength: 255 },
    // ✅ Full password history with plainHint
    passwordHistory: {
        type: [
            {
                password: { type: String },
                plainHint: { type: String },
                changedAt: { type: Date }
            }
        ],
        default: []
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    verificationAttempts: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    name: { type: String, maxlength: 100, default: null },
    address: { type: String, maxlength: 255, default: null },
    role: { type: String, default: null },
    status: {
        type: String,
        enum: ["Pending", "Active", "Disabled"],
        default: "Pending"
    },
    pendingNewPassword: { type: String, default: null },
    pendingNewPasswordHint: { type: String, default: null }, // ✅ Schema field added
    profileImageUrl: { type: String, default: "" },
    isOnline: { type: Boolean, default: false }, // ✅ NEW
    lastLogin: { type: Date, default: null },
}, { timestamps: true });
// 🔒 Hash Password Before Saving
exports.userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    if (this.password.startsWith('$2b$'))
        return next();
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        this.password = await bcrypt_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// 🔑 Password Comparison Method
exports.userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
// Export User Model
exports.User = mongoose_1.default.model("User", exports.userSchema);
