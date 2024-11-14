// src/routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';
import authenticateToken from '../middleware/auth.js';
import db from '../models/index.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Google Authentication
router.get(
  '/google',
  (req, res, next) => {
    // Capture the 'register' query parameter
    const state = req.query.register ? 'register' : ''
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state,
      session: false,
    })(req, res, next)
  }
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  authController.googleCallback
)

router.get('/me', authenticateToken, async (req, res) => {
  const user = await db.User.findByPk(req.user.id, {
    attributes: ['id', 'username', 'email', 'is_pro'],
  })
  res.json({ user })
})

export default router;
