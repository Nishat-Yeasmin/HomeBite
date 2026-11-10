const express = require("express");
const router = express.Router();
const db = require("../config/db");

const { verifyToken, adminOnly } = require("../middleware/authMiddleware");


// GET all foods
router.get("/", async (req, res) => {
  try {
    const [foods] = await db.query(`
      SELECT
        foods.id,
        foods.category_id,
        foods.name,
        foods.description,
        foods.price,
        foods.image_url,
        foods.is_available,
        categories.name AS category_name
      FROM foods
      INNER JOIN categories ON foods.category_id = categories.id
      ORDER BY foods.id DESC
    `);

    res.json({ success: true, count: foods.length, foods });
  } catch (error) {
    console.error("Food fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch foods" });
  }
});

// GET single food
router.get("/:id", async (req, res) => {
  try {
    const [foods] = await db.query(
      `SELECT foods.*, categories.name AS category_name
       FROM foods
       INNER JOIN categories ON foods.category_id = categories.id
       WHERE foods.id = ?`,
      [req.params.id]
    );

    if (!foods.length) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    res.json({ success: true, food: foods[0] });
  } catch (error) {
    console.error("Food details error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch food" });
  }
});

// ADD food
router.post("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      image_url,
      is_available = 1,
    } = req.body;

    if (!category_id || !name?.trim() || price === undefined || price === "") {
      return res.status(400).json({
        success: false,
        message: "Category, food name and price are required",
      });
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid price",
      });
    }

    const [result] = await db.query(
      `INSERT INTO foods
       (category_id, name, description, price, image_url, is_available)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Number(category_id),
        name.trim(),
        description || null,
        Number(price),
        image_url?.trim() || null,
        is_available ? 1 : 0,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Food added successfully",
      id: result.insertId,
    });
  } catch (error) {
  console.error("Food add error:", error);

  res.status(500).json({
    success: false,
    message: "Failed to add food",
    error: error.message,
    code: error.code,
  });
}
});

// UPDATE food
router.put("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      image_url,
      is_available,
    } = req.body;

    if (!category_id || !name?.trim() || price === undefined || price === "") {
      return res.status(400).json({
        success: false,
        message: "Category, food name and price are required",
      });
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid price",
      });
    }

    const [result] = await db.query(
      `UPDATE foods
       SET category_id = ?, name = ?, description = ?, price = ?,
           image_url = ?, is_available = ?
       WHERE id = ?`,
      [
        Number(category_id),
        name.trim(),
        description || null,
        Number(price),
        image_url?.trim() || null,
        is_available ? 1 : 0,
        req.params.id,
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    res.json({ success: true, message: "Food updated successfully" });
  } catch (error) {
    console.error("Food update error:", error);
    res.status(500).json({ success: false, message: "Failed to update food" });
  }
});

// DELETE food
router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    // Preserve order history: do not delete foods used in previous orders.
    const [usedFoods] = await db.query(
      "SELECT id FROM order_items WHERE food_id = ? LIMIT 1",
      [req.params.id]
    );

    if (usedFoods.length) {
      return res.status(409).json({
        success: false,
        message:
          "This food is already included in an order. Mark it unavailable instead of deleting it.",
      });
    }

    const [result] = await db.query("DELETE FROM foods WHERE id = ?", [
      req.params.id,
    ]);

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    res.json({ success: true, message: "Food deleted successfully" });
  } catch (error) {
    console.error("Food delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete food" });
  }
});

module.exports = router;