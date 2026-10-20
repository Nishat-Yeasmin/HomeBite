const dns = require("node:dns")
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./db");
const categoryRoutes = require("./categoryRoutes");
const foodRoutes = require("./foodRoutes");
const authRoutes = require("./authRoutes");

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
      "SELECT DATABASE() AS database_name"
    );

    res.json({
      message: "MySQL connected successfully!",
      database: rows[0].database_name,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Category API
app.use("/api/categories", categoryRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`HomeBite server running on port ${PORT}`);
});

module.exports = { app, db };