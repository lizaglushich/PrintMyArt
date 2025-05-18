# 🎨 PrintYourArt - Node.js AI Art Generator

A Node.js + Express web app that lets users generate AI art from text prompts, explore products, and experience a creative print shop demo.

---

## 📦 How to Run This Project

1. **Download and Install Node.js**  
   👉 [https://nodejs.org/en/download](https://nodejs.org/en/download)

2. **Open your terminal and move into the project folder**  
   ```bash
   cd path/to/your/project
   ```

3. **Install all required libraries**  
   ```bash
   npm install
   ```

4. **Start the server**  
   ```bash
   node index.js
   ```

5. **Visit the application in your browser**  
   🌐 [http://localhost:3000/](http://localhost:3000/)

---

## 🚀 Features

- 🧠 AI image generation from a prompt using DeepAI (or OpenAI)
- 🛍️ Product listing from a MySQL database
- 🔐 Simple login authentication
- 🎨 User-friendly UI with EJS and CSS
- 📦 Organized folder structure for assets and views

---

## 📁 Project Structure

```
PrintYourArt/
├── index.js              # Main Express app
├── auth.js               # Simple user authentication logic
├── views/                # EJS templates (generate.ejs, home.ejs, all.ejs, etc.)
├── public/               # Static files like CSS
│   └── css/
├── img/                  # Art images & mockup folders
├── .env                  # (Optional) API keys and configuration
├── package.json          # Project metadata & dependencies
└── README.md             # You're here!
```

---

## 🌐 App Routes

| Route              | Method | Description                                |
|-------------------|--------|--------------------------------------------|
| `/` or `/home`     | GET    | Landing page with navigation               |
| `/login`           | POST   | Logs in a user with username/password      |
| `/generate`        | GET    | Displays AI art generation form            |
| `/generate-image`  | POST   | Sends prompt to DeepAI and returns image   |
| `/all`             | GET    | Displays all products from the database    |
| `/shop?id=123`     | GET    | Product detail page with mockup carousel   |
| `/checkout`        | GET    | Simple checkout page (non-functional)      |

---

## 🔐 Default Demo Users

| Username | Password   |
|----------|------------|
| John     | Secret123  |
| Alice    | pass456    |


