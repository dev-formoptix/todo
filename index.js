const express = require('express');
const mysql = require('mysql');
const { execFile, spawnSync } = require('child_process');
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

// Disable x-powered-by header
app.disable("x-powered-by");

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
    const command = req.query.command;
    execFile(command, (error, stdout, stderr) => {
        if (error) {
            res.send(error.message);
        } else {
            res.send(stdout);
        }
    });
});

// Secure version information disclosure using helmet
app.use(helmet.hidePoweredBy());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});