"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetailController = void 0;
const orderDetail_1 = require("../models/orderDetail"); // Ensure correct path
const orderDetailValidation_1 = require("../validations/orderDetailValidation");
const BaseController_1 = require("./BaseController");
class OrderDetailController extends BaseController_1.BaseController {
    constructor() {
        super(orderDetail_1.OrderDetail); // Ensure OrderDetail is properly recognized as a model
    }
    // Create a new order detail
    async create(req, res) {
        try {
            // Validate the request body
            const { error, value } = (0, orderDetailValidation_1.validateOrderDetail)(req.body);
            if (error) {
                res.status(400).json({ message: error.details.map((err) => err.message) });
                return;
            }
            // **ENSURE TOTAL PRICE IS CALCULATED**
            value.totalPrice = value.quantity * value.price;
            // Save the validated data
            const newOrderDetail = new orderDetail_1.OrderDetail(value);
            const savedOrderDetail = await newOrderDetail.save();
            res.status(201).json({ message: "Order detail created successfully", data: savedOrderDetail });
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
}
exports.OrderDetailController = OrderDetailController;
