const express = require('express');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');

const app = express();

// Parse incoming request bodies
app.use(bodyParser.json());

// MySQL configuration
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
  } else {
    console.log('Connected to MySQL server');
  }
});

// Set up rate limiter: maximum of five requests per minute
const limiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
});

// Apply rate limiter to all requests
app.use(limiter);

// Login endpoint
app.post('/login', limiter, (req, res) => {
  // Perform database access
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else if (result.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      res.json({ message: 'Login successful' });
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});