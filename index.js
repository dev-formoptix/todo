const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const RateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
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
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', limiter, (req, res) => {
    const cmd = req.query.cmd;
    const args = cmd.split(" ");
    execFile(args[0], args.slice(1), (err, stdout, stderr) => {
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', limiter, (req, res) => {
    const randomNumber = Math.random();
    res.send(`Random number: ${randomNumber}`);
});

// New code with rate limiting for file access
app.get('/:path', limiter, (req, res) => {
    let path = req.params.path;
    if (isValidPath(path))
        res.sendFile(path); // Vulnerability: The user-provided path is being directly passed to the res.sendFile() method without any validation or sanitization. This can be exploited by an attacker to read arbitrary files from the server's filesystem.
});

function isValidPath(path) {
    // Determine if the path is valid, e.g., check for allowed file types, etc.
    // Return true or false based on the validation result
    // Add validation or sanitization logic here to ensure only allowed files are served
    // Example validation: whitelist certain file extensions or check against a list of allowed paths
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});