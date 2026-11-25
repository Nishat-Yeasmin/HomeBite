
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


// ===============================
// ADMIN OFFER MANAGEMENT
// ===============================

// GET all offers (Active + Inactive)
router.get("/offers", async (req, res) => {
  try {
    const [offers] = await db.query(`
      SELECT
        o.id,
        o.food_id,
        f.name AS food_name,
        f.image_url,
        f.price AS original_price,
        o.discount_price,
        ROUND(
          ((f.price - o.discount_price) / f.price) * 100
        ) AS discount_percentage,
        o.start_date,
        o.end_date,
        o.is_active,
        o.created_at
      FROM offers o
      JOIN foods f ON o.food_id = f.id
      ORDER BY o.created_at DESC
    `);

    res.json(offers);
  } catch (error) {
    console.error("Get offers error:", error);
    res.status(500).json({ message: "Failed to fetch offers" });
  }
});


// ADD new offer
router.post("/offers", async (req, res) => {
  try {
    const { food_id, discount_price, start_date, end_date } = req.body;

    if (!food_id || discount_price === undefined || discount_price === "") {
      return res.status(400).json({
        message: "Food and discount price are required",
      });
    }

    const [foods] = await db.query(
      "SELECT id, price FROM foods WHERE id = ? AND is_available = 1",
      [food_id]
    );

    if (foods.length === 0) {
      return res.status(404).json({ message: "Food not found or unavailable" });
    }

    const discountPrice = Number(discount_price);
    const originalPrice = Number(foods[0].price);

    if (!Number.isFinite(discountPrice) || discountPrice <= 0) {
      return res.status(400).json({
        message: "Please enter a valid discount price",
      });
    }

    if (discountPrice >= originalPrice) {
      return res.status(400).json({
        message: "Discount price must be lower than original price",
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM offers WHERE food_id = ?",
      [food_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "This food already has an offer. Please edit the existing offer.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO offers
       (food_id, discount_price, start_date, end_date, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      [
        food_id,
        discountPrice,
        start_date || new Date(),
        end_date || null,
      ]
    );

    res.status(201).json({
      message: "Offer added successfully",
      offerId: result.insertId,
    });
  } catch (error) {
    console.error("Add offer error:", error);
    res.status(500).json({ message: "Failed to add offer" });
  }
});


// UPDATE offer
router.put("/offers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { discount_price, start_date, end_date } = req.body;

    if (discount_price === undefined || discount_price === "") {
      return res.status(400).json({
        message: "Discount price is required",
      });
    }

    const [offers] = await db.query(
      `SELECT o.id, o.food_id, f.price
       FROM offers o
       JOIN foods f ON o.food_id = f.id
       WHERE o.id = ?`,
      [id]
    );

    if (offers.length === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const discountPrice = Number(discount_price);
    const originalPrice = Number(offers[0].price);

    if (
      !Number.isFinite(discountPrice) ||
      discountPrice <= 0 ||
      discountPrice >= originalPrice
    ) {
      return res.status(400).json({
        message: "Discount price must be positive and lower than original price",
      });
    }

    await db.query(
      `UPDATE offers
       SET discount_price = ?,
           start_date = ?,
           end_date = ?
       WHERE id = ?`,
      [
        discountPrice,
        start_date || new Date(),
        end_date || null,
        id,
      ]
    );

    res.json({ message: "Offer updated successfully" });
  } catch (error) {
    console.error("Update offer error:", error);
    res.status(500).json({ message: "Failed to update offer" });
  }
});


// ACTIVATE / DEACTIVATE offer
router.patch("/offers/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active !== 0 && is_active !== 1 &&
        is_active !== true && is_active !== false) {
      return res.status(400).json({
        message: "Valid offer status is required",
      });
    }

    const [result] = await db.query(
      "UPDATE offers SET is_active = ? WHERE id = ?",
      [is_active ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({
      message: "Offer status updated successfully",
    });
  } catch (error) {
    console.error("Update offer status error:", error);
    res.status(500).json({ message: "Failed to update offer status" });
  }
});


// DELETE offer
router.delete("/offers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM offers WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Delete offer error:", error);
    res.status(500).json({ message: "Failed to delete offer" });
  }
});


module.exports = router;