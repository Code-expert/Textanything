import express from "express";
import { getZonesForLocation, detectZoneChanges } from "../services/geofenceService.js";
import { getVehicleState, updateVehicleState } from "../services/vehicleService.js";

const router = express.Router();

router.post("/location", (req, res) => {
  const { vehicleId, lat, lng, timestamp } = req.body;

  if (!vehicleId || typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({
      error: "vehicleId, lat (number), lng (number) are required"
    });
  }

  const time = timestamp || new Date().toISOString();

  const prevState = getVehicleState(vehicleId);
  const previousZones = prevState?.currentZones || [];

  const newZones = getZonesForLocation(lat, lng);
  const { entered, exited } = detectZoneChanges(previousZones, newZones);

  if (entered.length || exited.length) {
    console.log(
      `[Geofence] ${vehicleId} entered: [${entered}] exited: [${exited}]`
    );
  }

  const updated = updateVehicleState(vehicleId, {
    lastLocation: { lat, lng, timestamp: time },
    currentZones: newZones
  });

  res.json({
    vehicleId,
    lastLocation: updated.lastLocation,
    currentZones: updated.currentZones,
    entered,
    exited
  });
});

export default router;
