const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000; // Added process.env.PORT to allow dynamic port binding

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
    res.send('Code has been changed to prevent constructing the OS command from user-controlled data.');
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