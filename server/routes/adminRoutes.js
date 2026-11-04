const express = require("express");
const router = express.Router();
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

module.exports = router;