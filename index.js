const express = require('express');
const mysql = require('mysql');
const { execFileSync } = require('child_process');
const rateLimit = require("express-rate-limit");

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Use query parameters to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    // Use a secure method to execute the command and prevent command injection
    execFileSync(cmd.split(' ')[0], cmd.split(' ').slice(1), { stdio: 'inherit' });
    res.send('Command executed successfully');
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

// Apply rate limiting middleware to all routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // max 100 requests per windowMs
});
app.use(limiter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});  
