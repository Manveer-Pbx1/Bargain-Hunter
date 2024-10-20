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
const cron = require('node-cron');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
connectDB();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'revistergetconsistent@gmail.com', 
    pass: 'kamj xxkx ljrz elsn' 
  }
});

const verificationCodes = {};

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized hai bhai" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err){ 
      console.log("error: ", err);
      return res.status(401).json({ message: "Unauthorized" });
  }
    req.user = decoded; 
    next();
  });
};

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

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    verificationCodes[email] = verificationCode;

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

app.post('/verify', (req, res) => {
  const { email, verificationCode } = req.body;

  if (verificationCodes[email] === parseInt(verificationCode)) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid verification code." });
  }
});

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

  const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, 
    maxAge: 3600000, 
  });

  res.json({ success: true, message: "Logged in successfully", token });
});

app.get('/auth-check', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ authenticated: false });

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.json({ authenticated: false });
    }
    res.json({ authenticated: true });
  });
});

app.get('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false
  });
  res.json({success: true, message: "Logged out successfully"});
});

app.post('/products', authenticateUser, async (req, res) => {
  const { title, price, rating, imgURL, url } = req.body;  

  try {
    const newProduct = new Product({
      title,
      price,  
      rating,  
      imgURL,
      url,
      user: req.user.id, 
    });
    console.log("Saving product...");
    await newProduct.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { products: newProduct._id },
    });

    res.json({ success: true, product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product" });
  }
});

app.get('/products', authenticateUser, async (req, res) => {
  try {
    const userProducts = await Product.find({ user: req.user.id});
    res.json({ success: true, products: userProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

//route to delete product
app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
    
    if (deletedProduct) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
});


app.get('/scrape', async (req, res) => {
  const url = req.query.url;  
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    try {
      const userId = decoded.id; 
      const productData = await scrape(url);

      console.log('Scraped Product Data:', productData);

      if (!productData.title || !productData.price || !productData.rating) {
        return res.status(400).json({ error: 'Missing product data fields (title, price, or rating)' });
      }

      const newProduct = new Product({
        title: productData.title,
        price: productData.price,
        rating: productData.rating,
        imgURL: productData.imgURL,
        url: productData.url,
        user: userId
      });

      res.json(productData);
    } catch (error) {
      console.error('Error scraping data:', error);
      res.status(500).json({ error: 'Failed to scrape the data' });
    }
  });
});

const sendPriceChangeEmail = async (email, productTitle, oldPrice, newPrice) => {
  const mailOptions = {
    from: 'revistergetconsistent@gmail.com',
    to: email,
    subject: `Price Change Alert for ${productTitle}`,
    text: `The price of ${productTitle} has changed from ${oldPrice} to ${newPrice}.`
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} for price change in ${productTitle}`);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

cron.schedule('* * * * *', async () => {  
  console.log("Running scheduled price check...");

  try {
    const products = await Product.find({});
    
    for (const product of products) {
      const scrapedData = await scrape(product.url);

      if(scrapedData.price === product.price)
        console.log("Price has not changed for ", product.title, scrapedData.price, product.price);
      if (scrapedData.price !== product.price) {
        const oldPrice = parseInt(product.price);
        const newPrice = parseInt(scrapedData.price);

        product.price = newPrice;
        await product.save();

        const user = await User.findById(product.user);
        if (user) {
          console.log("Sending mail...")
          await sendPriceChangeEmail(user.email, product.title, oldPrice, newPrice);
        }
      }
    }
    console.log("Price check completed successfully.");
  } catch (error) {
    console.error("Error during price check:", error);
  }
});

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
