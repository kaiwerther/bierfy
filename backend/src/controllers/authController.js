// src/controllers/authController.js
import authService from '../services/authService.js';
import jwt from 'jsonwebtoken';


class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { token, user } = await authService.login(req.body.email, req.body.password);
      res.json({ token, user});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async googleCallback(req, res) {
    // Generate JWT Token
    const { user, merged } = req.userData

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, is_pro: user.is_pro },
      process.env.JWT_SECRET
    )
    // Send token to client by redirecting to frontend URL
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&merged=${merged}`
    );
  }
}


export default new AuthController();