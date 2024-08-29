const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const RateLimit = require('express-rate-limit');
const shellQuote = require('shell-quote');
const sqlstring = require('sqlstring'); // Import the sqlstring library

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: 'test'
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${sqlstring.escape(userId)}`; // Use sqlstring.escape to prevent SQL injection
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = shellQuote.parse(cmd); // Parsing user input into command arguments
    execFile(args[0], args.slice(1), (err, stdout, stderr) => { // Using execFile instead of exec to prevent command injection
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

// Apply rate limiter to vulnerable endpoints
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});
app.use(['/user', '/exec'], limiter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});