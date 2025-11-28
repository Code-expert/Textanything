import express from "express";
import { getVehicleState } from "../services/vehicleService.js";

const router = express.Router();

// GET /vehicles/:id/status
router.get("/:id/status", (req, res) => {
  const id = req.params.id;
  const state = getVehicleState(id);

  if (!state) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  res.json(state);
});

export default router;
