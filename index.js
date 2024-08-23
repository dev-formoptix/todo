const express = require('express');
const mysql = require('mysql');
const { execFileSync } = require('child_process');
const RateLimit = require('express-rate-limit');
const shellQuote = require('shell-quote');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'test'
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ?`;
  connection.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  const args = shellQuote.parse(cmd); // Parse user input into an array of arguments
  execFileSync(args[0], args.slice(1)); // Fixed command injection vulnerability
  res.send('Command executed successfully');
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
  const randomNumber = Math.random(); // Insecure random number generation
  res.send(`Random number: ${randomNumber}`);
});

// Apply rate limiting to specific endpoints
const limiterUser = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

const limiterExec = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

app.get('/user', limiterUser, (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ?`;
  connection.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/exec', limiterExec, (req, res) => {
  const cmd = req.query.cmd;
  const args = shellQuote.parse(cmd); // Parse user input into an array of arguments
  execFileSync(args[0], args.slice(1)); // Fixed command injection vulnerability
  res.send('Command executed successfully');
});

// Apply rate limiting to all requests
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
app.use(limiter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});