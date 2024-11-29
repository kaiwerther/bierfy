// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    console.log('set user payload for url ', req.url);
    req.user = userPayload;
    next();
  });
}
