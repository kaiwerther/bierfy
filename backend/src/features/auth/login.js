// src/features/auth/login.js
import express from 'express';
import db from '../../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Route Definition
router.post('/login', loginHandler);

// Controller Function
async function loginHandler(req, res) {
  try {
    const { token, user } = await loginService(
      req.body.email,
      req.body.password
    );
    res.json({ token, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(400).json({ error: error.message });
  }
}

// Service Function
async function loginService(email, password) {
  const user = await db.User.scope('withSensitiveData').findOne({
    where: { email },
  });
  if (!user || !user.password) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, is_pro: user.is_pro },
    process.env.JWT_SECRET
  );
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      is_pro: user.is_pro,
    },
  };
}

export default router;
