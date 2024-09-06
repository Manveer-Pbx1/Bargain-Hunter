const express = require('express');
const { scrape } = require('./scrape.js');
const cors = require('cors');
const connectDB = require('./connect.js');
const User = require('./models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Add cookie-parser

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser
connectDB();

// sign up
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await User.findOne({ email }); // Corrected the user lookup

  if (userExists) {
    return res.json({ success: false, message: "User already exists" });
  }

  try {
    const hashedPass = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({ username, email, password: hashedPass });
    await newUser.save(); // Save the user

    // Generate JWT token
    const token = jwt.sign({ email }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', { expiresIn: '1h' });

    // Set token as cookie (you can add options for secure, httpOnly, etc.)
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true in production for HTTPS
      maxAge: 3600000, // 1 hour
    });

    res.json({ success: true, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error signing up user" });
  }
});

app.get('/auth-check', (req,res) => {
  const token = req.cookies.token;
  if(!token)
    return res.json({authenticated: false});
  jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', (err) => {
    if(err){
      return res.json({authenticated: false});
    }
    res.json({authenticated: true});
  })
})

app.get('/scrape', async (req, res) => {
  const url = req.query.url; // Pass the URL as a query parameter

  try {
    const productData = await scrape(url); // Get the scraped data
    res.json(productData); // Send the data as a JSON response
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape the data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
