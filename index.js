const express = require('express');
const mysql = require('mysql');
const { execFileSync } = require('child_process');
const base64 = require('base-64');
const RateLimit = require('express-rate-limit');
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

// Rate limiter configuration
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Apply rate limiter to all requests
app.use(limiter);

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?'; // Use query parameter instead of injecting user input directly
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = shellQuote.parse(cmd);
    execFileSync(args[0], args.slice(1)); // GOOD
    res.send('Command executed successfully');
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

// Rate limiting for expensive operations
const expensiveOperationLimiter = RateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // maximum 10 requests per hour
});

// Apply rate limiter to endpoints performing expensive operations
app.get('/expensiveOperation1', expensiveOperationLimiter, (req, res) => {
    // Perform expensive operation 1 here
    res.send('Expensive operation 1 complete');
});

app.get('/expensiveOperation2', expensiveOperationLimiter, (req, res) => {
    // Perform expensive operation 2 here
    res.send('Expensive operation 2 complete');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});