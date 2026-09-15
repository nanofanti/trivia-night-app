import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check that both fields were provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find the admin
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare entered password with hashed password
    const passwordIsCorrect = await bcrypt.compare(password, admin.password);

    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is missing.");
    }

    // Create login token
    const token = jwt.sign(
      {
        adminId: admin._id,
      },
      jwtSecret,
      {
        expiresIn: "2h",
      },
    );

    return res.json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error.",
    });
  }
});

export default router;
