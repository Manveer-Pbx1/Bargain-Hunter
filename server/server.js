const express = require('express');
const { scrape } = require('./scrape.js');
const cors = require('cors');
const connectDB = require('./connect.js');
const User = require('./models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
connectDB();

// nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'revistergetconsistent@gmail.com', // Use your Gmail account
    pass: 'kamj xxkx ljrz elsn' // Gmail app password, not your login password
  }
});

const verificationCodes = {};

// Sign-up route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.json({ success: false, message: "User already exists" });
  }

  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPass });
    await newUser.save();

    // Generate a random verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    verificationCodes[email] = verificationCode;

    // Email options
    const mailOptions = {
      from: 'revistergetconsistent@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Hello ${username}, thanks for signing up. Your verification code is ${verificationCode}.`
    };

    // Send the verification email
    transporter.sendMail(mailOptions, (e, info) => {
      if (e) {
        console.log(e);
        res.status(500).json({ message: "Error sending verification email" });
      } else {
        res.json({ success: true, message: "Verification code sent. Please verify your email." });
      }
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error signing up user" });
  }
});

// Email verification route
app.post('/verify', (req, res) => {
  const { email, verificationCode } = req.body;

  if (verificationCodes[email] === parseInt(verificationCode)) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid verification code." });
  }
});

// Login route with cookie generation
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.json({ success: false, message: "Invalid password" });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', { expiresIn: '1h' });

  // Set token as cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    maxAge: 3600000, // 1 hour
  });

  res.json({ success: true, message: "Logged in successfully", token });
});

// Check authentication status
app.get('/auth-check', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ authenticated: false });

  jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', (err) => {
    if (err) {
      return res.json({ authenticated: false });
    }
    res.json({ authenticated: true });
  });
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false
  });
  res.json({success: true, message: "Logged out successfully"})
});

// Scrape route (example)
app.get('/scrape', async (req, res) => {
  const url = req.query.url;

  try {
    const productData = await scrape(url);
    res.json(productData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape the data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
