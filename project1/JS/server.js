const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();

mongoose.connect('mongodb://localhost:27017/loginDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,  
    googleId: String  
});

const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',  
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',  
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value
            });
            await user.save();
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'Email already exists' });
        }
        const newUser = new User({ name, email, password });  
        await newUser.save();
        res.json({ success: true, message: 'Registered successfully' });
    } catch (err) {
        res.json({ success: false, message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true, message: 'Logged in successfully' });
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        res.json({ success: false, message: 'Error logging in' });
    }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard'); 
    }
);


app.use(express.static('public')); 

app.listen(3000, () => console.log('Server running on port 3000'));