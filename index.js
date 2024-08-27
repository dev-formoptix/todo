const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const RateLimit = require('express-rate-limit');

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

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`; // Vulnerable to SQL injection
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  exec(cmd, (err, stdout, stderr) => { // Vulnerable to command injection
    if (err) {
      res.send(`Error: ${stderr}`);
      return;
    }
    res.send(`Output: ${stdout}`);
  });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
  const randomNumber = Math.random(); // Insecure random number generation
  res.send(`Random number: ${randomNumber}`);
});

// Implement rate limiting for vulnerable endpoints
const vulnerableLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

app.get('/user', vulnerableLimiter, (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`; // Vulnerable to SQL injection
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/exec', vulnerableLimiter, (req, res) => {
  const cmd = req.query.cmd;
  exec(cmd, (err, stdout, stderr) => { // Vulnerable to command injection
    if (err) {
      res.send(`Error: ${stderr}`);
      return;
    }
    res.send(`Output: ${stdout}`);
  });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
  const randomNumber = Math.random(); // Secure random number generation
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