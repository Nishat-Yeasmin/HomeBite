
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const adminOnly = async (req, res, next) => {
  try {
    const [users] = await db.query(
      "SELECT id, email, role FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!users.length) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();

    if (
      user.email.toLowerCase().trim() !== adminEmail ||
      user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
    }

    next();
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(500).json({
      success: false,
      message: "Admin verification failed",
    });
  }
};

module.exports = { verifyToken, adminOnly };
