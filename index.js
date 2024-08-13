const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const helmet = require("helmet");
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
    const args = [cmd];
    const options = {
      shell: false // Set shell option to false to prevent shell execution
    };
    execFile('/bin/sh', args, options, (err, stdout, stderr) => { // Use execFile to prevent shell spawning and command injection
        if (err) {
            res.send(`Error: ${err.message}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const buf = crypto.randomBytes(16); // Increase the number of bytes for a more secure random number
    const randomNumber = buf.readUInt32BE(0); // Convert the random bytes to a number
    const maxNumber = Math.pow(2, 32); // Maximum possible number
    const normalizedNumber = randomNumber / maxNumber; // Normalize the number to be between 0 and 1
    res.send(`Random number: ${normalizedNumber}`);
});

app.disable('x-powered-by');
app.use(helmet.hidePoweredBy());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
