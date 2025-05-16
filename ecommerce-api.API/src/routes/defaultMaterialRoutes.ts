import express from "express";
import { DefaultMaterial } from "../models/defaultMaterial";

const router = express.Router();

router.post("/default-materials", async (req, res) => {
  try {
    const material = await DefaultMaterial.create(req.body);
    res.status(201).json({ message: "Material added", data: material });
  } catch (err) {
    res.status(400).json({ message: "Failed to add material", error: err });
  }
});

export default router;
