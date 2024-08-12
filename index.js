const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const crypto = require('crypto');
const helmet = require("helmet");

const app = express();
const port = 3000;

// Disable x-powered-by header
app.disable("x-powered-by");

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
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    // Fix: Use a whitelist of allowed commands instead of executing user-controlled data directly
    const allowedCommands = ['echo', 'ls', 'pwd']; // Add more commands as needed
    if (allowedCommands.includes(cmd)) {
        exec(allowedCommands[cmd], (err, stdout, stderr) => {
            if (err) {
                res.send(`Error: ${stderr}`);
                return;
            }
            res.send(`Output: ${stdout}`);
        });
    } else {
        res.send('Invalid command');
    }
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const buf = crypto.randomBytes(4);
    const randomNumber = buf.readUInt32BE(0) / 0xffffffff; // Secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.use(helmet.hidePoweredBy());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});