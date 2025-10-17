const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';
const COOKIE_MAX_AGE = Number(process.env.COOKIE_MAX_AGE) || 7*24*60*60*1000;
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';


function setAuthCookie(res, user) {
  const payload = { id: user.id, email: user.email, name: user.name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax'
  });
}

router.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ error: 'User already exists' });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (provider, name, email, password_hash) VALUES (?, ?, ?, ?)', ['local', name, email, password_hash]);
    const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [result.insertId]);

    setAuthCookie(res, rows[0]);
    res.json({ ok: true, user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND provider = ?', [email, 'local']);
    if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    setAuthCookie(res, user);
    res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/api/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

router.get('/api/me', (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.json({ user: null });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ user: payload });
  } catch (err) {
    res.clearCookie(COOKIE_NAME);
    res.json({ user: null });
  }
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login.html?error=oauth' }),
  (req, res) => {
    setAuthCookie(res, req.user);
    res.redirect('/'); 
  }
);

module.exports = router;
