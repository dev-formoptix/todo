const express = require('express');
const mysql = require('mysql');
const { execFileSync } = require('child_process');
const RateLimit = require('express-rate-limit');
const app = express();
const port = 3000;
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const shellQuote = require('shell-quote');

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
    const query = 'SELECT * FROM users WHERE id = ?';
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
    const commandArguments = shellQuote.parse(cmd);
    execFileSync(commandArguments[0], commandArguments.slice(1), (err, stdout, stderr) => {
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
    const randomNumber = crypto.randomInt(0, 100);
    res.send(`Random number: ${randomNumber}`);
});

app.use(helmet());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});