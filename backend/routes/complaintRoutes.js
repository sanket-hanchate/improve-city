import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// POST – Add a new complaint
router.post("/", async (req, res) => {
  try {
    await Complaint.create(req.body);
    res.status(201).json({ message: "Complaint submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET – Get all complaints
router.get("/", async (req, res) => {
  const complaints = await Complaint.findAll();
  res.json(complaints);
});

// PUT – Update status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Not found" });
    complaint.status = status;
    await complaint.save();
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;