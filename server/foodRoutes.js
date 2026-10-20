const express = require("express");
const router = express.Router();
const db = require("./db");

// Get all foods
router.get("/", async (req, res) => {
  try {
    const [foods] = await db.query(`
      SELECT
        foods.id,
        foods.name,
        foods.description,
        foods.price,
        foods.image_url,
        foods.is_available,
        categories.name AS category_name
      FROM foods
      INNER JOIN categories
        ON foods.category_id = categories.id
      ORDER BY foods.id DESC
    `);

    res.status(200).json({
      success: true,
      count: foods.length,
      foods: foods,
    });
  } catch (error) {
    console.error("Food fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch foods",
    });
  }
});

// Get one food by ID
router.get("/:id", async (req, res) => {
  try {
    const [foods] = await db.query(
      `SELECT foods.*, categories.name AS category_name
       FROM foods
       INNER JOIN categories ON foods.category_id = categories.id
       WHERE foods.id = ?`,
      [req.params.id]
    );

    if (foods.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.json({
      success: true,
      food: foods[0],
    });
  } catch (error) {
    console.error("Single food fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch food",
    });
  }
});

module.exports = router;