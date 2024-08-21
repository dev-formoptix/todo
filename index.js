const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)


connection.connect();

// SQL Injection Vulnerable Endpoint


// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
}

// Insecure Random Number Generation
app.get('/random', (req, res) => {
  const randomNumber = Math.random(); // Insecure random number generation
  res.send(`Random number: ${randomNumber}`);
});

// Apply rate limiter to specific routes to prevent denial-of-service attacks
const userLimiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute
});
app.get('/user', userLimiter, (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ?`; // Using query parameters to prevent SQL injection
  connection.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

const execLimiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute
});
app.get('/exec', execLimiter, (req, res) => {
  const cmd = req.query.cmd;
  const args = shellQuote.parse(cmd);
  execFileSync(args[0], args.slice(1), { stdio: 'pipe' }); // Executing command with parsed arguments
  res.send(`Command executed successfully.`);
});

const randomLimiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute
});
app.get('/random', randomLimiter, (req, res) => {
  const randomNumber = Math.random(); // Insecure random number generation
  res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
