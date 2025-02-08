import express, { Router } from "express";
import { BaseController } from "../controllers/BaseController";
import { Document } from "mongoose";

export const createBaseRoutes = <T extends Document>(
  controller: BaseController<T>
): Router => {
  const router = express.Router();

  router.post("/", controller.create.bind(controller));
  router.get("/", controller.read.bind(controller));
  router.get("/:id", controller.readById.bind(controller));
  router.put("/:id", controller.update.bind(controller));
  router.delete("/:id", controller.delete.bind(controller));

  
  return router;
}; 