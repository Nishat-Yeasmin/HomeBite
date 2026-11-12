
const express = require("express");
const router = express.Router();

const db = require("../config/db");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

// Only admin can access order management APIs
router.use(verifyToken, adminOnly);


// ========================================
// GET ALL ORDERS
// ========================================
router.get("/", async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT
        o.*,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,

        (
          SELECT COUNT(*)
          FROM order_items oi
          WHERE oi.order_id = o.id
        ) AS item_count,

        (
          SELECT COALESCE(SUM(oi.quantity), 0)
          FROM order_items oi
          WHERE oi.order_id = o.id
        ) AS total_items

      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC, o.id DESC
    `);

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});


// ========================================
// GET SINGLE ORDER DETAILS
// ========================================
router.get("/:id", async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const [orders] = await db.query(
      `
      SELECT
        o.*,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone

      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
      LIMIT 1
      `,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const [items] = await db.query(
      `
      SELECT
        oi.id,
        oi.order_id,
        oi.food_id,
        oi.quantity,
        oi.unit_price,
        f.name AS food_name,
        f.image_url AS food_image

      FROM order_items oi
      LEFT JOIN foods f ON oi.food_id = f.id
      WHERE oi.order_id = ?
      ORDER BY oi.id ASC
      `,
      [orderId]
    );

    res.json({
      success: true,
      order: {
        ...orders[0],
        items,
      },
    });

  } catch (error) {
    console.error("GET ORDER DETAILS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
    });
  }
});


// ========================================
// UPDATE ORDER STATUS
// ========================================
router.put("/:id/status", async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { order_status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    if (!allowedStatuses.includes(order_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const [result] = await db.query(
      "UPDATE orders SET order_status = ? WHERE id = ?",
      [order_status, orderId]
    );

    if (result.affectedRows === 0) {
      const [existing] = await db.query(
        "SELECT id FROM orders WHERE id = ?",
        [orderId]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order_status,
    });

  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
});


// ========================================
// UPDATE PAYMENT STATUS
// ========================================
router.put("/:id/payment-status", async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { payment_status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Failed",
    ];

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    if (!allowedStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const [result] = await db.query(
      "UPDATE orders SET payment_status = ? WHERE id = ?",
      [payment_status, orderId]
    );

    if (result.affectedRows === 0) {
      const [existing] = await db.query(
        "SELECT id FROM orders WHERE id = ?",
        [orderId]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
    }

    res.json({
      success: true,
      message: "Payment status updated successfully",
      payment_status,
    });

  } catch (error) {
    console.error("UPDATE PAYMENT STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
    });
  }
});


module.exports = router;
