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
    user: 'root',
    password: 'password',
    database: 'test' 
});

connection.connect();

const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Update query to use placeholders
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = shellQuote.parse(cmd); // Parse user input using shell-quote
    execFileSync(args[0], args.slice(1)); // Execute command with arguments
    res.send("Executed command successfully");
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

// Updated Endpoint with Rate Limiting
app.get('/secure', limiter, (req, res) => {
    // perform secure operation
    res.send("Secure operation performed");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});