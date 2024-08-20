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
    const query = `SELECT * FROM users WHERE id = ?`; // Use parameterized query to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', limiter, (req, res) => {
    const cmd = req.query.cmd;
    const args = cmd.split(" "); // Split the command into an array of arguments
    execFile(args[0], args.slice(1), (err, stdout, stderr) => { // Use execFile instead of exec to prevent command injection
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', limiter, (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

// New code with rate limiting for file access
app.get('/:path', limiter, (req, res) => {
    let path = req.params.path;
    if (isValidPath(path))
        res.sendFile(path);
});

function isValidPath(path) {
    // Determine if the path is valid, e.g., check for allowed file types, etc.
    // Return true or false based on the validation result
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});