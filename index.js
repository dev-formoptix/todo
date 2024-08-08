const express = require('express');
const mysql = require('mysql');
const { execSync, spawnSync } = require('child_process');
const crypto = require('crypto');
const hidePoweredBy = require('hide-powered-by');

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

// Disable x-powered-by header
app.disable('x-powered-by');

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?'; // Using parameterized query to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    res.send(`Change this code to not construct the OS command from user-controlled data.`);
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const buffer = crypto.randomBytes(4);
    const randomNumber = buffer.readUInt32LE(0) / 0xffffffff; // Secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

// Middleware to hide powered by header
app.use(hidePoweredBy());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});