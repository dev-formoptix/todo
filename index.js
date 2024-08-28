const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const { join } = require('path');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'test'
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${mysql.escape(userId)}`; // Escaping user input to prevent SQL injection
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = [cmd]; // Use command arguments as an array of strings

    execFile('/bin/sh', args, (err, stdout, stderr) => { // Executing shell command with execFile
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = crypto.randomInt(0, 100); // Secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // Apply MongoDB query sanitization middleware
app.use(helmet());

// Apply rate limiting middleware
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
app.use(limiter);

// Changing the code to limit the rate of expensive operations
app.get('/:path', limiter, (req, res) => {
  let filePath = req.params.path;
  const resolvedPath = path.resolve(filePath);
  const indexFilePath = join(__dirname, 'index.html');

  if (resolvedPath === indexFilePath) {
    res.sendFile(resolvedPath);
  } else {
    res.status(403).send('Access denied');
  }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Helper function to validate the path
function isValidPath(path) {
    // Implement necessary logic to validate the path
    // Return true if the path is valid, false otherwise
    // Example implementation:
    // return path.startsWith('/public/');
    return true;
}