import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { ITransaction } from "../models/Transaction";
import { validateTransaction } from "../validations/transactionValidation";
import { BaseController } from "./BaseController";

export class TransactionController extends BaseController<ITransaction> {
  constructor() {
    super(Transaction);
  }

  // Create a new transaction with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateTransaction(req.body);
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

  // Update a transaction with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateTransaction(req.body);
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
