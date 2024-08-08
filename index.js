const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
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
    const query = `SELECT * FROM users WHERE id = ${userId}`; // Vulnerable to SQL injection
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const commandArgs = cmd.split(" "); // Splitting the command into arguments
    spawnSync(commandArgs[0], commandArgs.slice(1), { shell: false }); // Using spawnSync instead of exec to avoid shell execution
    res.send(`Command executed successfully`);
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