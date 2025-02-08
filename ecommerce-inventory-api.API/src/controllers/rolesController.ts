import { Request, Response } from "express";
import { Role } from "../models/roles";
import { IRoles } from "../interface/rolesInterface";
import { validateRoles } from "../validations/rolesvalidation";
import { BaseController } from "./BaseController";

export class RolesController extends BaseController<IRoles> {
  constructor() {
    super(Role);
  }

  // Create a new role with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateRoles(req.body);
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

  // Update an existing role with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateRoles(req.body);
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
