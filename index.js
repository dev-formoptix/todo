const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

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

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});