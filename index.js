const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const RateLimit = require('express-rate-limit');
const app = express();
const port = 3000;
const crypto = require('crypto'); // Import crypto module
const mongoSanitize = require('express-mongo-sanitize');

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'test' 
});

connection.connect();

// SQL Injection Vulnerable Endpoint
const sqlLimiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

app.get('/user', sqlLimiter, (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?'; // Use parameters to prevent SQL Injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
const commandLimiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

app.get('/exec', commandLimiter, (req, res) => {
    const cmd = req.query.cmd;
    const commandArguments = cmd.split(" "); // Split command into arguments
    const safeCommandArguments = commandArguments.map(arg => arg.replace(/[`$();&|]+/g, '')); // Clean arguments
    exec(safeCommandArguments[0], safeCommandArguments.slice(1), (err, stdout, stderr) => { // Use cleaned arguments to execute command safely
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
const randomLimiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

app.get('/random', randomLimiter, (req, res) => {
    const randomNumber = crypto.randomInt(0, 100); // Use crypto.randomInt for secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});