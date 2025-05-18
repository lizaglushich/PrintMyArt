// Import required modules
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const fs = require('fs');
require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

const app = express(); // define app first
app.use(express.json()); // now it's valid to use


app.get('/home', (req, res) => {
  res.render('home');
});


// Configure app to use bodyParser middleware for handling form data
app.use(express.urlencoded({ extended: true }));

app.use('/css', express.static(__dirname + '/public/css'));

// Import authentication module (no router)
const auth = require('./auth');

// Create two users for testing authentication
auth.createUser("John", "Secret123");
auth.createUser("Alice", "pass456");
auth.createUser("Dudu", "password");
auth.createUser("Bubu", "password");

// Test the authentication function
console.log(auth.authenticateUser("John", "Secret123")); // true
console.log(auth.authenticateUser("John", "Secret987")); // false

// Connect to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'proddata'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
  } else {
    console.log('Connected to database!');
  }
});

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY" // replace with your real key
});

app.use(express.json()); // Required to parse JSON request body


// Set view engine and static directories
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("home"));
app.use('/img', express.static(path.join(__dirname, 'img')));

// Routes

app.get("/login", (req, res) => {
  res.render("login", { message: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const authenticated = auth.authenticateUser(username, password);
  console.log("Received:", username, password);


  if (authenticated) {
    res.render("home", { username });
  } else {
    res.render("failed", { message: "❌ Authentication failed. Try again." });
  }
});

app.get("/all", (req, res) => {
  connection.query("SELECT * FROM productdata", (err, rows) => {
    if (err) {
      console.error('Error retrieving all data from database: ', err);
      return res.status(500).send('Error retrieving all data from database');
    }
    res.render("all.ejs", { products: rows });
  });
});

// AI connection block starts here

app.get("/generate", (req, res) => {
  res.render("generate");
});
const axios = require('axios');

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
    console.error("DeepAI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// ends here


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
      totalMockups = files.filter(file => file.match(/^mock\d+\.jpg$/)).length;
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
      totalMockups: totalMockups 
    });
  });
});



// checkout
app.get('/checkout', (req, res) => {
  res.render("checkout");
});


// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
