import { Request, Response } from "express";
import { Permission } from "../models/permission";
import { IPermission } from "../interface/permissionInterface";
import { validatePermission } from "../validations/permissionvalidation";
import { BaseController } from "./BaseController";

export class PermissionController extends BaseController<IPermission> {
  constructor() {
    super(Permission);
  }

  // Create a new permission with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validatePermission(req.body);
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

  // Update an existing permission with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validatePermission(req.body);
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