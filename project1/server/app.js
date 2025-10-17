const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
require('dotenv').config();

require('./auth/passport');

const authRoutes = require('./auth/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, '..')));

app.use(authRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
