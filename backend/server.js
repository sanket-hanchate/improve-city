import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import Complaint from "./models/Complaint.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Email Transporter (using Gmail App Password)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready to send messages!");
  }
});
// ✅ Routes
app.use("/api/complaints", complaintRoutes);

// --- PUT: Update complaint status + send email notification ---
app.put("/api/complaints/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Update status in DB
    complaint.status = status;
    await complaint.save();

    // 📨 Send email notifications 

    const mailOptions = {
      from: `"CivicFlow Notifications" <${process.env.EMAIL_USER}>`,
      to: complaint.email,
      subject: `Update on your complaint #${complaint.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>Hi ${complaint.name},</h2>
          <p>Your complaint titled <strong>${complaint.title}</strong> has been updated.</p>
          <p><b>Current Status:</b> ${status}</p>
          <p>Thank you for helping us improve our city! 🌆</p>
          <hr/>
          <p style="font-size: 12px; color: gray;">CivicFlow – Automated Notification</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${complaint.email}`);

    res.json({ message: "Complaint updated and email sent successfully!" });
  } catch (err) {
    console.error("PUT /api/complaints/:id error:", err);
    res.status(500).json({ error: "Failed to update complaint or send email" });
  }
});

// --- GET single complaint by ID ---
app.get("/api/complaints/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.json(complaint);
  } catch (err) {
    console.error("GET /api/complaints/:id error:", err);
    res.status(500).json({ error: "Could not fetch complaint" });
  }
});

// ✅ Sync database
sequelize.sync().then(() => console.log("📦 SQLite database is ready!"));

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
