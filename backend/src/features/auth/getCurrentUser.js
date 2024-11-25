// src/features/auth/getCurrentUser.js
import express from 'express';
import authenticateToken from '../../middleware/auth.js';
import db from '../../models/index.js';

const router = express.Router();

// Route Definition
router.get('/me', authenticateToken, getCurrentUserHandler);

// Controller Function
async function getCurrentUserHandler(req, res) {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email'],
    });
    res.json({ user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export default router;
