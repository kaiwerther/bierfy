// src/features/auth/googleAuth.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Initiate Google OAuth
router.get('/google', initiateGoogleOAuth);

// Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  googleCallbackHandler
);

// Controller Functions
function initiateGoogleOAuth(req, res, next) {
  const state = req.query.register ? 'register' : '';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
    session: false,
  })(req, res, next);
}

async function googleCallbackHandler(req, res) {
  try {
    const user = req.user;

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, is_pro: user.is_pro },
      process.env.JWT_SECRET
    );

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&merged=${req.merged}`
    );
  } catch (error) {
    console.error('Error in Google callback:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export default router;
