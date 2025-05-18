"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const roles_1 = require("../models/roles");
const rolesvalidation_1 = require("../validations/rolesvalidation");
const BaseController_1 = require("./BaseController");
class RolesController extends BaseController_1.BaseController {
    constructor() {
        super(roles_1.Role);
    }
    // Create a new role with validation
    async create(req, res) {
        try {
            const { error, value: payload } = (0, rolesvalidation_1.validateRoles)(req.body);
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
    // Update an existing role with validation
    async update(req, res) {
        try {
            const { error, value: payload } = (0, rolesvalidation_1.validateRoles)(req.body);
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
exports.RolesController = RolesController;
