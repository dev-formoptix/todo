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

// Create connection to MySQL database with rate-limited queries
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydatabase',
  queryLimit: 100 // Set the maximum number of queries per windowMs (default is 100)
});

// Connect to MySQL database
connection.connect();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Set up rate limiter: maximum of 100 queries per minute
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // max 100 queries per windowMs
});
app.use(limiter);

// Endpoint to authenticate user
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Use query parameters to embed user input into the SQL query
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const params = [username, password];

  // Execute the SQL query
  connection.query(query, params, (err, results) => {
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