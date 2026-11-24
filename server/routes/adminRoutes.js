
const nodemailer = require("nodemailer");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();
router.use(verifyToken, adminOnly);
const db = require("../config/db");


// Dashboard summary
router.get("/stats", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM orders) AS totalOrders,
        (SELECT COALESCE(SUM(total_amount), 0)
         FROM orders
         WHERE order_status = 'Delivered') AS totalEarnings,
        (SELECT COUNT(*) FROM foods) AS totalFoods,
        (SELECT COUNT(*) FROM categories) AS totalCategories
    `);

    res.json({ success: true, stats: rows[0] });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
});

// Last 7 days delivered sales
router.get("/sales", async (req, res) => {
  try {
    const [sales] = await db.query(`
      SELECT
        DATE(created_at) AS sale_date,
        COALESCE(SUM(total_amount), 0) AS earnings,
        COUNT(*) AS total_orders
      FROM orders
      WHERE order_status = 'Delivered'
        AND created_at >= CURDATE() - INTERVAL 6 DAY
      GROUP BY DATE(created_at)
      ORDER BY sale_date ASC
    `);

    res.json({ success: true, sales });
  } catch (error) {
    console.error("Sales statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load sales statistics",
    });
  }
});
// Get all contact messages
router.get("/messages", async (req, res) => {
  try {
    const [messages] = await db.query(`
      SELECT *
      FROM contact_messages
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error("Fetch messages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load contact messages.",
    });
  }
});


// Get unread message count
router.get("/messages/unread-count", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS unreadCount
      FROM contact_messages
      WHERE is_read = 0
    `);

    res.json({
      success: true,
      unreadCount: Number(rows[0].unreadCount),
    });

  } catch (error) {
    console.error("Unread count error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load unread count.",
    });
  }
});


// Mark message as read
router.patch("/messages/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const [result] = await db.query(
      `UPDATE contact_messages
       SET is_read = 1
       WHERE id = ?`,
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.json({
      success: true,
      message: "Message marked as read.",
    });

  } catch (error) {
    console.error("Mark message read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update message.",
    });
  }
});


// Delete contact message
router.delete("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const [result] = await db.query(
      "DELETE FROM contact_messages WHERE id = ?",
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.json({
      success: true,
      message: "Contact message deleted successfully.",
    });

  } catch (error) {
    console.error("Delete message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete message.",
    });
  }
});



// REPLY TO CUSTOMER BY GMAIL

router.post("/messages/:id/reply", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const reply = String(req.body.reply || "").trim();

    if (!Number.isInteger(id) || id <= 0 || !reply) {
      return res.status(400).json({
        success: false,
        message: "Invalid message or reply.",
      });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: "Gmail is not configured.",
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM contact_messages WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const customer = rows[0];

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: {
        name: "HomeBite Support",
        address: process.env.GMAIL_USER,
      },
      to: customer.email,
      replyTo: process.env.GMAIL_USER,
      subject: `Re: ${customer.subject}`,
      text: `Hello ${customer.name},

${reply}

Best regards,
HomeBite Support Team`,
    });

    await db.query(
      `UPDATE contact_messages
       SET is_replied = 1,
           replied_at = CURRENT_TIMESTAMP,
           admin_reply = ?
       WHERE id = ?`,
      [reply, id]
    );

    return res.json({
      success: true,
      message: "Reply sent successfully!",
    });
  } catch (error) {
    console.error("Gmail reply error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email.",
    });
  }
});


module.exports = router;