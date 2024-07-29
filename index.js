const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const RateLimit = require('express-rate-limit');
const shellQuote = require('shell-quote');
const SqlString = require('sqlstring');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect();

// Rate Limiting Middleware
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
app.use(limiter);

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${SqlString.escape(userId)}`; // Sanitize input and use parameterized query
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    // Validate user input and do not execute the command directly
    // You can use libraries like 'shelljs' or 'execa' for safe command execution
    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Change Command Injection Vulnerable Endpoint
app.get('/exec-fixed', (req, res) => {
    const cmd = req.query.cmd;
    const cmdArgs = shellQuote.parse(cmd); // Use shell-quote to parse user input into an array of arguments
    // Validate user input and do not execute the command directly
    // You can use libraries like 'shelljs' or 'execa' for safe command execution
    exec(cmdArgs[0], cmdArgs.slice(1), (err, stdout, stderr) => { // Use command arguments as an array of strings
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});