const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const path = require("path");

const categoryRoutes = require("./routes/categoryRoutes");
const foodRoutes = require("./routes/foodRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const customerRoutes = require("./routes/customerRoutes");
const customerOrderRoutes = require("./routes/customerOrderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const offerRoutes = require("./routes/offerRoutes");


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


app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/customer/orders", customerOrderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/offers", offerRoutes);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`HomeBite server running on port ${PORT}`);
  });
}


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});


module.exports = { app, db };