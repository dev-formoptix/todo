const express = require('express');
const mysql = require('mysql');
const { execFileSync } = require('child_process');
const shellQuote = require('shell-quote');

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

// Importing the express-rate-limit package
const RateLimit = require('express-rate-limit');

// Setting up the rate limiter: maximum of five requests per minute
const limiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute
});

// Applying the rate limiter to all requests
app.use(limiter);

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
  const cmd = req.query.cmd;
  execFileSync('wc', shellQuote.parse(cmd)); // Using shell-quote to parse command argument
  res.send(`Command executed successfully`);
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
  const randomNumber = Math.random(); // Insecure random number generation
  res.send(`Random number: ${randomNumber}`);
});

// Adding rate limiting to the vulnerable endpoints
const vulnerableEndpoints = ['/user', '/exec', '/random'];

app.use((req, res, next) => {
  if (vulnerableEndpoints.includes(req.path)) {
    limiter(req, res, next);
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});