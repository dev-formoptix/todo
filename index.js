const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');

/**
 * @param {string} code The code to evaluate
 * @returns {*} The result of the evaluation
 */
function evaluateCode(code) {
  return eval(code); // Alert: Avoid using eval() function
}

// Example usage triggering the alert
evaluateCode("2 + 2");

const app = express();

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER || 'root', // Set default username as 'root'
  password: process.env.DB_PASSWORD || 'password', // Set default password as 'password'
  database: 'mydatabase'
});

// Connect to MySQL database
connection.connect();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// set up rate limiter: maximum of five requests per minute
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

// Middleware to limit expensive operations
app.use((req, res, next) => {
  if (req.originalUrl === '/login') {
    // Allow unlimited requests for login route
    next();
  } else {
    // Limit requests for other routes
    if (expensiveOperationInProgress) {
      return res.status(429).send('Too Many Requests');
    } else {
      expensiveOperationInProgress = true;
      setTimeout(() => {
        expensiveOperationInProgress = false;
        next();
      }, 500); // Adjust the timeout as per the actual time taken by the expensive operation
    }
  }
});

// Endpoint to authenticate user
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Use query parameters to prevent SQL injection
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const values = [username, password];

  // Execute the SQL query with query parameters
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      res.send('Login successful');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});