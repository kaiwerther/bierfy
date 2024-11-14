// src/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authService from '../services/authService.js';
import db from '../models/index.js';

// src/config/passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, // Pass req to the callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const { user, merged } = await authService.findOrCreateGoogleUser(profile)
        req.userData = { user, merged } // Attach userData to req
        done(null, user)
      } catch (error) {
        done(error, null)
      }
    }
  )
)


// Serialize and deserialize user instances to and from the session.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;