const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

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
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'mydatabase'
});

// Connect to MySQL database
connection.connect();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Apply rate limiting to specific routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Endpoint to authenticate user
app.post('/login', limiter, (req, res) => {
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

// Update the code to include rate limiting for the /:path route handler
app.get('/:path', limiter, (req, res) => {
  let path = req.params.path;
  if (isValidPath(path))
    res.sendFile(path);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});