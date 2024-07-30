const express = require('express');
const mysql = require('mysql');
const { execFileSync } = require('child_process');
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

// Set up rate limiter: maximum of five requests per minute
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Apply rate limiter to vulnerable endpoints
app.use(['/user', '/exec'], limiter);

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${connection.escape(userId)}`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const cmdArgs = cmd.split(' ');
    execFileSync(cmdArgs[0], cmdArgs.slice(1), {stdio: 'pipe', encoding: 'utf-8'}).then((stdout) => {
        res.send(`Output: ${stdout}`);
    }).catch((error) => {
        res.send(`Error: ${error.stderr}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random();
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});