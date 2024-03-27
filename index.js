const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const SqlString = require('sqlstring');
const RateLimit = require('express-rate-limit');

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

/**
 * @param {string} code The code to evaluate
 * @returns {*} The result of the evaluation
 */
function evaluateCode(code) {
    return eval(code); // Alert: Avoid using eval() function
}

const app = express();

// Create connection to MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'mydatabase'
});

// Connect to MySQL database
connection.connect();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Apply rate limiter to all requests
app.use(limiter);

// Endpoint to authenticate user
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Secure SQL query using query parameters
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

    // Execute the SQL query with query parameters
    connection.query(query, [username, password], (err, results) => {
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

// Endpoint to search for products
app.get('/search', (req, res) => {
    const category = req.query.category;

    // Secure SQL query using query parameters
    const query = `SELECT ITEM,PRICE FROM PRODUCT WHERE ITEM_CATEGORY = ? ORDER BY PRICE`;

    // Execute the SQL query with query parameters
    connection.query(query, [category], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.json(results);
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});