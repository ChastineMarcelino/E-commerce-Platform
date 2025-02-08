import { Request, Response } from "express";
import { Order } from "../models/order"; 
import { IOrder } from "../interface/orderInterface";
import { validateOrder } from "../validations/ordervalidation";
import { BaseController } from "./BaseController";

export class OrderController extends BaseController<IOrder> {
  constructor() {
    super(Order as any);
  }

  // Create a new order with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateOrder(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((error) => error.message) });
        return;
      }
      req.body = payload;
      await super.create(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update an order with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateOrder(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((error) => error.message) });
        return;
      }
      req.body = payload;
      await super.update(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
