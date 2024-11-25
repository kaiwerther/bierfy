// src/features/auth/register.js
import express from 'express';
import db from '../../models/index.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Route Definition
router.post('/register', registerHandler);

// Controller Function
async function registerHandler(req, res) {
  try {
    const user = await registerService(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: error.message });
  }
}

// Service Function
async function registerService(data) {
  const existingUserByEmail = await db.User.findOne({
    where: { email: data.email },
  });
  if (existingUserByEmail) {
    throw new Error('Email is already registered');
  }

  // Check for existing username
  const existingUserByUsername = await db.User.findOne({
    where: { username: data.username },
  });
  if (existingUserByUsername) {
    throw new Error('Username is already taken');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await db.User.create({
    username: data.username,
    email: data.email,
    password: hashedPassword,
  });

  // Exclude sensitive data
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

export default router;
