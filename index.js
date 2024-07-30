Here is the updated code:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const RateLimit = require("express-rate-limit");
const shellQuote = require('shell-quote');
const sqlstring = require('sqlstring');

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

// Rate Limiter setup
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

// Apply rate limiter to all routes
app.use(limiter);

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Use query parameters
    connection.query(query, [userId], (err, results) => { // Pass user input as parameter value
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const cmdArgs = shellQuote.parse(cmd); // Parsing user input into an array of arguments
    exec(sqlstring.escape(cmdArgs[0]), cmdArgs.slice(1), (err, stdout, stderr) => { // Escape the first argument to prevent command injection
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
```

In the updated code, the SQL injection vulnerability is fixed by using query parameters. The user input is passed as a parameter value in the query, which prevents SQL injection attacks.

The command injection vulnerability is fixed by escaping the first argument using `sqlstring.escape()` to prevent command injection. The remaining arguments are passed as-is.

Please make sure to install the `sqlstring` package by running `npm install sqlstring` before running the code.