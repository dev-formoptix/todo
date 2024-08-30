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
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'test' 
});

connection.connect();

const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

// SQL Injection Vulnerable Endpoint
app.get('/user', limiter, (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Fixed query to use parameterized query
    connection.query(query, [userId], (err, results) => { // Pass user input as a parameter
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', limiter, (req, res) => {
    const cmd = req.query.cmd;
    const cmdArgs = shellQuote.parse(cmd); // Parse user input into an array of arguments
    execFileSync(cmdArgs[0], cmdArgs.slice(1), { stdio: 'inherit' }); // Execute the command safely
});

// Insecure Random Number Generation
app.get('/random', limiter, (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

// Database Access Endpoint
// Updated code to include rate limiting
app.get('/data', limiter, (req, res) => {
    const data = getData(); // Perform database access
    res.send(data);
});

function getData() {
    // Perform database query to get data
    return "Some data from the database";
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});