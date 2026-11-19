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


// ==========================================
// CUSTOMER SAVED ADDRESSES
// ==========================================

// GET ALL ADDRESSES
router.get("/addresses", async (req, res) => {
  try {
    const userId = req.user.id;

    const [addresses] = await db.query(
      `SELECT *
       FROM customer_addresses
       WHERE user_id = ?
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load saved addresses.",
    });
  }
});

// ADD NEW ADDRESS
router.post("/addresses", async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      label,
      recipient_name,
      phone,
      address_line,
      area,
      city,
      postal_code,
      landmark,
      is_default,
    } = req.body;

    if (
      !recipient_name?.trim() ||
      !phone?.trim() ||
      !address_line?.trim() ||
      !area?.trim() ||
      !city?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const [existing] = await db.query(
      `SELECT id FROM customer_addresses WHERE user_id = ?`,
      [userId]
    );

    const makeDefault = Boolean(is_default) || existing.length === 0;

    if (makeDefault) {
      await db.query(
        `UPDATE customer_addresses
         SET is_default = 0
         WHERE user_id = ?`,
        [userId]
      );
    }

    const [result] = await db.query(
      `INSERT INTO customer_addresses
       (
         user_id, label, recipient_name, phone,
         address_line, area, city, postal_code,
         landmark, is_default
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        label || "Home",
        recipient_name.trim(),
        phone.trim(),
        address_line.trim(),
        area.trim(),
        city.trim(),
        postal_code?.trim() || null,
        landmark?.trim() || null,
        makeDefault ? 1 : 0,
      ]
    );

    const [addresses] = await db.query(
      `SELECT * FROM customer_addresses
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [result.insertId, userId]
    );

    res.status(201).json({
      success: true,
      message: "Address saved successfully.",
      address: addresses[0],
    });
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Unable to save address.",
    });
  }
});

// UPDATE ADDRESS
router.put("/addresses/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const {
      label,
      recipient_name,
      phone,
      address_line,
      area,
      city,
      postal_code,
      landmark,
      is_default,
    } = req.body;

    if (
      !recipient_name?.trim() ||
      !phone?.trim() ||
      !address_line?.trim() ||
      !area?.trim() ||
      !city?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const [existing] = await db.query(
      `SELECT id FROM customer_addresses
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [addressId, userId]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    if (is_default) {
      await db.query(
        `UPDATE customer_addresses
         SET is_default = 0
         WHERE user_id = ?`,
        [userId]
      );
    }

    await db.query(
      `UPDATE customer_addresses
       SET label = ?,
           recipient_name = ?,
           phone = ?,
           address_line = ?,
           area = ?,
           city = ?,
           postal_code = ?,
           landmark = ?,
           is_default = ?
       WHERE id = ? AND user_id = ?`,
      [
        label || "Home",
        recipient_name.trim(),
        phone.trim(),
        address_line.trim(),
        area.trim(),
        city.trim(),
        postal_code?.trim() || null,
        landmark?.trim() || null,
        is_default ? 1 : 0,
        addressId,
        userId,
      ]
    );

    const [addresses] = await db.query(
      `SELECT * FROM customer_addresses
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [addressId, userId]
    );

    res.json({
      success: true,
      message: "Address updated successfully.",
      address: addresses[0],
    });
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update address.",
    });
  }
});

// SET DEFAULT ADDRESS
router.patch("/addresses/:id/default", async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const [existing] = await db.query(
      `SELECT id FROM customer_addresses
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [addressId, userId]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    await db.query(
      `UPDATE customer_addresses
       SET is_default = 0
       WHERE user_id = ?`,
      [userId]
    );

    await db.query(
      `UPDATE customer_addresses
       SET is_default = 1
       WHERE id = ? AND user_id = ?`,
      [addressId, userId]
    );

    res.json({
      success: true,
      message: "Default address updated.",
    });
  } catch (error) {
    console.error("SET DEFAULT ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Unable to set default address.",
    });
  }
});

// DELETE ADDRESS
router.delete("/addresses/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const [existing] = await db.query(
      `SELECT id, is_default FROM customer_addresses
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [addressId, userId]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    await db.query(
      `DELETE FROM customer_addresses
       WHERE id = ? AND user_id = ?`,
      [addressId, userId]
    );

    // If the deleted address was default, choose another one.
    if (Number(existing[0].is_default) === 1) {
      const [remaining] = await db.query(
        `SELECT id FROM customer_addresses
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId]
      );

      if (remaining.length) {
        await db.query(
          `UPDATE customer_addresses
           SET is_default = 1
           WHERE id = ? AND user_id = ?`,
          [remaining[0].id, userId]
        );
      }
    }

    res.json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete address.",
    });
  }
});




// ==========================================
// CUSTOMER FOOD REVIEWS
// ==========================================

// GET CUSTOMER'S REVIEWS
router.get("/reviews", async (req, res) => {
  try {
    const userId = req.user.id;

    const [reviews] = await db.query(
      `SELECT
        r.id,
        r.user_id,
        r.food_id,
        r.order_id,
        r.rating,
        r.review_text,
        r.status,
        r.created_at,
        f.name AS food_name,
        f.image_url AS food_image
       FROM food_reviews r
       INNER JOIN foods f ON f.id = r.food_id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET CUSTOMER REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load your reviews.",
    });
  }
});


// GET FOODS ELIGIBLE FOR REVIEW
router.get("/reviews/eligible", async (req, res) => {
  try {
    const userId = req.user.id;

    const [foods] = await db.query(
      `SELECT DISTINCT
        o.id AS order_id,
        o.created_at AS order_date,
        f.id AS food_id,
        f.name AS food_name,
        f.image_url AS food_image
       FROM orders o
       INNER JOIN order_items oi ON oi.order_id = o.id
       INNER JOIN foods f ON f.id = oi.food_id
       WHERE o.user_id = ?
       AND LOWER(o.order_status) = 'delivered'
       AND NOT EXISTS (
         SELECT 1
         FROM food_reviews r
         WHERE r.user_id = o.user_id
         AND r.food_id = f.id
         AND r.order_id = o.id
       )
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      foods,
    });
  } catch (error) {
    console.error("GET ELIGIBLE REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load foods for review.",
    });
  }
});


// ADD NEW REVIEW
router.post("/reviews", async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      food_id,
      order_id,
      rating,
      review_text,
    } = req.body;

    const numericRating = Number(rating);
    const foodId = Number(food_id);
    const orderId = Number(order_id);

    if (
      !Number.isInteger(foodId) ||
      foodId <= 0 ||
      !Number.isInteger(orderId) ||
      orderId <= 0 ||
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid food, order and rating details.",
      });
    }

    const [eligible] = await db.query(
      `SELECT o.id
       FROM orders o
       INNER JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = ?
       AND o.user_id = ?
       AND oi.food_id = ?
       AND LOWER(o.order_status) = 'delivered'
       LIMIT 1`,
      [orderId, userId, foodId]
    );

    if (!eligible.length) {
      return res.status(403).json({
        success: false,
        message: "You can only review food from your delivered orders.",
      });
    }

    const [existing] = await db.query(
      `SELECT id FROM food_reviews
       WHERE user_id = ? AND food_id = ? AND order_id = ?
       LIMIT 1`,
      [userId, foodId, orderId]
    );

    if (existing.length) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this food for this order.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO food_reviews
       (user_id, food_id, order_id, rating, review_text, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [
        userId,
        foodId,
        orderId,
        numericRating,
        review_text?.trim() || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Your review has been submitted for approval.",
      reviewId: result.insertId,
    });
  } catch (error) {
    console.error("ADD CUSTOMER REVIEW ERROR:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this food.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to submit your review.",
    });
  }
});


// UPDATE CUSTOMER REVIEW
router.put("/reviews/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = Number(req.params.id);
    const { rating, review_text } = req.body;

    const numericRating = Number(rating);

    if (
      !Number.isInteger(reviewId) ||
      reviewId <= 0 ||
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid rating.",
      });
    }

    const [existing] = await db.query(
      `SELECT id FROM food_reviews
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [reviewId, userId]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await db.query(
      `UPDATE food_reviews
       SET rating = ?,
           review_text = ?,
           status = 'Pending'
       WHERE id = ? AND user_id = ?`,
      [
        numericRating,
        review_text?.trim() || null,
        reviewId,
        userId,
      ]
    );

    return res.json({
      success: true,
      message: "Review updated and submitted for approval.",
    });
  } catch (error) {
    console.error("UPDATE CUSTOMER REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update your review.",
    });
  }
});


// DELETE CUSTOMER REVIEW
router.delete("/reviews/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = Number(req.params.id);

    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const [result] = await db.query(
      `DELETE FROM food_reviews
       WHERE id = ? AND user_id = ?`,
      [reviewId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE CUSTOMER REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete your review.",
    });
  }
});

module.exports = router;