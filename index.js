// Import required modules
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const fs = require('fs');
const session = require('express-session');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.static("home"));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(session({
  secret: 'mySecretKey123',
  resave: false,
  saveUninitialized: true
}));

// MySQL setup
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'g00472877'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Authentication module
const auth = require('./auth');
auth.createUser("John", "Secret123");
auth.createUser("Alice", "pass456");
auth.createUser("user@123.com", "pass");

// ==== ROUTES ====

// Root → login page
app.get("/", (req, res) => {
  res.render("login.ejs", { message: null, username: null });
});

// Login page
app.get("/login", (req, res) => {
  res.render("login.ejs", { message: null, username: null });
});

// Login submit
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const authenticated = auth.authenticateUser(username, password);
  console.log("Login attempt:", username, password);

  if (authenticated) {
    req.session.username = username;
    res.redirect("/home");
  } else {
    res.render("login.ejs", {
      message: "❌ Authentication failed. Try again.",
      username: null
    });
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Home
app.get("/home", (req, res) => {
  res.render("home.ejs", { username: req.session.username });
});

// All products
app.get("/all", (req, res) => {
  connection.query("SELECT * FROM productdata", (err, rows) => {
    if (err) {
      console.error('Error retrieving data:', err);
      return res.status(500).send('Database error');
    }
    res.render("all.ejs", {
      products: rows,
      username: req.session.username
    });
  });
});

// Generate art
app.get("/generate", (req, res) => {
  if (req.session.username) {
    res.render("generate", { username: req.session.username });
  } else {
    res.redirect("/login");
  }
});

// Generate image API
app.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post('https://api.deepai.org/api/text2img', {
      text: prompt
    }, {
      headers: {
        'Api-Key': process.env.DEEPAI_API_KEY
      }
    });

    const imageUrl = response.data.output_url;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Image generation error:", error.response?.data || error.message);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// Product detail
app.get("/shop", (req, res) => {
  const ID = req.query.id;
  connection.query("SELECT * FROM productdata WHERE id = ?", [ID], (err, rows) => {
    if (err || rows.length === 0) return res.status(404).send("Product not found");

    const product = rows[0];
    const mockupFolder = product.MockupFolder;
    const mockupPath = path.join(__dirname, 'img', 'mocks_by_picture', mockupFolder);

    let totalMockups = 0;
    try {
      const files = fs.readdirSync(mockupPath);
      totalMockups = files.filter(file => /^mock\d+\.jpg$/.test(file)).length;
    } catch (error) {
      console.error('Error reading mockup folder:', error);
    }

    res.render("test.ejs", {
      myMessage: product.ArtName,
      Artist: product.Artist,
      PriceToPrint: product.PriceToPrint,
      image: product.Image,
      Description: product.Description,
      product: product,
      totalMockups: totalMockups,
      username: req.session.username
    });
  });
});

// Contact page
app.get("/contact", (req, res) => {
  res.render("contact", { username: req.session.username });
});

// Contact form submission
app.post("/send-message", (req, res) => {
  const { name, email, message } = req.body;
  console.log("Message received:", { name, email, message });
  res.send("✅ Message received! We'll be in touch soon.");
});

// Checkout page
app.get("/checkout", (req, res) => {
  if (req.session.username) {
    res.render("checkout", { username: req.session.username });
  } else {
    res.redirect("/login");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
