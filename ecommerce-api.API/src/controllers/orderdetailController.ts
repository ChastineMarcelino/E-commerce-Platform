import { Request, Response } from "express";
import { OrderDetail } from "../models/orderDetail"; // Ensure this path is correct
import { IOrderDetail } from "../interface/orderDetailInterface";
import { validateOrderDetail } from "../validations/orderDetailValidation";
import { BaseController } from "./BaseController";

export class OrderDetailController extends BaseController<IOrderDetail> {
  constructor() {
    super(OrderDetail as any); // Ensure OrderDetail is properly recognized as a model
  }

  // Create a new order detail with validation and dynamic total price calculation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateOrderDetail(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }
      
      // Calculate totalPrice dynamically before saving
      payload.totalPrice = payload.quantity * payload.price;
      req.body = payload; // Ensure validated payload is used
      await super.create(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update an order detail with validation and dynamic total price calculation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateOrderDetail(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }

      // Recalculate totalPrice dynamically before updating
      payload.totalPrice = payload.quantity * payload.price;
      req.body = payload; // Ensure validated payload is used
      await super.update(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
