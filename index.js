const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');
const crypto = require('crypto');

const app = express();
const port = 3000;

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
    const query = 'SELECT * FROM users WHERE id = ?'; // Use parameterized query to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = cmd.split(' ');

    const childProcess = spawn(args[0], args.slice(1));

    let output = '';
    let error = '';

    childProcess.stdout.on('data', (data) => {
        output += data;
    });

    childProcess.stderr.on('data', (data) => {
        error += data;
    });

    childProcess.on('close', (code) => {
        if (code !== 0) {
            res.send(`Error: ${error}`);
        } else {
            res.send(`Output: ${output}`);
        }
    });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const array = new Uint32Array(1);
    crypto.randomFillSync(array);
    const randomNumber = array[0] / 4294967295; // Scaling the random number between 0 and 1
    res.send(`Random number: ${randomNumber}`);
});

// Disable x-powered-by header
app.disable('x-powered-by');

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});