"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const savedOrderDetail = yield newOrderDetail.save();
                res.status(201).json({ message: "Order detail created successfully", data: savedOrderDetail });
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error", error: error.message });
            }
        });
    }
}
exports.OrderDetailController = OrderDetailController;
