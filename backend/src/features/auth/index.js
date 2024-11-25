// src/features/auth/index.js
import express from 'express';

import registerRouter from './register.js';
import loginRouter from './login.js';
import googleAuthRouter from './googleAuth.js';
import getCurrentUserRouter from './getCurrentUser.js';

const router = express.Router();

// Combine routes
router.use('/', registerRouter); // POST '/register'
router.use('/', loginRouter); // POST '/login'
router.use('/', googleAuthRouter); // '/google', '/google/callback'
router.use('/', getCurrentUserRouter); // GET '/me'

export default router;
