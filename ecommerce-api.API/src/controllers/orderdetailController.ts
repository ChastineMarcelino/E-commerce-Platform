import { Request, Response } from "express";
import { OrderDetail } from "../models/orderDetail"; // Ensure correct path
import { IOrderDetail } from "../interface/orderDetailInterface";
import { validateOrderDetail } from "../validations/orderDetailValidation";
import { BaseController } from "./BaseController";

export class OrderDetailController extends BaseController<IOrderDetail> {
  constructor() {
    super(OrderDetail as any); // Ensure OrderDetail is properly recognized as a model
  }

  // Create a new order detail
  public async create(req: Request, res: Response): Promise<void> {
    try {
      // Validate the request body
      const { error, value } = validateOrderDetail(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }

      // **ENSURE TOTAL PRICE IS CALCULATED**
      value.totalPrice = value.quantity * value.price;

      // Save the validated data
      const newOrderDetail = new OrderDetail(value);
      const savedOrderDetail = await newOrderDetail.save();

      res.status(201).json({ message: "Order detail created successfully", data: savedOrderDetail });
    } catch (error: any) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
}
