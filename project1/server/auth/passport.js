const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    const provider_id = profile.id;
    const name = profile.displayName || (email ? email.split('@')[0] : 'GoogleUser');
    const avatar = profile.photos && profile.photos[0] && profile.photos[0].value;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE (provider = ? AND provider_id = ?) OR email = ?',
      ['google', provider_id, email]
    );

    if (rows.length > 0) {
      return done(null, rows[0]);
    } else {
      const [res] = await pool.query(
        'INSERT INTO users (provider, provider_id, name, email, avatar) VALUES (?, ?, ?, ?, ?)',
        ['google', provider_id, name, email, avatar]
      );
      const [newRows] = await pool.query('SELECT * FROM users WHERE id = ?', [res.insertId]);
      return done(null, newRows[0]);
    }
  } catch (err) {
    return done(err, null);
  }
}));
