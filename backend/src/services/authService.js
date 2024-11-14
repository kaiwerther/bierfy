// src/services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

class AuthService {
  async register(data) {
    const existingUserByEmail = await db.User.findOne({ where: { email: data.email } })
    if (existingUserByEmail) {
      throw new Error('Email is already registered')
    }

    // Check for existing username
    const existingUserByUsername = await db.User.findOne({ where: { username: data.username } })
    if (existingUserByUsername) {
      throw new Error('Username is already taken')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await db.User.create({
      username: data.username,
      email: data.email,
      password: hashedPassword
    });


    
    return user;
  }

  async login(email, password) {
    const user = await db.User.scope('withSensitiveData').findOne({ where: { email } });
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
    }
  }

  async findOrCreateGoogleUser(profile) {
    const email = profile.emails[0].value

    // Find user by Google ID
    let user = await db.User.findOne({ where: { google_id: profile.id } })

    if (user) {
      // User already exists with this Google ID
      return { user, merged: false }
    }

    // Find user by email
    const existingUser = await db.User.findOne({ where: { email } })

    if (existingUser) {
      // Merge accounts
      existingUser.google_id = profile.id
      await existingUser.save()
      return { user: existingUser, merged: true }
    }

    // Create new user
    user = await db.User.create({
      username: profile.displayName,
      email,
      google_id: profile.id,
    })

    return { user, merged: false }
  }
}
export default new AuthService();
