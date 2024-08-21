const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const crypto = require('crypto');
const helmet = require('helmet');

dotenv.config();

const app = express();
const port = 3000;

// Disable x-powered-by header
app.disable('x-powered-by');

// MySQL connection setup (replace with your own credentials)
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
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = cmd.split(' ');
    const spawnedProcess = spawn(args[0], args.slice(1)); // Use spawn instead of exec to prevent command injection
    let output = '';

    spawnedProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    spawnedProcess.stderr.on('data', (data) => {
        output += `Error: ${data.toString()}`;
    });

    spawnedProcess.on('close', (code) => {
        res.send(`Output: ${output}`);
    });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const array = new Uint32Array(1);
    crypto.randomFillSync(array);
    const randomNumber = array[0] / (Math.pow(2, 32) - 1); // Secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});