const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const categoryRoutes = require("./routes/categoryRoutes");
const foodRoutes = require("./routes/foodRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Backend test
app.get("/", (req, res) => {
  res.send("HomeBite Backend is Running!");
});

// Database connection test
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT DATABASE() AS database_name, VERSION() AS db_version"
    );

    res.json({
      success: true,
      message: "Database connected successfully!",
      database: rows[0].database_name,
      version: rows[0].db_version,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
      code: error.code,
    });
  }
});

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", orderRoutes);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`HomeBite server running on port ${PORT}`);
  });
}

module.exports = { app, db };