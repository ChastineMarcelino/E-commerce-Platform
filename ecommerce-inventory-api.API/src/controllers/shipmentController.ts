import { Request, Response } from "express";
import { Shipment } from "../models/shipment";
import { IShipment } from "../models/shipment";
import { validateShipment } from "../validations/shipmentValidation";
import { BaseController } from "./BaseController";

export class ShipmentController extends BaseController<IShipment> {
  constructor() {
    super(Shipment);
  }

  // Create a new shipment with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateShipment(req.body);
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

  // Update a shipment with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateShipment(req.body);
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
