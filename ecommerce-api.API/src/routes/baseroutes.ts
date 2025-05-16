import express, { Router } from "express";
import { BaseController } from "../controllers/BaseController";
import { Document } from "mongoose";
import { auditTrailMiddleware } from "../Middleware/auditTrailMiddleware";

export const createBaseRoutes = <T extends Document>(
  controller: BaseController<T>
): Router => {
  const router = express.Router();

  router.post("/", auditTrailMiddleware, controller.create.bind(controller));
  router.get("/",  controller.read.bind(controller));
  router.get("/:id", auditTrailMiddleware, controller.readById.bind(controller));
  router.put("/:id", auditTrailMiddleware, controller.update.bind(controller));
  router.delete("/:id",auditTrailMiddleware, controller.delete.bind(controller));

  
  return router;
}; 