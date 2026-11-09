
const express = require("express");
const router = express.Router();
const db = require("../config/db");

const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

// ===============================
// GET ALL CATEGORIES
// ===============================
router.get("/", async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT
        c.id,
        c.name,
        c.description,
        c.image_url,
        COUNT(f.id) AS food_count
      FROM categories c
      LEFT JOIN foods f ON c.id = f.category_id
      GROUP BY c.id, c.name, c.description, c.image_url
      ORDER BY c.id ASC
    `);

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
});

// ===============================
// CREATE CATEGORY
// ===============================
router.post("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO categories (name, description, image_url)
       VALUES (?, ?, ?)`,
      [
        name.trim(),
        description || null,
        image_url || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully!",
      categoryId: result.insertId,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
      code: error.code,
    });
  }
});

// ===============================
// UPDATE CATEGORY
// ===============================
router.put("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, image_url } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const [result] = await db.query(
      `UPDATE categories
       SET name = ?, description = ?, image_url = ?
       WHERE id = ?`,
      [
        name.trim(),
        description || null,
        image_url || null,
        id,
      ]
    );

    const [categories] = await db.query(
      "SELECT id FROM categories WHERE id = ?",
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully!",
    });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
      code: error.code,
    });
  }
});

// ===============================
// DELETE CATEGORY
// ===============================
router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const [foods] = await db.query(
      "SELECT id FROM foods WHERE category_id = ? LIMIT 1",
      [id]
    );

    if (foods.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This category contains foods. Delete or move those foods first.",
      });
    }

    const [result] = await db.query(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
});

module.exports = router;
