const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
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
    const args = shellQuote.parse(cmd); // Split user input into an array of arguments
    exec(args[0], args.slice(1), (err, stdout, stderr) => { // Use exec with an array of arguments to prevent command injection
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

// Rate limiting middleware
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

const databaseAccessHandler = (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Use query parameters to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
};

const commandExecutionHandler = (req, res) => {
    const cmd = req.query.cmd;
    const args = shellQuote.parse(cmd); // Split user input into an array of arguments
    exec(args[0], args.slice(1), (err, stdout, stderr) => { // Use exec with an array of arguments to prevent command injection
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
};

app.get('/user', limiter, databaseAccessHandler);

app.get('/exec', limiter, commandExecutionHandler);

// Insecure Random Number Generation
app.get('/random', limiter, (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});