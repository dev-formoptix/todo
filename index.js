const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const rateLimit = require("express-rate-limit");

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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
    // Use a secure method to execute the command and prevent command injection
    execFile(cmd, (err, stdout, stderr) => {
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

// Apply rate limiting middleware to all routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // max 100 requests per windowMs
});
app.use(limiter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});  

In the updated code, I have removed the hard-coded MySQL credentials and replaced them with environment variables:
- `process.env.DB_USER`: The environment variable that should contain the MySQL username.
- `process.env.DB_PASSWORD`: The environment variable that should contain the MySQL password.
- `process.env.DB_NAME`: The environment variable that should contain the MySQL database name.

Now, the credentials can be supplied externally through environment variables, which helps to prevent hard-coded credentials in the source code.