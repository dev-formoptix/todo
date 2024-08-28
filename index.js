const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const rateLimit = require('express-rate-limit');
const shellQuote = require('shell-quote');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost', 
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
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

// Rate Limit Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Apply Rate Limit Middleware to vulnerable endpoints
app.get('/user', limiter, (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/exec', limiter, (req, res) => {
    const cmd = req.query.cmd;
    const args = shellQuote.parse(cmd);
    exec(args[0], args.slice(1), (err, stdout, stderr) => {
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Apply Rate Limit Middleware to all other requests
app.use(limiter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});