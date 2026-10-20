
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
const crypto = require("crypto");
const router = express.Router();

// Customer Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await db.query(
      `INSERT INTO users
       (name, email, password_hash, phone, role)
       VALUES (?, ?, ?, ?, 'customer')`,
      [
        name.trim(),
        normalizedEmail,
        passwordHash,
        phone?.trim() || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
        role: "customer",
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// Customer/Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await db.query(
      `SELECT id, name, email, password_hash, role
       FROM users
       WHERE email = ?`,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});


// Google Sign Up / Login
router.post("/google", async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Google access token is required",
      });
    }

    // Verify the access token with Google
    const tokenInfoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
    );

    if (!tokenInfoResponse.ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google access token",
      });
    }

    const tokenInfo = await tokenInfoResponse.json();

    if (
      tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID ||
      !tokenInfo.email ||
      tokenInfo.email_verified !== "true"
    ) {
      return res.status(401).json({
        success: false,
        message: "Google account verification failed",
      });
    }

    // Get verified Google profile
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!profileResponse.ok) {
      return res.status(401).json({
        success: false,
        message: "Could not retrieve Google profile",
      });
    }

    const googleUser = await profileResponse.json();
    const email = googleUser.email?.trim().toLowerCase();

    if (
      !googleUser.sub ||
      !email ||
      email !== tokenInfo.email.trim().toLowerCase() ||
      googleUser.email_verified !== true
    ) {
      return res.status(401).json({
        success: false,
        message: "Verified Google email is required",
      });
    }

    const name = googleUser.name?.trim() || email.split("@")[0];

    // Check whether the user already exists
    const [existingUsers] = await db.query(
      `SELECT id, name, email, role
       FROM users
       WHERE email = ?`,
      [email]
    );

    let user;

    if (existingUsers.length > 0) {
      user = existingUsers[0];
    } else {
      // Create a new customer account
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const passwordHash = await bcrypt.hash(randomPassword, 12);

      const [result] = await db.query(
        `INSERT INTO users
         (name, email, password_hash, role)
         VALUES (?, ?, ?, 'customer')`,
        [name, email, passwordHash]
      );

      user = {
        id: result.insertId,
        name,
        email,
        role: "customer",
      };
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
});


module.exports = router;
