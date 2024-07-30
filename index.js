const express = require('express');
const mysql = require('mysql');
const { execFileSync } = require('child_process');
const shellQuote = require('shell-quote');
const rateLimit = require("express-rate-limit");

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

// SQL Injection Vulnerable Endpoint with rate limiting
app.get('/user', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
}), (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Change query to use query parameters
    connection.query(query, [userId], (err, results) => { // Pass user input as an array of query parameters
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint with rate limiting
app.get('/exec', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
}), (req, res) => {
    const cmd = req.query.cmd;
    const cmdArgs = shellQuote.parse(cmd);
    execFileSync(cmdArgs[0], cmdArgs.slice(1)); // Executing command safely using the provided input
    res.send('Command executed successfully.');
});

// Insecure Random Number Generation with rate limiting
app.get('/random', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
}), (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});