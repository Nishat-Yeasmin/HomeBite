const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const express = require("express");
const router = express.Router();

// Profile image upload configuration
const profileUploadDir = path.join(
  __dirname,
  "../uploads/profiles"
);

fs.mkdirSync(profileUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileUploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG and JPEG images are allowed."));
    }
  },
});


const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

router.use(verifyToken);

// GET CUSTOMER DASHBOARD DATA
router.get("/dashboard", async (req, res) => {
  try {
    const userId = req.user.id;

    // Customer profile
    const [users] = await db.query(
      `SELECT id, name, email, phone
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Order statistics
    const [statsRows] = await db.query(
      `SELECT
        COUNT(*) AS total_orders,
        COALESCE(SUM(total_amount), 0) AS total_spent,
        SUM(
          CASE
            WHEN LOWER(order_status) NOT IN ('delivered', 'cancelled', 'canceled')
            THEN 1 ELSE 0
          END
        ) AS active_orders
       FROM orders
       WHERE user_id = ?`,
      [userId]
    );

    // Wishlist count
    const [wishlistRows] = await db.query(
      `SELECT COUNT(*) AS wishlist_count
       FROM wishlist
       WHERE user_id = ?`,
      [userId]
    );

    // Recent orders
    const [recentOrders] = await db.query(
      `SELECT
        o.id,
        o.total_amount,
        o.order_status,
        o.payment_status,
        o.delivery_address,
o.payment_method,
        o.created_at,
        COUNT(oi.id) AS item_count,
        COALESCE(
          GROUP_CONCAT(
            CONCAT(f.name, ' × ', oi.quantity)
            ORDER BY oi.id ASC
            SEPARATOR ', '
          ),
          'No items'
        ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN foods f ON f.id = oi.food_id
       WHERE o.user_id = ?
       GROUP BY
         o.id, o.total_amount, o.order_status,
         o.payment_status, o.delivery_address,
  o.payment_method, o.created_at
       ORDER BY o.created_at DESC
       LIMIT 4`,
      [userId]
    );

    res.json({
      success: true,
      user: users[0],
      stats: {
        totalOrders: Number(statsRows[0].total_orders || 0),
        activeOrders: Number(statsRows[0].active_orders || 0),
        wishlistCount: Number(wishlistRows[0].wishlist_count || 0),
        totalSpent: Number(statsRows[0].total_spent || 0),
      },
      recentOrders,
    });
  } catch (error) {
    console.error("CUSTOMER DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
});


// UPDATE CUSTOMER PROFILE
router.put("/profile", async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 100 characters",
      });
    }

    const normalizedName = name.trim();
    const normalizedPhone = phone?.trim() || null;

    await db.query(
      `UPDATE users
       SET name = ?, phone = ?
       WHERE id = ?`,
      [normalizedName, normalizedPhone, userId]
    );

    const [users] = await db.query(
      `SELECT id, name, email, phone
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: users[0],
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

// UPLOAD CUSTOMER PROFILE IMAGE
router.post(
  "/profile/photo",
  (req, res, next) => {
    upload.single("profile")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "Image size must be less than 5MB."
              : error.message,
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image.",
        });
      }

      const imagePath = `/uploads/profiles/${req.file.filename}`;

      await db.query(
        `UPDATE users
         SET profile_image = ?
         WHERE id = ?`,
        [imagePath, userId]
      );

      return res.status(200).json({
        success: true,
        message: "Profile picture updated successfully.",
        profile_image: imagePath,
      });
    } catch (error) {
      console.error("PROFILE IMAGE UPLOAD ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to upload profile picture.",
      });
    }
  }
);


module.exports = router;
