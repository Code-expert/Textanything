import express from "express";
import morgan from "morgan";

import locationRoutes from "./routes/locationRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import zoneRoutes from "./routes/zoneRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/events", locationRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/zones", zoneRoutes);

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Geofence service running on port ${PORT}`);
});
