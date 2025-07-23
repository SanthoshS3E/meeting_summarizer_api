import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;// same as in auth.js

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing Bearer token' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    console.log('✅ verifyToken decoded user:', user); // Debug log
    req.user = user; // ✅ now has {id, email}
    next();
  });
}
