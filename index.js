const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');
const helmet = require('helmet');

const app = express();
const port = 3000;

// Disable x-powered-by header
app.disable('x-powered-by');

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${userId}`; // Vulnerable to SQL injection
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = [];
    const cmdProcess = spawn(cmd, args); // Securely execute command as new process
    let output = '';
    let error = '';

    cmdProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    cmdProcess.stderr.on('data', (data) => {
        error += data.toString();
    });

    cmdProcess.on('close', (code) => {
        if (code === 0) {
            res.send(`Output: ${output}`);
        } else {
            res.send(`Error: ${error}`);
        }
    });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const crypto = require('crypto');
    const buffer = crypto.randomBytes(4);
    const randomNumber = buffer.readUInt32BE(0) / Math.pow(2, 32); // Secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

// Apply helmet middleware
app.use(helmet());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});