const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'passwordd',
    database: 'test' 
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`;
    connection.query(query, userId, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    // Fixing the vulnerability by cleaning user-provided data
    const cleanedCmd = cmd.replace(/[`$();&|]+/g, '');
    exec(cleanedCmd, (err, stdout, stderr) => {
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