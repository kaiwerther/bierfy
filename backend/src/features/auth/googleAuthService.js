// src/features/auth/googleAuthService.js
import db from '../../models/index.js';

export async function findOrCreateGoogleUser(profile) {
  const email = profile.emails[0].value;

  // Find user by Google ID
  let user = await db.User.findOne({ where: { google_id: profile.id } });

  if (user) {
    // User already exists with this Google ID
    return { user, merged: false };
  }

  // Find user by email
  const existingUser = await db.User.findOne({ where: { email } });

  if (existingUser) {
    // Merge accounts
    existingUser.google_id = profile.id;
    await existingUser.save();
    return { user: existingUser, merged: true };
  }

  // Create new user
  user = await db.User.create({
    username: profile.displayName,
    email,
    google_id: profile.id,
  });

  return { user, merged: false };
}
