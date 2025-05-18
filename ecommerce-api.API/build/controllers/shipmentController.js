"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentController = void 0;
const shipment_1 = require("../models/shipment");
const shipmentValidation_1 = require("../validations/shipmentValidation");
const BaseController_1 = require("./BaseController");
class ShipmentController extends BaseController_1.BaseController {
    constructor() {
        super(shipment_1.Shipment);
    }
    // Create a new shipment with validation
    async create(req, res) {
        try {
            const { error, value: payload } = (0, shipmentValidation_1.validateShipment)(req.body);
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
    // Update a shipment with validation
    async update(req, res) {
        try {
            const { error, value: payload } = (0, shipmentValidation_1.validateShipment)(req.body);
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
exports.ShipmentController = ShipmentController;
