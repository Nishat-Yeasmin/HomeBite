
const express = require("express");
const router = express.Router();

const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

// All wishlist routes require login
router.use(verifyToken);

// GET: Logged-in customer's wishlist
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const [wishlist] = await db.query(
      `SELECT
          w.id AS wishlist_id,
          w.food_id,
          w.created_at,
          f.name,
          f.description,
          f.price,
          f.image_url,
          f.is_available,
          f.category_id,
          c.name AS category_name
       FROM wishlist w
       JOIN foods f ON w.food_id = f.id
       LEFT JOIN categories c ON f.category_id = c.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load wishlist",
    });
  }
});

// POST: Add food to wishlist
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { food_id } = req.body;

    if (!food_id || !Number.isInteger(Number(food_id))) {
      return res.status(400).json({
        success: false,
        message: "Valid food ID is required",
      });
    }

    const [foods] = await db.query(
      "SELECT id FROM foods WHERE id = ?",
      [food_id]
    );

    if (!foods.length) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    await db.query(
      `INSERT IGNORE INTO wishlist (user_id, food_id)
       VALUES (?, ?)`,
      [userId, food_id]
    );

    res.json({
      success: true,
      message: "Added to wishlist",
    });
  } catch (error) {
    console.error("Add wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
    });
  }
});

// DELETE: Remove food from wishlist
router.delete("/:foodId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId } = req.params;

    await db.query(
      "DELETE FROM wishlist WHERE user_id = ? AND food_id = ?",
      [userId, foodId]
    );

    res.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
    });
  }
});

module.exports = router;
