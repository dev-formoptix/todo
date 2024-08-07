const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');
const crypto = require('crypto');
const helmet = require('helmet');

const app = express();
const port = 3000;

// Disable x-powered-by header
app.disable('x-powered-by');

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: process.env.MYSQL_URL,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE 
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Use parameterized query to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const child = spawn(cmd, { shell: false }); // Use spawn with shell: false to prevent command injection
    let output = '';
    let error = '';

    child.stdout.on('data', (data) => {
        output += data;
    });

    child.stderr.on('data', (data) => {
        error += data;
    });

    child.on('close', (code) => {
        if (code === 0) {
            res.send(`Output: ${output}`);
        } else {
            res.send(`Error: ${error}`);
        }
    });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const array = new Uint32Array(1);
    crypto.randomFillSync(array); // Secure random number generation
    const randomNumber = array[0] / Math.pow(2, 32); // Normalize the random number between 0 and 1
    res.send(`Random number: ${randomNumber}`);
});

app.use(helmet.hidePoweredBy());
app.use(helmet());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});