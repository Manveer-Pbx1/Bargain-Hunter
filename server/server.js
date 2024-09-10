const express = require('express');
const { scrape } = require('./scrape.js');
const cors = require('cors');
const connectDB = require('./connect.js');
const User = require('./models/User.js');
const Product = require('./models/Product.js');
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

// Middleware to authenticate the user
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized hai bhai" });

  jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', (err, decoded) => {
    if (err){ 
      console.log("error: ", err);
      return res.status(401).json({ message: "Unauthorized" });
  }
    req.user = decoded; // Save user info from token
    next();
  });
};

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
  const token = jwt.sign({ username: user.username, id: user._id }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', { expiresIn: '1h' });

  // Set token as cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, 
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
  res.json({success: true, message: "Logged out successfully"});
});

// Route to add a product for the logged-in user
app.post('/products', authenticateUser, async (req, res) => {
  const { title, price, rating, imgURL } = req.body;  // Use 'price', 'rating' instead of 'priceTxt', 'ratingTxt'

  try {
    const newProduct = new Product({
      title,
      price,   // Update this to 'price' to match the schema
      rating,  // Update this to 'rating'
      imgURL,
      user: req.user.id, // Associate product with logged-in user
    });
    await newProduct.save();

    // Also update user's product list
    await User.findByIdAndUpdate(req.user.id, {
      $push: { products: newProduct._id },
    });

    res.json({ success: true, product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// Route to get products for the logged-in user
app.get('/products', authenticateUser, async (req, res) => {
  try {
    const userProducts = await Product.find({ user: req.user.id});
    res.json({ success: true, products: userProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Scrape route (example)
app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    try {
      const userId = decoded.id; // Assuming the token has the user ID
      const productData = await scrape(url);

      // Log productData to check what's being scraped
      console.log('Scraped Product Data:', productData);

      // Check if any fields are missing
      if (!productData.title || !productData.price || !productData.rating) {
        return res.status(400).json({ error: 'Missing product data fields (title, price, or rating)' });
      }

      const newProduct = new Product({
        title: productData.title,
        price: productData.price,
        rating: productData.rating,
        imgURL: productData.imgURL,
        user: userId
      });

      // await newProduct.save();
      res.json(productData);
    } catch (error) {
      console.error('Error scraping data:', error);
      res.status(500).json({ error: 'Failed to scrape the data' });
    }
  });
});





app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
