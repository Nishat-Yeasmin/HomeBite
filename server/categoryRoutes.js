const express = require("express");
const router = express.Router();
const db = require("./db");

// Get all food categories
router.get("/", async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT id, name, description FROM categories ORDER BY id ASC"
    );

    res.status(200).json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    console.error("Category fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
});

module.exports = router;