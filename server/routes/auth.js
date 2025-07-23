import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { initDB } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;
const router = express.Router();
// 🔒 Use env var in production

// ✅ Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email & password required" });

  try {
    const db = await initDB();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword]);
    res.json({ success: true, message: "User created successfully" });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email & password required" });

  try {
    const db = await initDB();
    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials" });

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
