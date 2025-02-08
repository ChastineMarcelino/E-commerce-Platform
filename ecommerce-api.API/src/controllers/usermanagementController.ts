import { Request, Response } from "express";
import { User } from "../models/user";
import { IUser } from "../interface/userInterface";
import { validateUser } from "../validations/userValidation";
import { BaseController } from "./BaseController";

export class UserManagementController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  // Create a new user with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateUser(req.body);
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

  // Update an existing user with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateUser(req.body);
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
