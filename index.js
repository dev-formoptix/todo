const express = require('express');
const mysql = require('mysql');
const { spawnSync } = require('child_process');
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
    const query = 'SELECT * FROM users WHERE id = ?'; // Use parameterized queries to avoid SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    res.send('Command execution is currently disabled.');
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const buf = crypto.randomBytes(1); // Secure random number generation
    const randomNumber = buf[0] / 255; // Normalize to get a random number between 0 and 1
    res.send(`Random number: ${randomNumber}`);
});

app.use(helmet.hidePoweredBy()); // Use helmet's hidePoweredBy middleware to hide the x-powered-by header

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});