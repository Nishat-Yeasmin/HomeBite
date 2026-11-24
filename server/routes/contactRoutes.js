
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Submit contact message (Public)
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanSubject = String(subject).trim();
    const cleanMessage = String(message).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (
      cleanName.length > 100 ||
      cleanEmail.length > 150 ||
      cleanSubject.length > 150 ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO contact_messages
       (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [cleanName, cleanEmail, cleanSubject, cleanMessage]
    );

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
      messageId: result.insertId,
    });

  } catch (error) {
    console.error("Contact message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send your message. Please try again.",
    });
  }
});

module.exports = router;
