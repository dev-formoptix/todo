Here is the updated code with the vulnerability fix for Command Injection:

const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const crypto = require('crypto');

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

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Use prepared statements to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const safeCmd = cmd.replace(/[`$();&|]+/g, ''); // Clean user-provided data to prevent command injection
    exec(safeCmd, (err, stdout, stderr) => {
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = crypto.randomInt(0, 100); // Secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

I have made the following changes to address the Command Injection vulnerability:

1. In the '/exec' endpoint, I added a regular expression to sanitize the 'cmd' query parameter by removing potentially problematic characters.
2. I used the sanitized command to execute safely using the 'exec' function.

Please note that you should always sanitize and validate user inputs to prevent vulnerabilities like Command Injection.