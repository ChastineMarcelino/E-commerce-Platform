import { Request, Response } from "express";
import { Payment } from "../models/payment";
import { IPayment } from "../interface/paymentInterface";
import { validatePayment } from "../validations/paymentvalidation";
import { BaseController } from "./BaseController";

export class PaymentController extends BaseController<IPayment> {
  constructor() {
    super(Payment);
    
  }

  // Create a new payment with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validatePayment(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }
      req.body = payload; // Ensure validated payload is used
      await super.create(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update a payment with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validatePayment(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }
      req.body = payload; // Ensure validated payload is used
      await super.update(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
