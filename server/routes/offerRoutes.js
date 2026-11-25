
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all active and currently valid offers
router.get("/", async (req, res) => {
  try {
    const [offers] = await db.query(`
      SELECT
        o.id AS offer_id,
        f.id AS food_id,
        f.name,
        f.description,
        f.image_url,
        f.category_id,
        c.name AS category_name,
        f.price AS original_price,
        o.discount_price,
        ROUND(
          ((f.price - o.discount_price) / f.price) * 100
        ) AS discount_percentage,
        o.start_date,
        o.end_date
      FROM offers o
      INNER JOIN foods f ON o.food_id = f.id
      LEFT JOIN categories c ON f.category_id = c.id
      WHERE
        o.is_active = 1
        AND f.is_available = 1
        AND o.start_date <= NOW()
        AND (
          o.end_date IS NULL
          OR o.end_date >= NOW()
        )
      ORDER BY o.created_at DESC
    `);

    res.json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    console.error("Public offers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load offers",
    });
  }
});

module.exports = router;
