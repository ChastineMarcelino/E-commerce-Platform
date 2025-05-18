"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const permission_1 = require("../models/permission");
const permissionvalidation_1 = require("../validations/permissionvalidation");
const BaseController_1 = require("./BaseController");
class PermissionController extends BaseController_1.BaseController {
    constructor() {
        super(permission_1.Permission);
    }
    // Create a new permission with validation
    async create(req, res) {
        try {
            const { error, value: payload } = (0, permissionvalidation_1.validatePermission)(req.body);
            if (error) {
                res.status(400).json({ message: error.details.map((err) => err.message) });
                return;
            }
            req.body = payload; // Ensure validated payload is used
            await super.create(req, res);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    // Update an existing permission with validation
    async update(req, res) {
        try {
            const { error, value: payload } = (0, permissionvalidation_1.validatePermission)(req.body);
            if (error) {
                res.status(400).json({ message: error.details.map((err) => err.message) });
                return;
            }
            req.body = payload; // Ensure validated payload is used
            await super.update(req, res);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.PermissionController = PermissionController;
