const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// MySQL connection setup using environment variables
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
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
    spawn(cmd, [], { shell: false, stdio: 'pipe' }) // Safe command execution without spawning a shell
        .stdout.on('data', (data) => {
            res.send(`Output: ${data}`);
        })
        .on('error', (err) => {
            res.send(`Error: ${err.message}`);
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