const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const RateLimit = require('express-rate-limit');
const crypto = require('crypto');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'test'
});
connection.connect();

app.use(helmet()); // Use Helmet to configure HTTP headers

app.use(express.json()); // Parse JSON request bodies
app.use(mongoSanitize()); // Sanitize user input for MongoDB queries

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  let cmd = req.query.cmd.split(' ');
  cmd = cmd.map((arg) => arg.replace(/[`$();&|]+/g, ''));
  cmd = cmd.join(' '); // Join the command arguments back into a string
  execFile(cmd, (err, stdout, stderr) => { // Use execFile instead of exec
    if (err) {
      res.send(`Error: ${stderr}`);
      return;
    }
    res.send(`Output: ${stdout}`);
  });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
  const randomNumber = Math.random();  // Update to use Math.random() instead of crypto.randomInt(0, 100)
  res.send(`Random number: ${randomNumber}`);
});

// Implement rate limiting for vulnerable endpoints
const vulnerableLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
app.get('/user', vulnerableLimiter, (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/exec', vulnerableLimiter, (req, res) => {
  let cmd = req.query.cmd.split(' ');
  cmd = cmd.map((arg) => arg.replace(/[`$();&|]+/g, ''));
  cmd = cmd.join(' '); // Join the command arguments back into a string
  execFile(cmd, (err, stdout, stderr) => { // Use execFile instead of exec
    if (err) {
      res.send(`Error: ${stderr}`);
      return;
    }
    res.send(`Output: ${stdout}`);
  });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
  const randomNumber = crypto.randomInt(0, 100);  // Update to use crypto.randomInt(0, 100)
  res.send(`Random number: ${randomNumber}`);
});

// Implement rate limiting for all endpoints
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
app.use(limiter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});