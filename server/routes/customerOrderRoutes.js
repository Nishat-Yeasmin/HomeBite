
const express = require("express");
const router = express.Router();

const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

router.use(verifyToken);

// GET: Logged-in customer's orders
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.query(
      `SELECT
        o.id,
        o.total_amount,
        o.delivery_fee,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.delivery_address,
        o.phone,
        o.created_at,

        (SELECT COUNT(*)
         FROM order_items oi
         WHERE oi.order_id = o.id) AS item_count,

        (SELECT COALESCE(SUM(oi.quantity), 0)
         FROM order_items oi
         WHERE oi.order_id = o.id) AS total_items,

        (SELECT GROUP_CONCAT(
          CONCAT(f.name, ' × ', oi.quantity)
          ORDER BY oi.id ASC SEPARATOR ', '
        )
         FROM order_items oi
         LEFT JOIN foods f ON f.id = oi.food_id
         WHERE oi.order_id = o.id) AS items

       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC, o.id DESC`,
      [userId]
    );

    res.json({ success: true, orders });
  } catch (error) {
    console.error("CUSTOMER ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load your orders",
    });
  }
});

// GET: One order with items
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const [orders] = await db.query(
      `SELECT *
       FROM orders
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [orderId, userId]
    );

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const [items] = await db.query(
      `SELECT
        oi.id,
        oi.food_id,
        oi.quantity,
        oi.unit_price,
        f.name AS food_name,
        f.image_url AS food_image
       FROM order_items oi
       LEFT JOIN foods f ON f.id = oi.food_id
       WHERE oi.order_id = ?
       ORDER BY oi.id ASC`,
      [orderId]
    );

    res.json({
      success: true,
      order: { ...orders[0], items },
    });
  } catch (error) {
    console.error("CUSTOMER ORDER DETAILS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load order details",
    });
  }
});

// POST: Cancel own Pending order only
router.post("/:id/cancel", async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const [result] = await db.query(
      `UPDATE orders
       SET order_status = 'Cancelled'
       WHERE id = ?
         AND user_id = ?
         AND LOWER(order_status) = 'pending'`,
      [orderId, userId]
    );

    if (!result.affectedRows) {
      const [existing] = await db.query(
        `SELECT order_status
         FROM orders
         WHERE id = ? AND user_id = ?
         LIMIT 1`,
        [orderId, userId]
      );

      if (!existing.length) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Only Pending orders can be cancelled",
        order_status: existing[0].order_status,
      });
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("CANCEL CUSTOMER ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
});

module.exports = router;
