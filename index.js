const express = require('express');
const mysql = require('mysql');
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
    const query = 'SELECT * FROM users WHERE id = ?'; // Using query parameters
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const cmdArgs = shellQuote.parse(cmd); // Parsing the user input using shell-quote
    try {
        const output = execFileSync(cmdArgs[0], cmdArgs.slice(1)); // Executing the command using execFileSync
        res.send(`Output: ${output}`);
    } catch (err) {
        res.send(`Error: ${err.message}`);
    }
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});