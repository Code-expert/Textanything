import express from "express";
import zones from "../models/zones.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(zones);
});

export default router;
